const Order = require("../../models/Order");
const { successResponse, queryErrorRelatedResponse } = require("../../helper/sendResponse");

const getOrder = async (req, res, next) => {
  try {
    const orders = await Order.find({})
      .populate("service_id")
      .populate("cartype_id")
      .populate("promocode_id")
      .populate("address_id")
      .populate("user_id")
      .populate("addons_id")
      .sort({ date: -1 });
    successResponse(res, orders);
  } catch (error) {
    next(error);
  }
};

const getUpcomingOrder = async (req, res, next) => {
  try {
    const currentDateTime = new Date();

    const orders = await Order.find({
      $expr: {
        $gte: [
          {
            $dateFromString: {
              dateString: {
                $concat: [{ $dateToString: { format: "%Y-%m-%d", date: "$date" } }, "T", "$time", ":00.000Z"],
              },
            },
          },
          currentDateTime,
        ],
      },
    })
      .populate("service_id")
      .populate("cartype_id")
      .populate("promocode_id")
      .populate("address_id")
      .populate("user_id")
      .populate("addons_id")
      .sort({ date: -1 });

    successResponse(res, orders);
  } catch (error) {
    next(error);
  }
};

const getPastOrder = async (req, res, next) => {
  try {
    const orders = await Order.find({
      date: { $lt: new Date() },
    })
      .populate("service_id")
      .populate("cartype_id")
      .populate("promocode_id")
      .populate("address_id")
      .populate("user_id")
      .populate("addons_id")
      .sort({ date: -1 });

    successResponse(res, orders);
  } catch (error) {
    next(error);
  }
};

const getTodayOrder = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1); // Start of tomorrow

    const orders = await Order.find({
      date: {
        $gte: today,
        $lt: tomorrow,
      },
    })
      .populate("service_id")
      .populate("cartype_id")
      .populate("promocode_id")
      .populate("address_id")
      .populate("user_id")
      .populate("addons_id")
      .sort({ date: -1 });

    successResponse(res, orders);
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { id, order_status } = req.body;

    // Validate input
    if (!id || !order_status) {
      return queryErrorRelatedResponse(res, 400, "Order ID and status are required");
    }

    // Check if the status is valid
    const validStatuses = ["PENDING", "COMPLETED", "CANCELLED"];
    if (!validStatuses.includes(order_status)) {
      return queryErrorRelatedResponse(res, 400, "Invalid order status");
    }

    // Find and update the order
    const order = await Order.findById(id);
    if (!order) {
      return queryErrorRelatedResponse(res, 404, "Order not found");
    }

    order.order_status = order_status;
    if (order_status === "COMPLETED" || order.paymentmode === "COD") {
      order.paymentstatus = "SUCCESS";
    }
    const updatedOrder = await order.save();

    // Populate the updated order
    const populatedOrder = await Order.findById(id)
      .populate("service_id")
      .populate("cartype_id")
      .populate("promocode_id")
      .populate("address_id");

    successResponse(res, {
      message: "Order status updated successfully",
      order: populatedOrder,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOrder,
  updateOrderStatus,
  getUpcomingOrder,
  getPastOrder,
  getTodayOrder,
};
