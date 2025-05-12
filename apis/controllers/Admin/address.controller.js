const Address = require("../../models/Address");
const { successResponse, queryErrorRelatedResponse } = require("../../helper/sendResponse");

const createAddress = async (req, res, next) => {
  try {
    const { city, address, zipCode, country, phone, email, latitude, longitude } = req.body;

    const newAddress = await Address.create({
      city,
      address,
      zipCode,
      country,
      phone,
      email,
      latitude,
      longitude,
    });

    successResponse(res, newAddress);
  } catch (error) {
    next(error);
  }
};
const editAddress = async (req, res, next) => {
  try {
    const { id, city, address, zipCode, country, phone, email, latitude, longitude } = req.body;

    const getAddress = await Address.findById(id);

    if (!getAddress) {
      return queryErrorRelatedResponse(res, 404, "Address not found");
    }

    getAddress.city = city ? city : getAddress.city;
    getAddress.address = address ? address : getAddress.address;
    getAddress.zipCode = zipCode ? zipCode : getAddress.zipCode;
    getAddress.country = country ? country : getAddress.country;
    getAddress.phone = phone ? phone : getAddress.phone;
    getAddress.email = email ? email : getAddress.email;
    getAddress.latitude = latitude ? latitude : getAddress.latitude;
    getAddress.longitude = longitude ? longitude : getAddress.longitude;

    if (req.body.status !== undefined) {
      getAddress.status = req.body.status === "true" || req.body.status === true;
    }
    await getAddress.save();
    successResponse(res, "Address updated successfully");
  } catch (error) {
    next(error);
  }
};

const getAllAddress = async (req, res, next) => {
  try {
    const addresses = await Address.find();
    successResponse(res, addresses);
  } catch (error) {
    next(error);
  }
};

const deleteAddress = async (req, res, next) => {
  try {
    const { id } = req.body;
    const getAddress = await Address.findById(id);
    if (!getAddress) {
      return queryErrorRelatedResponse(res, 404, "Address not found");
    }
    await Address.findByIdAndDelete(id);
    successResponse(res, "Address deleted successfully");
  } catch (error) {
    next(error);
  }
};

const deleteMultipleAddress = async (req, res, next) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return queryErrorRelatedResponse(res, 400, "Invalid or empty IDs array");
    }

    const addresses = await Address.find({ _id: { $in: ids } });
    if (addresses.length !== ids.length) {
      return queryErrorRelatedResponse(res, 404, "One or more addresses not found");
    }

    await Address.deleteMany({ _id: { $in: ids } });

    successResponse(res, "Multiple addresses deleted successfully");
  } catch (error) {
    next(error);
  }
};
module.exports = { createAddress, editAddress, getAllAddress, deleteAddress, deleteMultipleAddress };
