// controllers/orderController.js
const AppSetting = require("../../models/AppSetting");
const Order = require("../../models/Order"); // Import Order model
const PromoCode = require("../../models/Promocode"); // Import PromoCode model
const {
  successResponse,
  queryErrorRelatedResponse,
} = require("../../helper/sendResponse"); // Import response helpers
const Card = require("../../models/Card");
require("dotenv").config();
const Stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const getOrCreateCustomer = async (userdetails) => {
  let customer = await Stripe.customers.list({ email: `${userdetails.email}` });
  if (!customer.data.length) {
    customer = await Stripe.customers.create({
      email: `${userdetails.email}`,
      name: userdetails.name,
    });
    userdetails.stripeCustomerId = customer.id;
    await userdetails.save();
  } else {
    customer = customer.data[0];
    userdetails.stripeCustomerId = customer.id;
    await userdetails.save();
  }
  return customer;
};
// Verify Promo Code (Modified to only validate and calculate discount)
const VerifyPromoCode = async (req, res, next) => {
  try {
    const { code, orderAmount } = req.body; // Extract promo code and order amount from request body
    const userId = req.user._id; // Get authenticated user's ID

    // Validate required fields
    if (!code) {
      return queryErrorRelatedResponse(res, 400, "Promo code is required");
    }
    if (!orderAmount) {
      return queryErrorRelatedResponse(res, 400, "Payment amount is required");
    }

    // Find active promo code (case-insensitive)
    const promoCode = await PromoCode.findOne({
      code: code.toUpperCase(),
      isActive: true,
    });

    // Check if promo code exists
    if (!promoCode) {
      return queryErrorRelatedResponse(res, 404, "Invalid promo code");
    }

    const currentDate = new Date(); // Get current date for validation

    // Validate promo code start date
    if (currentDate < promoCode.startDate) {
      return queryErrorRelatedResponse(res, 400, "Promo code is not yet valid");
    }

    // Validate promo code expiration
    if (currentDate > promoCode.expirationDate) {
      return queryErrorRelatedResponse(res, 400, "Promo code expired");
    }

    // Check if user has already used this promo code
    if (promoCode.user_ids.includes(userId)) {
      return queryErrorRelatedResponse(
        res,
        400,
        "You have already used this promo code"
      );
    }

    // Check usage limit if specified
    if (promoCode.maxUses !== -1 && promoCode.usesCount >= promoCode.maxUses) {
      return queryErrorRelatedResponse(
        res,
        400,
        "Promo code usage limit reached"
      );
    }

    // Validate minimum order amount if specified
    if (
      promoCode.minimumOrderAmount &&
      orderAmount < promoCode.minimumOrderAmount
    ) {
      return queryErrorRelatedResponse(
        res,
        400,
        `Minimum payment amount of ${promoCode.minimumOrderAmount} required`
      );
    }

    // Calculate discount based on type
    let discount = 0;
    if (promoCode.discountType === "PERCENTAGE") {
      discount = (orderAmount * promoCode.discountValue) / 100; // Percentage discount
    } else {
      discount = promoCode.discountValue; // Fixed amount discount
    }

    // Send success response with discount details (no update here)
    successResponse(res, {
      discount,
      newAmount: orderAmount - discount,
      promoCode: {
        _id: promoCode._id,
        code: promoCode.code,
        discountType: promoCode.discountType,
        discountValue: promoCode.discountValue,
        minimumOrderAmount: promoCode.minimumOrderAmount,
        startDate: promoCode.startDate,
        expirationDate: promoCode.expirationDate,
      },
    });
  } catch (error) {
    next(error); // Pass errors to error handler
  }
};

