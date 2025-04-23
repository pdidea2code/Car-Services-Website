const Blog = require("../../models/Blog");
const { successResponse, queryErrorRelatedResponse } = require("../../helper/sendResponse");
const getAllBlog = async (req, res, next) => {
  try {
    const baseUrl = `${req.protocol}://${req.get("host")}${process.env.BLOG_IMAGE_PATH}`;

    // Extracting pagination parameters
    const page = parseInt(req.body.page) || 1; // Current page
    const limit = parseInt(req.body.limit) || 6; // Items per page

    const totalItems = await Blog.countDocuments({ status: true });
    const totalPages = Math.ceil(totalItems / limit);

    const blogs = await Blog.find({ status: true })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const updatedBlogs = blogs.map((blog) => {
      let updatedContent = blog.content;

      updatedContent = updatedContent.replace(/<img>\s*src="(.*?)"/g, (match, p1) => `<img src="${baseUrl}${p1}"`);

      updatedContent = updatedContent.replace(/<img src="(?!http)(.*?)"/g, (match, p1) => `<img src="${baseUrl}${p1}"`);

      return {
        ...blog._doc,
        image: `${baseUrl}${blog.image}`,
        content: updatedContent,
      };
    });

    // Pagination details
    const pagination = {
      currentPage: page,
      totalPages: totalPages,
      totalItems: totalItems,
      nextPage: page < totalPages ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null,
      itemsPerPage: limit,
    };

    successResponse(res, { updatedBlogs, pagination });
  } catch (error) {
    next(error);
  }
};

const getBlogById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findOne({ _id: id, status: true });
    if (!blog) {
      return queryErrorRelatedResponse(res, "Blog not found");
    }
    const baseUrl = `${req.protocol}://${req.get("host")}${process.env.BLOG_IMAGE_PATH}`;
    let updatedContent = blog.content;

    updatedContent = updatedContent.replace(/<img>\s*src="(.*?)"/g, (match, p1) => `<img src="${baseUrl}${p1}"`);

    updatedContent = updatedContent.replace(/<img src="(?!http)(.*?)"/g, (match, p1) => `<img src="${baseUrl}${p1}"`);

    const updatedBlog = {
      ...blog._doc,
      image: `${baseUrl}${blog.image}`,
      content: updatedContent,
    };
    successResponse(res, updatedBlog);
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllBlog, getBlogById };
