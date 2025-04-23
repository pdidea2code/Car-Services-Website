const Order = require("../../models/Order");
const User = require("../../models/User");
const Service = require("../../models/Service");
const PromoCode = require("../../models/Promocode");
const Review = require("../../models/Review");
const Content = require("../../models/Contect");
const {
  successResponse,
  queryErrorRelatedResponse,
} = require("../../helper/sendResponse");

const getKPIMetrics = async (req, res, next) => {
  try {
    // 1. Total Orders and Breakdown by Status
    const orderStats = await Order.aggregate([
      {
        $match: {
          $or: [
            // Include all orders for other statuses (COMPLETED, CANCELLED)
            { order_status: { $in: ["COMPLETED", "CANCELLED"] } },
            // Include PENDING orders with specific payment conditions
            {
              order_status: "PENDING",
              $or: [
                { paymentmode: "ONLINE", paymentstatus: "SUCCESS" },
                { paymentmode: "COD", paymentstatus: "PENDING" },
              ],
            },
          ],
        },
      },
      {
        $group: {
          _id: "$order_status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Calculate total orders and breakdown
    const totalOrders = orderStats.reduce((sum, stat) => sum + stat.count, 0);
    const orderBreakdown = {
      total: totalOrders,
      pending: orderStats.find((stat) => stat._id === "PENDING")?.count || 0,
      completed:
        orderStats.find((stat) => stat._id === "COMPLETED")?.count || 0,
      cancelled:
        orderStats.find((stat) => stat._id === "CANCELLED")?.count || 0,
    };

    // 2. Total Revenue (Sum of total_amount for SUCCESS payments)
    const revenueStats = await Order.aggregate([
      { $match: { paymentstatus: "SUCCESS" } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$total_amount" },
        },
      },
    ]);

    const totalRevenue = revenueStats[0]?.totalRevenue || 0;

    // 3. Total Users and Verified Users
    const userStats = await User.aggregate([
      {
        $group: {
          _id: "$isverified",
          count: { $sum: 1 },
        },
      },
    ]);

    const totalUsers = userStats.reduce((sum, stat) => sum + stat.count, 0);
    const verifiedUsers =
      userStats.find((stat) => stat._id === true)?.count || 0;

    // 4. Total Active Services
    const totalServices = await Service.countDocuments({
      status: true,
      isDeleted: false,
    });

    // 5. Promo Code Usage and Total Discount Amount
    const promoStats = await PromoCode.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          totalUses: { $sum: "$usesCount" },
          totalDiscountAmount: { $sum: "$totalDiscountAmount" },
        },
      },
    ]);

    const totalPromoUses = promoStats[0]?.totalUses || 0;
    const totalPromoDiscount = promoStats[0]?.totalDiscountAmount || 0;

    // Combine all metrics into response
    const kpiMetrics = {
      orders: orderBreakdown,
      revenue: totalRevenue.toFixed(2),
      users: {
        total: totalUsers,
        verified: verifiedUsers,
      },
      services: totalServices,
      promo: {
        totalUses: totalPromoUses,
        totalDiscountAmount: totalPromoDiscount.toFixed(2),
      },
    };

    successResponse(res, kpiMetrics);
  } catch (error) {
    next(error);
  }
};

const getRecentActivity = async (req, res, next) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0); // Midnight of today
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999); // End of today

    // 1. Fetch Today's Orders (Filtered by PENDING status and payment conditions)
    const todayOrders = await Order.find({
      createdAt: { $gte: todayStart, $lte: todayEnd },
      order_status: "PENDING",
      $or: [
        { paymentmode: "ONLINE", paymentstatus: "SUCCESS" },
        { paymentmode: "COD", paymentstatus: "PENDING" },
      ],
    })
      .select("order_id name total_amount order_status paymentstatus date time")
      .sort({ createdAt: -1 }) // Sort by newest first
      .limit(10) // Limit to 10 orders
      .lean(); //

    // 1. Fetch Recent Orders (Latest 10)
    const recentOrders = await Order.find()
      .select("order_id name total_amount order_status paymentstatus createdAt")
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    // 2. Fetch New Users (Latest 10)
    const newUsers = await User.find()
      .select("name email isverified createdAt")
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    // Combine into response
    const recentActivity = {
      orders: recentOrders,
      todayOrders: todayOrders,
      users: newUsers,
    };

    successResponse(res, recentActivity);
  } catch (error) {
    next(error);
  }
};