// Create Order API (Updated to handle PromoCode updates)
const createOrder = async (req, res, next) => {
  try {
    // Extract fields from request body (discount_amount is optional)
    const {
      service_id,
      addons_id,
      cartype_id,
      promocode_id,
      address_id,
      date,
      time,
      additionalinfo,
      name,
      email,
      phone,
      service_amount,
      tax_amount,
      discount_amount = 0, // Default to 0 if not provided
      pickupanddrop,
      carname,
      carnumber,
      total_time,
      city,
      pincode,
      colony,
      house_no,
      paymentmode,
    } = req.body;

    const userId = req.user._id; // Get authenticated user's ID

    // Validate required fields (discount_amount is no longer required)
    if (!service_amount || !tax_amount) {
      return queryErrorRelatedResponse(
        res,
        400,
        "Service and tax amounts are required"
      );
    }
    if (!date || !time) {
      return queryErrorRelatedResponse(res, 400, "Date and time are required");
    }
    if (!name || !email || !phone) {
      return queryErrorRelatedResponse(
        res,
        400,
        "Contact details are required"
      );
    }
    if (!carname || !carnumber || !city || !pincode) {
      return queryErrorRelatedResponse(
        res,
        400,
        "Car and location details are required"
      );
    }
    if (!paymentmode) {
      return queryErrorRelatedResponse(res, 400, "Payment mode is required");
    }

    // Calculate total amount (use discount_amount, defaulting to 0)
    const total_amount = service_amount + tax_amount - discount_amount;

    // Generate a unique order_id (simple example, consider using a counter in production)
    const order_id = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Handle promo code update if provided
    let promoCode = null;
    if (promocode_id) {
      // Find the promo code by ID
      promoCode = await PromoCode.findById(promocode_id);
      if (!promoCode) {
        return queryErrorRelatedResponse(res, 404, "Promo code not found");
      }

      // Verify promo code conditions
      const currentDate = new Date();
      if (
        currentDate < promoCode.startDate ||
        currentDate > promoCode.expirationDate
      ) {
        return queryErrorRelatedResponse(
          res,
          400,
          "Promo code is not valid at this time"
        );
      }
      if (promoCode.user_ids.includes(userId)) {
        return queryErrorRelatedResponse(
          res,
          400,
          "You have already used this promo code"
        );
      }
      if (
        promoCode.maxUses !== -1 &&
        promoCode.usesCount >= promoCode.maxUses
      ) {
        return queryErrorRelatedResponse(
          res,
          400,
          "Promo code usage limit reached"
        );
      }

      // Update promo code details
      promoCode.usesCount += 1;
      promoCode.user_ids.push(userId);
      promoCode.totalDiscountAmount += discount_amount; // Use provided or default discount_amount
      await promoCode.save();
    }

    // Create new order object
    const newOrder = new Order({
      user_id: userId,
      order_id,
      service_id,
      addons_id,
      cartype_id,
      promocode_id,
      address_id,
      date,
      time,
      additionalinfo,
      name,
      email,
      phone,
      service_amount,
      tax_amount,
      discount_amount, // Will be 0 if not provided
      total_amount: total_amount.toFixed(2),
      pickupanddrop,
      carname,
      carnumber,
      city,
      total_time,
      pincode,
      colony,
      house_no,
      paymentmode,
      paymentstatus: "PENDING",
      order_status: "PENDING",
      paymentMethod: "CASH",
    });

    // Save the order to the database
    const savedOrder = await newOrder.save();

    // Send success response with the created order
    successResponse(res, {
      message: "Order created successfully",
      order: savedOrder,
    });
  } catch (error) {
    next(error); // Pass errors to error handler
  }
};
const getOrder = async (req, res, next) => {
  try {
    const orders = await Order.find({ user_id: req.user._id })
      .sort({ createdAt: -1 })
      .populate("service_id")
      .populate("cartype_id")
      .populate("promocode_id")
      .populate("address_id");
    successResponse(res, orders);
  } catch (error) {
    next(error);
  }
};

