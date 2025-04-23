const Faq = require("../../models/Faq");
const { successResponse, queryErrorRelatedResponse } = require("../../helper/sendResponse");

const addFaq = async (req, res, next) => {
  try {

    const { question, answer } = req.body;
    const faq = await Faq.create({ question, answer });
    successResponse(res, faq);
  } catch (error) {
    next(error);
  }
};

const editFaq = async (req, res, next) => {
  try {
    
    const { question, answer ,id} = req.body;
    const faq = await Faq.findOne({ _id: id });
    if (!faq) {
      return queryErrorRelatedResponse(res, 404, "Faq not found");
    }
    faq.question = question?question:faq.question;
    faq.answer = answer?answer:faq.answer;
    if (req.body.status !== undefined) {
        faq.status = req.body.status === "true" || req.body.status === true;
      }
    await faq.save();
    successResponse(res, faq);
  } catch (error) {
    next(error);
  }
};

const getAllFaq = async (req, res, next) => {
  try {
    const faq = await Faq.find();
    successResponse(res, faq);
  } catch (error) {
    next(error);
  }
};

const deleteFaq = async (req, res, next) => {
  try {
    const { id } = req.body;
    const faq = await Faq.findOne({ _id: id });
    if (!faq) {
      return queryErrorRelatedResponse(res, 404, "Faq not found");
    }
    await faq.deleteOne();
    successResponse(res, faq);
  } catch (error) {
    next(error);
  }
};

module.exports = { addFaq, editFaq, getAllFaq, deleteFaq };