const getOrderStatusBreakdown = async (req, res, next) => {
  try {
    // 1. Aggregate Order Status Breakdown
    const orderStatusStats = await Order.aggregate([
      {
        $match: {
          $or: [
            { order_status: { $in: ["COMPLETED", "CANCELLED"] } },
            {
              order_status: "PENDING",
              $or: [
                { paymentmode: "ONLINE", paymentstatus: "SUCCESS" },
                { paymentmode: "COD", paymentstatus: "PENDING" },
              ],
            },
          ],
        },
      },
      {
        $group: {
          _id: "$order_status",
          count: { $sum: 1 },
        },
      },
    ]);

    const totalOrders = orderStatusStats.reduce(
      (sum, stat) => sum + stat.count,
      0
    );
    const orderStatusBreakdown = {
      pending: {
        count:
          orderStatusStats.find((stat) => stat._id === "PENDING")?.count || 0,
        percentage: totalOrders
          ? parseFloat(
              (
                ((orderStatusStats.find((stat) => stat._id === "PENDING")
                  ?.count || 0) /
                  totalOrders) *
                100
              ).toFixed(2)
            )
          : 0,
      },
      completed: {
        count:
          orderStatusStats.find((stat) => stat._id === "COMPLETED")?.count || 0,
        percentage: totalOrders
          ? parseFloat(
              (
                ((orderStatusStats.find((stat) => stat._id === "COMPLETED")
                  ?.count || 0) /
                  totalOrders) *
                100
              ).toFixed(2)
            )
          : 0,
      },
      cancelled: {
        count:
          orderStatusStats.find((stat) => stat._id === "CANCELLED")?.count || 0,
        percentage: totalOrders
          ? parseFloat(
              (
                ((orderStatusStats.find((stat) => stat._id === "CANCELLED")
                  ?.count || 0) /
                  totalOrders) *
                100
              ).toFixed(2)
            )
          : 0,
      },
      total: totalOrders,
    };

    // 2. Aggregate Payment Status Breakdown
    const paymentStatusStats = await Order.aggregate([
      {
        $group: {
          _id: "$paymentstatus",
          count: { $sum: 1 },
        },
      },
    ]);

    const paymentStatusBreakdown = {
      pending: {
        count:
          paymentStatusStats.find((stat) => stat._id === "PENDING")?.count || 0,
        percentage: totalOrders
          ? parseFloat(
              (
                ((paymentStatusStats.find((stat) => stat._id === "PENDING")
                  ?.count || 0) /
                  totalOrders) *
                100
              ).toFixed(2)
            )
          : 0,
      },
      success: {
        count:
          paymentStatusStats.find((stat) => stat._id === "SUCCESS")?.count || 0,
        percentage: totalOrders
          ? parseFloat(
              (
                ((paymentStatusStats.find((stat) => stat._id === "SUCCESS")
                  ?.count || 0) /
                  totalOrders) *
                100
              ).toFixed(2)
            )
          : 0,
      },
      failed: {
        count:
          paymentStatusStats.find((stat) => stat._id === "FAILED")?.count || 0,
        percentage: totalOrders
          ? parseFloat(
              (
                ((paymentStatusStats.find((stat) => stat._id === "FAILED")
                  ?.count || 0) /
                  totalOrders) *
                100
              ).toFixed(2)
            )
          : 0,
      },
      refunded: {
        count:
          paymentStatusStats.find((stat) => stat._id === "REFUNDED")?.count ||
          0,
        percentage: totalOrders
          ? parseFloat(
              (
                ((paymentStatusStats.find((stat) => stat._id === "REFUNDED")
                  ?.count || 0) /
                  totalOrders) *
                100
              ).toFixed(2)
            )
          : 0,
      },
      total: totalOrders,
    };

    // 3. Aggregate Payment Mode Breakdown (Using the same filtered dataset as orderStatus)
    const paymentModeStats = await Order.aggregate([
      {
        $match: {
          $or: [
            { order_status: { $in: ["COMPLETED", "CANCELLED"] } },
            {
              order_status: "PENDING",
              $or: [
                { paymentmode: "ONLINE", paymentstatus: "SUCCESS" },
                { paymentmode: "COD", paymentstatus: "PENDING" },
              ],
            },
          ],
        },
      },
      {
        $group: {
          _id: "$paymentmode",
          count: { $sum: 1 },
        },
      },
    ]);

    const paymentModeBreakdown = {
      online: {
        count:
          paymentModeStats.find((stat) => stat._id === "ONLINE")?.count || 0,
        percentage: totalOrders
          ? parseFloat(
              (
                ((paymentModeStats.find((stat) => stat._id === "ONLINE")
                  ?.count || 0) /
                  totalOrders) *
                100
              ).toFixed(2)
            )
          : 0,
      },
      cod: {
        count: paymentModeStats.find((stat) => stat._id === "COD")?.count || 0,
        percentage: totalOrders
          ? parseFloat(
              (
                ((paymentModeStats.find((stat) => stat._id === "COD")?.count ||
                  0) /
                  totalOrders) *
                100
              ).toFixed(2)
            )
          : 0,
      },
      total: totalOrders,
    };

    // Combine into response
    const breakdown = {
      orderStatus: orderStatusBreakdown,
      paymentStatus: paymentStatusBreakdown,
      paymentMode: paymentModeBreakdown,
    };

    successResponse(res, breakdown);
  } catch (error) {
    next(error);
  }
};
const getTopServicesAndAddons = async (req, res, next) => {
  try {
    // 1. Aggregate Top 5 Services
    const topServicesStats = await Order.aggregate([
      { $group: { _id: "$service_id", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "services",
          localField: "_id",
          foreignField: "_id",
          as: "service_info",
        },
      },
      { $unwind: "$service_info" },
      {
        $project: {
          service_id: "$_id",
          name: "$service_info.name",
          price: "$service_info.price",
          count: 1,
        },
      },
    ]);

    // 2. Aggregate Top 5 Addons (assuming addons_id is an array in Order)
    const topAddonsStats = await Order.aggregate([
      { $unwind: "$addons_id" },
      { $group: { _id: "$addons_id", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "addons",
          localField: "_id",
          foreignField: "_id",
          as: "addon_info",
        },
      },
      { $unwind: "$addon_info" },
      {
        $project: {
          addons_id: "$_id",
          name: "$addon_info.name",
          price: "$addon_info.price",
          count: 1,
        },
      },
    ]);

    // Combine into response
    const breakdown = {
      topServices: topServicesStats,
      topAddons: topAddonsStats,
    };

    successResponse(res, breakdown);
  } catch (error) {
    next(error);
  }
};