const cardpayment = async (req, res, next) => {
  try {
    const {
      service_id,
      addons_id,
      cartype_id,
      promocode_id,
      address_id,
      date,
      time,
      additionalinfo,
      name,
      email,
      phone,
      service_amount,
      tax_amount,
      total_time,
      discount_amount = 0,
      pickupanddrop,
      carname,
      carnumber,
      city,
      pincode,
      colony,
      house_no,
      paymentmode,
      cardId,
    } = req.body;

    const userId = req.user._id;

    // Validation
    if (!service_amount || !tax_amount) {
      return queryErrorRelatedResponse(
        res,
        400,
        "Service and tax amounts are required"
      );
    }
    if (!date || !time) {
      return queryErrorRelatedResponse(res, 400, "Date and time are required");
    }
    if (!name || !email || !phone) {
      return queryErrorRelatedResponse(
        res,
        400,
        "Contact details are required"
      );
    }
    if (!carname || !carnumber || !city || !pincode) {
      return queryErrorRelatedResponse(
        res,
        400,
        "Car and location details are required"
      );
    }
    if (!paymentmode) {
      return queryErrorRelatedResponse(res, 400, "Payment mode is required");
    }
    if (paymentmode === "ONLINE" && !cardId) {
      return queryErrorRelatedResponse(
        res,
        400,
        "Card ID is required for online payment"
      );
    }

    // Verify card
    const verifyCard = await Card.findOne({
      _id: cardId,
      userid: userId,
      status: true,
    });
    if (!verifyCard) {
      return queryErrorRelatedResponse(res, 404, "Card not found or invalid");
    }

    const total_amount = service_amount + tax_amount - discount_amount;
    if (!total_amount || isNaN(total_amount) || total_amount <= 0) {
      return queryErrorRelatedResponse(res, 400, "Invalid total amount");
    }

    const order_id = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Promo code validation (no update yet)
    let promoCode = null;
    if (promocode_id) {
      promoCode = await PromoCode.findById(promocode_id);
      if (!promoCode) {
        return queryErrorRelatedResponse(res, 404, "Promo code not found");
      }
      const currentDate = new Date();
      if (
        currentDate < promoCode.startDate ||
        currentDate > promoCode.expirationDate
      ) {
        return queryErrorRelatedResponse(
          res,
          400,
          "Promo code is not valid at this time"
        );
      }
      if (promoCode.user_ids.includes(userId)) {
        return queryErrorRelatedResponse(
          res,
          400,
          "You have already used this promo code"
        );
      }
      if (
        promoCode.maxUses !== -1 &&
        promoCode.usesCount >= promoCode.maxUses
      ) {
        return queryErrorRelatedResponse(
          res,
          400,
          "Promo code usage limit reached"
        );
      }
    }

    // Create order with pending status
    const order = new Order({
      user_id: userId,
      order_id,
      service_id,
      addons_id,
      cartype_id,
      promocode_id,
      address_id,
      date,
      time,
      additionalinfo,
      name,
      email,
      phone,
      service_amount,
      tax_amount,
      discount_amount,
      total_amount: total_amount.toFixed(2),
      pickupanddrop,
      carname,
      carnumber,
      city,
      pincode,
      colony,
      house_no,
      total_time,
      paymentmode,
      card_id: cardId,
      paymentstatus: "PENDING",
      order_status: "PENDING",
      paymentMethod: "CARD",
    });

    await order.save();

    // Payment processing

    const appSetting = await AppSetting.findOne({});
    const currency = appSetting?.currency || "usd"; // Fallback to "usd"
    const customer = await getOrCreateCustomer(req.user);

    let paymentIntent;
    try {
      paymentIntent = await Stripe.paymentIntents.create({
        amount: Math.round(total_amount * 100),
        currency,
        customer: customer.id,
        payment_method: verifyCard.paymentMethodId,
        payment_method_types: ["card"],
        confirm: true,
        off_session: true,
      });

      if (paymentIntent.status === "succeeded") {
        order.paymentstatus = "SUCCESS";
        order.order_status = "PENDING";
        order.paymentIntentId = paymentIntent.id;

        // Update promo code after successful payment
        if (promoCode) {
          promoCode.usesCount += 1;
          promoCode.user_ids.push(userId);
          promoCode.totalDiscountAmount += discount_amount;
          await promoCode.save();
        }

        await order.save();

        return successResponse(res, {
          message: "Order created and payment completed successfully",
          order,
          paymentIntent,
        });
      }
    } catch (error) {
      if (error.code === "authentication_required") {
        // Create a new payment intent for client-side confirmation
        paymentIntent = await Stripe.paymentIntents.create({
          amount: Math.round(total_amount * 100),
          currency,
          customer: customer.id,
          payment_method: verifyCard.paymentMethodId,
          payment_method_types: ["card"],
          confirm: false,
        });

        order.paymentIntentId = paymentIntent.id;
        await order.save();

        return successResponse(res, {
          order,
          paymentIntent,
        });
      } else {
        console.error(error);
        order.paymentstatus = "FAILED";
        await order.save();
        return queryErrorRelatedResponse(res, 400, error.message);
      }
    }
  } catch (error) {
    next(error);
  }
};

