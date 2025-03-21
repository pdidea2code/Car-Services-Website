const Blog = require("../../models/Blog");
const { successResponse, queryErrorRelatedResponse } = require("../../helper/sendResponse");

const getAllBlog = async (req, res, next) => {
    try {
      const baseUrl = `${req.protocol}://${req.get("host")}${
        process.env.BLOG_IMAGE_PATH
      }`;
      const blogs = await Blog.find({status: true});
      const updatedBlogs = blogs.map((blog) => {
        let updatedContent = blog.content;
        updatedContent = updatedContent.replace(
          /<img>\s*src="(.*?)"/g,
          (match, p1) => {
            return `<img src="${baseUrl}${p1}">`;
          }
        );
  
        updatedContent = updatedContent.replace(
          /<img src="(?!http)(.*?)"/g,
          (match, p1) => {
            return `<img src="${baseUrl}${p1}"`;
          }
        );
        return {
          ...blog._doc,
          image: `${baseUrl}${blog.image}`,
          content: updatedContent,
        };
      });
      successResponse(res, updatedBlogs);
    } catch (error) {
      next(error);
    }
  };

    module.exports = { getAllBlog };