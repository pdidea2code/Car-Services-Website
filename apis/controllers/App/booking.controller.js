// controllers/orderController.js
const Order = require("../../models/Order"); // Import Order model
const PromoCode = require("../../models/Promocode"); // Import PromoCode model
const {
  successResponse,
  queryErrorRelatedResponse,
} = require("../../helper/sendResponse"); // Import response helpers

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
      total_amount,
      pickupanddrop,
      carname,
      carnumber,
      city,
      pincode,
      colony,
      house_no,
      paymentmode,
      paymentstatus: "PENDING",
      order_status: "PENDING",
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
      .populate("service_id")
      .populate("cartype_id")
      .populate("promocode_id")
      .populate("address_id");
    successResponse(res, orders);
  } catch (error) {
    next(error);
  }
};
module.exports = {
  VerifyPromoCode,
  createOrder,
  getOrder,
};