// Payment Verification Endpoint (Add this separately)
const verifyPayment = async (req, res, next) => {
  try {
    const { order_id, paymentIntentId } = req.body;
    console.log(order_id, paymentIntentId);

    if (!order_id || !paymentIntentId) {
      return queryErrorRelatedResponse(
        res,
        400,
        "Order ID and Payment Intent ID are required"
      );
    }

    const order = await Order.findOne({ _id: order_id });
    if (!order) {
      return queryErrorRelatedResponse(res, 404, "Order not found");
    }

    const paymentIntent = await Stripe.paymentIntents.retrieve(paymentIntentId);
    console.log(paymentIntent);
    if (paymentIntent.status === "succeeded") {
      order.paymentstatus = "SUCCESS";
      order.order_status = "PENDING";
      order.paymentIntentId = paymentIntentId;

      // Update promo code if applicable
      if (order.promocode_id) {
        const promoCode = await PromoCode.findById(order.promocode_id);
        if (promoCode && !promoCode.user_ids.includes(order.user_id)) {
          promoCode.usesCount += 1;

          promoCode.user_ids.push(order.user_id);
          promoCode.totalDiscountAmount += order.discount_amount;
          await promoCode.save();
        }
      }

      await order.save();

      return successResponse(res, {
        message: "Payment verified and order completed successfully",
        order,
        paymentIntent,
      });
    } else {
      order.paymentstatus = "FAILED";
      order.order_status = "CANCELLED";
      await order.save();
      return queryErrorRelatedResponse(res, 400, "Payment verification failed");
    }
  } catch (error) {
    next(error);
  }
};

const refundPayment = async (req, res, next) => {
  try {
    const { order_id } = req.body;

    const order = await Order.findOne({
      _id: order_id,
      user_id: req.user._id,
    });
    if (!order) {
      return queryErrorRelatedResponse(res, 404, "Order not found");
    }

    if (order.order_status === "COMPLETED") {
      return queryErrorRelatedResponse(res, 400, "Order is already completed");
    }
    if (order.paymentstatus === "REFUNDED") {
      return queryErrorRelatedResponse(res, 400, "Payment is already refunded");
    }
    let refund;
    if (order.paymentmode === "ONLINE") {
      if (order.paymentstatus !== "SUCCESS") {
        return queryErrorRelatedResponse(res, 400, "Payment is not successful");
      }
      if (!order.paymentIntentId) {
        return queryErrorRelatedResponse(
          res,
          400,
          "Payment intent ID is required"
        );
      }
      refund = await Stripe.refunds.create({
        payment_intent: order.paymentIntentId,
      });
      order.paymentstatus = "REFUNDED";
      order.order_status = "CANCELLED";
      await order.save();
      return successResponse(res, {
        message: "Payment refunded successfully",
        order,
        refund,
      });
    }
    if (order.paymentmode === "COD") {
      order.paymentstatus = "REFUNDED";
      order.order_status = "CANCELLED";
      await order.save();
      return successResponse(res, {
        message: "Payment refunded successfully",
        order,
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  VerifyPromoCode,
  createOrder,
  getOrder,
  cardpayment,
  verifyPayment,
  refundPayment,
};
