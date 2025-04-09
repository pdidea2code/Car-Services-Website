const express = require("express");
const router = express.Router();
const Card = require("../models/Card");
const Payment = require("../models/Payment");
require("dotenv").config();

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error(
    "STRIPE_SECRET_KEY is not defined in the environment variables"
  );
}

const Stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Helper function to get or create a Customer
const getOrCreateCustomer = async (userId) => {
  let customer = await Stripe.customers.list({
    email: `${userId}@example.com`,
  });
  if (!customer.data.length) {
    customer = await Stripe.customers.create({
      email: `${userId}@example.com`,
      name: userId,
    });
  } else {
    customer = customer.data[0];
  }
  return customer;
};

// Fetch user's cards
router.get("/cards", async (req, res) => {
  const { userId } = req.query;
  try {
    const cards = await Card.find({ userId });
    res.status(200).json(cards);
  } catch (error) {
    console.error("Error fetching cards:", error);
    res.status(500).json({ error: error.message });
  }
});

// Add a card with SetupIntent
router.post("/add-card", async (req, res) => {
  const { userId } = req.body;
  try {
    const customer = await getOrCreateCustomer(userId);
    const setupIntent = await Stripe.setupIntents.create({
      customer: customer.id,
      payment_method_types: ["card"],
      usage: "off_session",
    });

    res.status(200).json({ client_secret: setupIntent.client_secret });
  } catch (error) {
    console.error("Add card error:", error);
    res.status(500).json({ error: error.message });
  }
});

router.delete("/delete-card/:cardId", async (req, res) => {
  const { cardId } = req.params;
  try {
    const card = await Card.findById(cardId);
    if (!card) {
      return res.status(404).json({ error: "Card not found" });
    }

    // Optional: Detach the payment method from Stripe customer
    await Stripe.paymentMethods.detach(card.paymentMethodId);

    // Remove from local database
    await Card.findByIdAndDelete(cardId);

    res.status(200).json({ message: "Card deleted successfully" });
  } catch (error) {
    console.error("Delete card error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Save card after confirmation
router.post("/save-card", async (req, res) => {
  const {
    userId,
    paymentMethodId,
    last4,
    cardholderName,
    expiryMonth,
    expiryYear,
    cardType,
  } = req.body;
  try {
    const card = new Card({
      userId,
      paymentMethodId,
      last4,
      cardholderName,
      expiryMonth,
      expiryYear,
      cardType,
    });
    await card.save();
    res.status(201).json(card);
  } catch (error) {
    console.error("Save card error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Process payment (for saved card payments)
router.post("/payment", async (req, res) => {
  const { userId, cardId, amount } = req.body;
  try {
    if (!amount || isNaN(amount) || amount <= 0) {
      throw new Error("Invalid amount");
    }

    const customer = await getOrCreateCustomer(userId);
    let paymentIntent;

    if (cardId) {
      const card = await Card.findById(cardId);
      if (!card) return res.status(404).json({ error: "Card not found" });

      try {
        paymentIntent = await Stripe.paymentIntents.create({
          amount: Math.round(amount * 100),
          currency: "usd",
          customer: customer.id,
          payment_method: card.paymentMethodId,
          payment_method_types: ["card"],
          confirm: true,
          off_session: true,
        });

        if (paymentIntent.status === "succeeded") {
          const payment = new Payment({
            userId,
            cardId,
            amount,
            paymentIntentId: paymentIntent.id,
          });
          await payment.save();
          return res.status(200).json({ payment, paymentIntent });
        }
      } catch (error) {
        console.log("Off-session payment failed:", error.message);
        if (error.code === "authentication_required") {
          paymentIntent = await Stripe.paymentIntents.create({
            amount: Math.round(amount * 100),
            currency: "usd",
            customer: customer.id,
            payment_method: card.paymentMethodId,
            payment_method_types: ["card"],
            confirm: false,
          });
        } else {
          throw error;
        }
      }
    }

    const payment = new Payment({
      userId,
      cardId,
      amount,
      paymentIntentId: paymentIntent.id,
    });
    await payment.save();

    res.status(200).json({ payment, paymentIntent });
  } catch (error) {
    console.error("Payment endpoint error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Create Checkout Session (for "Other" payment method)
router.post("/create-checkout-session", async (req, res) => {
  const { userId, amount } = req.body;

  try {
    if (!amount || isNaN(amount) || amount <= 0) {
      throw new Error("Invalid amount");
    }

    const customer = await getOrCreateCustomer(userId);

    const session = await Stripe.checkout.sessions.create({
      payment_method_types: ["card"], // Only card payments for "Other"
      customer: customer.id,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Payment",
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/payment?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment?canceled=true`,
      metadata: {
        userId,
      },
    });

    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error("Create checkout session error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Verify payment
router.post("/verify-payment", async (req, res) => {
  const { paymentId, status } = req.body;
  try {
    const payment = await Payment.findByIdAndUpdate(
      paymentId,
      { status },
      { new: true }
    );
    res.status(200).json(payment);
  } catch (error) {
    console.error("Verify payment error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Refund payment
router.post("/refund", async (req, res) => {
  const { paymentId } = req.body;
  try {
    const payment = await Payment.findById(paymentId);
    if (!payment) return res.status(404).json({ error: "Payment not found" });
    if (payment.status !== "completed") {
      return res
        .status(400)
        .json({ error: "Can only refund completed payments" });
    }

    const refund = await Stripe.refunds.create({
      payment_intent: payment.paymentIntentId,
    });

    await Payment.findByIdAndUpdate(paymentId, { status: "refunded" });
    res.status(200).json({ refund });
  } catch (error) {
    console.error("Refund error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Fetch user's payments
router.get("/payments", async (req, res) => {
  const { userId } = req.query;
  try {
    const payments = await Payment.find({ userId }).populate(
      "cardId",
      "last4 cardholderName cardType"
    );
    res.status(200).json(payments);
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({ error: error.message });
  }
});

// Webhook to handle payment verification
// router.post(
//   "/webhook",
//   // Remove redundant middleware here; it's handled in server.js
//   async (req, res) => {
//     const sig = req.headers["stripe-signature"];
//     let event;

//     // Debug: Log the raw body type and content
//     console.log("Raw req.body type:", typeof req.body);
//     console.log("Raw req.body:", req.body.toString());

//     try {
//       if (!process.env.STRIPE_WEBHOOK_SECRET) {
//         throw new Error("STRIPE_WEBHOOK_SECRET is not defined");
//       }
//       event = Stripe.webhooks.constructEvent(
//         req.body, // Should be a Buffer or string
//         sig,
//         process.env.STRIPE_WEBHOOK_SECRET
//       );
//     } catch (err) {
//       console.error("Webhook signature verification failed:", err);
//       return res.status(400).send(`Webhook Error: ${err.message}`);
//     }

//     // Handle the event
//     if (event.type === "checkout.session.completed") {
//       const session = event.data.object;
//       const userId = session.metadata.userId;
//       const amount = session.amount_total / 100;

//       try {
//         const payment = new Payment({
//           userId,
//           amount,
//           paymentIntentId: session.payment_intent,
//           status: "completed",
//           paymentMethod: "card",
//         });
//         await payment.save();
//         console.log("Payment saved successfully:", payment);
//       } catch (error) {
//         console.error("Error saving payment from webhook:", error);
//       }
//     } else {
//       console.log(`Unhandled event type: ${event.type}`);
//     }

//     res.json({ received: true });
//   }
// );

module.exports = router;
