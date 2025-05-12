// controllers/Admin/promoCode.controller.js
const PromoCode = require("../../models/Promocode");
const { successResponse, queryErrorRelatedResponse } = require("../../helper/sendResponse");

const addPromoCode = async (req, res, next) => {
  try {
    const {
      title,
      code,
      discountType,
      discountValue,
      maxUses,
      startDate,
      expirationDate,
      minimumOrderAmount,
      isActive,
    } = req.body;

    const promoCode = await PromoCode.create({
      title,
      code,
      discountType,
      discountValue,
      maxUses: maxUses !== undefined ? maxUses : -1,
      startDate,
      expirationDate,
      minimumOrderAmount: minimumOrderAmount || 0,
      isActive: isActive !== undefined ? isActive : true,
    });

    successResponse(res, promoCode);
  } catch (error) {
    next(error);
  }
};

const editPromoCode = async (req, res, next) => {
  try {
    const {
      id,
      title,
      code,
      discountType,
      discountValue,
      maxUses,
      startDate,
      expirationDate,
      minimumOrderAmount,
      isActive,
    } = req.body;

    const promoCode = await PromoCode.findById(id);
    if (!promoCode) {
      return queryErrorRelatedResponse(res, 404, "PromoCode not found");
    }

    promoCode.title = title || promoCode.title;
    promoCode.code = code || promoCode.code;
    promoCode.discountType = discountType || promoCode.discountType;
    promoCode.discountValue = discountValue || promoCode.discountValue;
    promoCode.maxUses = maxUses !== undefined ? maxUses : promoCode.maxUses;
    promoCode.startDate = startDate || promoCode.startDate;
    promoCode.expirationDate = expirationDate || promoCode.expirationDate;
    promoCode.minimumOrderAmount = minimumOrderAmount !== undefined ? minimumOrderAmount : promoCode.minimumOrderAmount;

    if (req.body.isActive !== undefined) {
      promoCode.isActive = req.body.isActive === "true" || req.body.isActive === true;
    }

    await promoCode.save();
    successResponse(res, promoCode);
  } catch (error) {
    next(error);
  }
};

const getAllPromoCode = async (req, res, next) => {
  try {
    const promoCodes = await PromoCode.find();
    successResponse(res, promoCodes);
  } catch (error) {
    next(error);
  }
};

const deletePromoCode = async (req, res, next) => {
  try {
    const { id } = req.body;
    const promoCode = await PromoCode.findById(id);
    if (!promoCode) {
      return queryErrorRelatedResponse(res, 404, "PromoCode not found");
    }
    await PromoCode.deleteOne({ _id: id });
    successResponse(res, "PromoCode deleted successfully");
  } catch (error) {
    next(error);
  }
};
const deleteMultiplePromoCode = async (req, res, next) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return queryErrorRelatedResponse(res, 400, "Invalid or empty IDs array");
    }

    const promoCodes = await PromoCode.find({ _id: { $in: ids } });
    if (promoCodes.length !== ids.length) {
      return queryErrorRelatedResponse(res, 404, "One or more promo codes not found");
    }

    await PromoCode.deleteMany({ _id: { $in: ids } });

    successResponse(res, "Multiple promo codes deleted successfully");
  } catch (error) {
    next(error);
  }
};
module.exports = {
  addPromoCode,
  editPromoCode,
  getAllPromoCode,
  deletePromoCode,
  deleteMultiplePromoCode,
};
