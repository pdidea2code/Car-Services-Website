const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  image: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  content: { type: String },
  status: { type: Boolean, default: true },
},{
    timestamps:true,
    versionKey:false    
});

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog