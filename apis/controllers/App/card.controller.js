require("dotenv").config();
const Card = require("../../models/Card");
const {
  successResponse,
  queryErrorRelatedResponse,
} = require("../../helper/sendResponse");
const User = require("../../models/User");
const AppSetting = require("../../models/AppSetting");

let Stripe;

// Initialize Stripe
const initializeStripe = async () => {
  try {
    const appSetting = await AppSetting.findOne({});
    if (!appSetting?.stripe_secret_key) {
      throw new Error("Stripe secret key not found");
    }
    Stripe = require("stripe")(appSetting.stripe_secret_key);
  } catch (error) {
    console.error("Stripe initialization failed:", error);
    process.exit(1);
  }
};

// Call this during app startup
initializeStripe();

// Helper function to get or create a Customer
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

const getCard = async (req, res, next) => {
  try {
    const card = await Card.find({ userid: req.user._id });
    successResponse(res, card);
  } catch (error) {
    next(error);
  }
};

// Add a card with SetupIntent
const addCard = async (req, res, next) => {
  const { card_number, expiryMonth, expiryYear, cvv } = req.body;
  try {
    const customer = await getOrCreateCustomer(req.user);
    const setupIntent = await Stripe.setupIntents.create({
      customer: customer.id,
      payment_method_types: ["card"],
      usage: "off_session",
    });

    successResponse(res, { client_secret: setupIntent.client_secret });
  } catch (error) {
    next(error);
  }
};
const saveCard = async (req, res, next) => {
  const {
    paymentMethodId,
    last4,
    cardholderName,
    expiryMonth,
    expiryYear,
    cardType,
  } = req.body;
  try {
    const card = new Card({
      userid: req.user._id,
      paymentMethodId,
      last4,
      cardholderName,
      expiryMonth,
      expiryYear,
      cardType,
      status: true,
    });
    await card.save();
    successResponse(res);
  } catch (error) {
    next(error);
  }
};

const deleteCard = async (req, res, next) => {
  const { id } = req.body;
  try {
    await Card.softDelete(id);
    successResponse(res, "Card deleted successfully");
  } catch (error) {
    next(error);
  }
};

module.exports = { addCard, saveCard, getCard, deleteCard };
