const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http").Server(app);
const path = require("path");
const Stripe = require("stripe");
const Order = require("./models/Order");
const PromoCode = require("./models/Promocode");
const AppSetting = require("./models/AppSetting");
const { successResponse, queryErrorRelatedResponse } = require("./helper/sendResponse");

// Get error controller
const errorController = require("./helper/errorController");

// MongoDB connection
async function connectDB() {
  try {
    await mongoose.connect(process.env.DB_CONNECTION, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit if DB connection fails
  }
}

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed methods
    credentials: true, // If you need to send cookies or auth headers
  })
);

// Webhook route for Stripe
app.post("/webhook", express.raw({ type: "application/json" }), async (req, res, next) => {
  try {
    const sig = req.headers["stripe-signature"];
    let event;
    const appSetting = await AppSetting.findOne({});
    const endpointSecret = appSetting.stripe_webhook_secret;

    try {
      event = Stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.error(err);
      return queryErrorRelatedResponse(res, 400, err.message);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const order = await Order.findOne({ paymentIntentId: session.id });

      if (!order) {
        return queryErrorRelatedResponse(res, 404, "Order not found");
      }

      const promoCode = await PromoCode.findById(order.promocode_id);
      if (promoCode) {
        promoCode.usesCount += 1;
        promoCode.user_ids.push(order.user_id);
        promoCode.totalDiscountAmount += order.discount_amount;
        await promoCode.save();
      }

      order.paymentstatus = "SUCCESS";
      order.order_status = "PENDING";
      order.paymentIntentId = session.payment_intent;
      await order.save();

      return successResponse(res, {
        message: "Payment verified and order completed successfully",
        order,
      });
    }

    if (event.type === "checkout.session.expired") {
      const session = event.data.object;
      const order = await Order.findOne({ paymentIntentId: session.id });

      if (!order) {
        return queryErrorRelatedResponse(res, 404, "Order not found");
      }

      order.paymentstatus = "FAILED";
      order.order_status = "CANCELLED";
      order.paymentIntentId = session.payment_intent;
      await order.save();

      return successResponse(res, {
        message: "Payment expired and order cancelled",
        order,
      });
    }
  } catch (error) {
    next(error);
  }
});

app.get("/Admin", (req, res) => {
  res.send("heellow");
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const adminRoutes = require("./routes/admin");
app.use("/api/admin", adminRoutes);

const userRoute = require("./routes/app");
app.use("/api/user", userRoute);

// Error handling middleware
app.use(errorController);

// Static files
app.use("/public", express.static(path.join(__dirname, "./public/images/")));
app.use("/userprofileimg", express.static(path.join(__dirname, "./public/userprofileimg/")));
app.use("/showcaseimg", express.static(path.join(__dirname, "./public/showcaseimg/")));
app.use("/serviceimg", express.static(path.join(__dirname, "./public/serviceimg/")));
app.use("/addonsimg", express.static(path.join(__dirname, "./public/addonsimg/")));
app.use("/appsettingimg", express.static(path.join(__dirname, "./public/appsettingimg/")));
app.use("/blogimg", express.static(path.join(__dirname, "./public/blogimg/")));
app.use("/userthemeimg", express.static(path.join(__dirname, "./public/userthemeimg/")));
app.use("/popupimage", express.static(path.join(__dirname, "./public/popupimage/")));

// MongoDB connection events
// const db = mongoose.connection;
// db.on("error", console.error.bind(console, "Connection Error"));
// db.once("open", function () {
//   console.log("Connected Successfully");
// });

// Start server
connectDB().then(() => {
  const port = process.env.PORT || 5055;
  app.listen(port, () => console.log(`http://localhost:${port}`));
});
