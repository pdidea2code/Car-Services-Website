const Blog = require("../models/Blog");
const fs = require("fs");
const path = require("path");

// Add Blog
exports.addBlog = async (req, res) => {
  const { title, content } = req.body;

  // Replace base64 image URLs with server image URLs
  const imageUrls = req.files.map(file => `/uploads/${file.filename}`);
  const updatedContent = content.replace(/<img[^>]*src="data:image\/[^>]*>/g, (match, offset, string) => {
    const idx = imageUrls.shift();
    return `<img src="${idx}"`;
  });

  try {
    const blog = new Blog({ title, content: updatedContent, images: imageUrls });
    await blog.save();
    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ message: "Error creating blog", error });
  }
};

// Get Blog
exports.getBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: "Error fetching blog", error });
  }
};

// Update Blog
exports.updateBlog = async (req, res) => {
  const { title, content } = req.body;

  // Handle deleted images
  const existingBlog = await Blog.findById(req.params.id);
  const deletedImages = existingBlog.images.filter(img => !content.includes(img));

  deletedImages.forEach(img => {
    const imgPath = path.join(__dirname, `../${img}`);
    if (fs.existsSync(imgPath)) {
      fs.unlinkSync(imgPath);
    }
  });

  const newImages = req.files.map(file => `/uploads/${file.filename}`);
  const updatedContent = content.replace(/<img[^>]*src="data:image\/[^>]*>/g, () => {
    const img = newImages.shift();
    return `<img src="${img}"`;
  });

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { title, content: updatedContent, images: newImages },
      { new: true }
    );
    res.json(updatedBlog);
  } catch (error) {
    res.status(500).json({ message: "Error updating blog", error });
  }
};

// Delete Blog
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    blog.images.forEach(img => {
      const imgPath = path.join(__dirname, `../${img}`);
      if (fs.existsSync(imgPath)) {
        fs.unlinkSync(imgPath);
      }
    });

    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: "Blog deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting blog", error });
  }
};
