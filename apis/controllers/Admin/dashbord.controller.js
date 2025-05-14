const Order = require("../../models/Order");
const User = require("../../models/User");
const Service = require("../../models/Service");
const PromoCode = require("../../models/Promocode");
const Review = require("../../models/Review");
const Content = require("../../models/Contect");
const { successResponse, queryErrorRelatedResponse } = require("../../helper/sendResponse");

// Get KPI Metrics (Total Orders, Revenue, Users, Services, Promo Usage)
const getKPIMetrics = async (req, res, next) => {
  try {
    // 1. Fetch Orders with Specific Conditions
    const orders = await Order.find({
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
    })
      .select("order_status total_amount paymentstatus")
      .lean(); // Convert to plain JavaScript objects for performance

    // Calculate Order Breakdown
    const orderBreakdown = {
      total: orders.length,
      pending: orders.filter((order) => order.order_status === "PENDING").length,
      completed: orders.filter((order) => order.order_status === "COMPLETED").length,
      cancelled: orders.filter((order) => order.order_status === "CANCELLED").length,
    };

    // 2. Calculate Total Revenue (Sum of total_amount for SUCCESS payments)
    const totalRevenue = orders
      .filter((order) => order.paymentstatus === "SUCCESS")
      .reduce((sum, order) => sum + (order.total_amount || 0), 0);

    // 3. Fetch Users and Calculate Stats
    const users = await User.find().select("isverified").lean();
    const totalUsers = users.length;
    const verifiedUsers = users.filter((user) => user.isverified).length;

    // 4. Count Active Services
    const totalServices = await Service.countDocuments({
      status: true,
      isDeleted: false,
    });

    // 5. Fetch Promo Codes and Calculate Stats
    const promoCodes = await PromoCode.find({ isActive: true }).select("usesCount totalDiscountAmount").lean();
    const totalPromoUses = promoCodes.reduce((sum, promo) => sum + (promo.usesCount || 0), 0);
    const totalPromoDiscount = promoCodes.reduce((sum, promo) => sum + (promo.totalDiscountAmount || 0), 0);

    // Combine Metrics into Response
    const kpiMetrics = {
      orders: orderBreakdown,
      revenue: totalRevenue.toFixed(2), // Format to 2 decimal places
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
    next(error); // Pass error to error-handling middleware
  }
};

// Get Recent Activity (Today's Orders, Recent Orders, New Users)
const getRecentActivity = async (req, res, next) => {
  try {
    // Define Today's Time Range
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0); // Midnight
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999); // End of day

    // 1. Fetch Today's Orders (PENDING with specific payment conditions)
    const todayOrders = await Order.find({
      createdAt: { $gte: todayStart, $lte: todayEnd },
      order_status: "PENDING",
      $or: [
        { paymentmode: "ONLINE", paymentstatus: "SUCCESS" },
        { paymentmode: "COD", paymentstatus: "PENDING" },
      ],
    })
      .select("order_id name total_amount order_status paymentstatus date time")
      .sort({ createdAt: -1 }) // Newest first
      .limit(10) // Limit to 10
      .lean();

    // 2. Fetch Recent Orders (Latest 10)
    const recentOrders = await Order.find()
      .select("order_id name total_amount order_status paymentstatus createdAt")
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    // 3. Fetch New Users (Latest 10)
    const newUsers = await User.find()
      .select("name email isverified createdAt")
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    // Combine into Response
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

// Get Order Status, Payment Status, and Payment Mode Breakdown
const getOrderStatusBreakdown = async (req, res, next) => {
  try {
    // 1. Fetch Orders with Specific Conditions
    const orders = await Order.find({
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
    })
      .select("order_status paymentstatus paymentmode")
      .lean();

    const totalOrders = orders.length;

    // 2. Calculate Order Status Breakdown
    const orderStatusBreakdown = {
      pending: {
        count: orders.filter((order) => order.order_status === "PENDING").length,
        percentage: totalOrders
          ? parseFloat((orders.filter((order) => order.order_status === "PENDING").length / totalOrders) * 100).toFixed(
              2
            )
          : 0,
      },
      completed: {
        count: orders.filter((order) => order.order_status === "COMPLETED").length,
        percentage: totalOrders
          ? parseFloat(
              (orders.filter((order) => order.order_status === "COMPLETED").length / totalOrders) * 100
            ).toFixed(2)
          : 0,
      },
      cancelled: {
        count: orders.filter((order) => order.order_status === "CANCELLED").length,
        percentage: totalOrders
          ? parseFloat(
              (orders.filter((order) => order.order_status === "CANCELLED").length / totalOrders) * 100
            ).toFixed(2)
          : 0,
      },
      total: totalOrders,
    };

    // 3. Calculate Payment Status Breakdown
    const paymentStatusBreakdown = {
      pending: {
        count: orders.filter((order) => order.paymentstatus === "PENDING").length,
        percentage: totalOrders
          ? parseFloat(
              (orders.filter((order) => order.paymentstatus === "PENDING").length / totalOrders) * 100
            ).toFixed(2)
          : 0,
      },
      success: {
        count: orders.filter((order) => order.paymentstatus === "SUCCESS").length,
        percentage: totalOrders
          ? parseFloat(
              (orders.filter((order) => order.paymentstatus === "SUCCESS").length / totalOrders) * 100
            ).toFixed(2)
          : 0,
      },
      failed: {
        count: orders.filter((order) => order.paymentstatus === "FAILED").length,
        percentage: totalOrders
          ? parseFloat((orders.filter((order) => order.paymentstatus === "FAILED").length / totalOrders) * 100).toFixed(
              2
            )
          : 0,
      },
      refunded: {
        count: orders.filter((order) => order.paymentstatus === "REFUNDED").length,
        percentage: totalOrders
          ? parseFloat(
              (orders.filter((order) => order.paymentstatus === "REFUNDED").length / totalOrders) * 100
            ).toFixed(2)
          : 0,
      },
      total: totalOrders,
    };

    // 4. Calculate Payment Mode Breakdown
    const paymentModeBreakdown = {
      online: {
        count: orders.filter((order) => order.paymentmode === "ONLINE").length,
        percentage: totalOrders
          ? parseFloat((orders.filter((order) => order.paymentmode === "ONLINE").length / totalOrders) * 100).toFixed(2)
          : 0,
      },
      cod: {
        count: orders.filter((order) => order.paymentmode === "COD").length,
        percentage: totalOrders
          ? parseFloat((orders.filter((order) => order.paymentmode === "COD").length / totalOrders) * 100).toFixed(2)
          : 0,
      },
      total: totalOrders,
    };

    // Combine into Response
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

// Get Top Services and Addons
const getTopServicesAndAddons = async (req, res, next) => {
  try {
    // 1. Fetch Orders for Service and Addon Counts
    const orders = await Order.find().select("service_id addons_id").lean();

    // 2. Count Services
    const serviceCounts = {};
    orders.forEach((order) => {
      if (order.service_id) {
        serviceCounts[order.service_id] = (serviceCounts[order.service_id] || 0) + 1;
      }
    });

    // Get Top 5 Service IDs
    const topServiceIds = Object.entries(serviceCounts)
      .sort((a, b) => b[1] - a[1]) // Sort by count descending
      .slice(0, 5)
      .map(([id]) => id);

    // Fetch Service Details
    const topServices = await Service.find({ _id: { $in: topServiceIds } })
      .select("name price")
      .lean();
    const topServicesStats = topServices.map((service) => ({
      service_id: service._id,
      name: service.name,
      price: service.price,
      count: serviceCounts[service._id] || 0,
    }));

    // 3. Count Addons
    const addonCounts = {};
    orders.forEach((order) => {
      if (order.addons_id && Array.isArray(order.addons_id)) {
        order.addons_id.forEach((addonId) => {
          addonCounts[addonId] = (addonCounts[addonId] || 0) + 1;
        });
      }
    });

    // Get Top 5 Addon IDs
    const topAddonIds = Object.entries(addonCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([id]) => id);

    // Fetch Addon Details (Assuming addons are in a collection named 'addons')
    const topAddons = await Service.find({ _id: { $in: topAddonIds } })
      .select("name price")
      .lean();
    const topAddonsStats = topAddons.map((addon) => ({
      addons_id: addon._id,
      name: addon.name,
      price: addon.price,
      count: addonCounts[addon._id] || 0,
    }));

    // Combine into Response
    const breakdown = {
      topServices: topServicesStats,
      topAddons: topAddonsStats,
    };

    successResponse(res, breakdown);
  } catch (error) {
    next(error);
  }
};

// Get System Health Alerts (Pending Reviews, Inactive Services, Expired Promos, Unseen Content)
const getSystemHealthAlerts = async (req, res, next) => {
  try {
    // 1. Count Pending Reviews
    const pendingReviewsCount = await Review.countDocuments({ status: false });

    // 2. Count Inactive Services
    const inactiveServicesCount = await Service.countDocuments({
      $or: [{ status: false }, { isDeleted: true }],
    });

    // 3. Count Expired Promo Codes
    const currentDate = new Date();
    const expiredPromoCodesCount = await PromoCode.countDocuments({
      expirationDate: { $lt: currentDate },
    });

    // 4. Count Unseen Content
    const unseenContent = await Content.find({ seen: false }).lean();

    // Combine into Response
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

// Export All Functions
module.exports = {
  getKPIMetrics,
  getRecentActivity,
  getOrderStatusBreakdown,
  getTopServicesAndAddons,
  getSystemHealthAlerts,
};
