const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
var bodyParser = require("body-parser");
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

// cors configurations
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

mongoose.connect(process.env.DB_CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(cors());
// app.use(express.json());

// app.use(express.json());

app.post("/webhook", bodyParser.raw({ type: "application/json" }), async (req, res, next) => {
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

      const order = await Order.findOne({
        paymentIntentId: session.id,
      });

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
      const order = await Order.findOne({
        paymentIntentId: session.id,
      });
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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const adminRoutes = require("./routes/admin");
app.use("/api/admin", adminRoutes);

//App route
const userRoute = require("./routes/app");
app.use("/api/user", userRoute);

// Error handling middleware
app.use(errorController);

// Define static files
app.use("/public", express.static(path.join(__dirname, "./public/images/")));
app.use("/userprofileimg", express.static(path.join(__dirname, "./public/userprofileimg/")));
app.use("/showcaseimg", express.static(path.join(__dirname, "./public/showcaseimg/")));
app.use("/serviceimg", express.static(path.join(__dirname, "./public/serviceimg/")));
app.use("/addonsimg", express.static(path.join(__dirname, "./public/addonsimg/")));
app.use("/appsettingimg", express.static(path.join(__dirname, "./public/appsettingimg/")));
app.use("/blogimg", express.static(path.join(__dirname, "./public/blogimg/")));
app.use("/userthemeimg", express.static(path.join(__dirname, "./public/userthemeimg/")));
app.use("/popupimage", express.static(path.join(__dirname, "./public/popupimage/")));
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error"));
db.once("open", function () {
  console.log("Connected Successfully");
});

// var server = app.listen(5000);
const port = process.env.PORT || 5055;
http.listen(port, () => console.log(`http://localhost:${port}`));