const getSystemHealthAlerts = async (req, res, next) => {
  try {
    // 1. Count Pending Reviews (is_approved: false)
    const pendingReviewsCount = await Review.countDocuments({
      status: false,
    });

    // 2. Count Inactive Services (status: false or isDeleted: true)
    const inactiveServicesCount = await Service.countDocuments({
      $or: [{ status: false }, { isDeleted: true }],
    });

    // 3. Count Expired Promo Codes (expirationDate < current date)
    const currentDate = new Date(); // April 11, 2025
    const expiredPromoCodesCount = await PromoCode.countDocuments({
      expirationDate: { $lt: currentDate },
    });

    const unseenContent = await Content.find({
      seen: false,
    });

    // Combine into response
    const alerts = {
      pendingReviews: {
        count: pendingReviewsCount,
        message: `Pending Reviews: ${pendingReviewsCount}`,
      },
      inactiveServices: {
        count: inactiveServicesCount,
        message: `Inactive Services: ${inactiveServicesCount}`,
      },
      expiredPromoCodes: {
        count: expiredPromoCodesCount,
        message: `Expired Promo Codes: ${expiredPromoCodesCount}`,
      },
      unseenContent: {
        count: unseenContent.length,
        message: `Unseen User Contact message: ${unseenContent.length}`,
      },
    };

    successResponse(res, alerts);
  } catch (error) {
    next(error);
  }
};
module.exports = {
  getKPIMetrics,
  getRecentActivity,
  getOrderStatusBreakdown,
  getTopServicesAndAddons,
  getSystemHealthAlerts,
};
