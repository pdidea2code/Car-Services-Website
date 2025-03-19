const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  status: { type: Boolean, default: true },
 
}, { timestamps: true , versionKey: false});

const Faq = mongoose.model("Faq", faqSchema);

module.exports = Faq;
