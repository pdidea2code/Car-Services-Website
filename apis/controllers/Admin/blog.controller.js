const Blog = require("../../models/Blog");
const deleteFiles = require("../../helper/deleteFiles");
const {
  successResponse,
  queryErrorRelatedResponse,
} = require("../../helper/sendResponse");
// const createBlog = async (req, res, next) => {
//   try {
//     const { title, description, content } = req.body;
//     const imageUrls = req?.files?.images?.map((file) => `${file.filename}`);
//     const updatedContent = content.replace(
//       /<img[^>]*src="data:image\/[^>]*>/g,
//       (match, offset, string) => {
//         const idx = imageUrls.shift();
//         return `<img src="${idx}"`;
//       }
//     );
//     const blog = await Blog.create({
//       title,
//       description,
//       content: updatedContent,
//       image: req?.files?.mainimage[0]?.filename,
//     });
//     successResponse(res, blog);
//   } catch (error) {
//     next(error);
//   }
// };

const createBlog = async (req, res, next) => {
  try {
    const { title, description, content } = req.body;

    const baseUrl = `${req.protocol}://${req.get("host")}${
      process.env.BLOG_IMAGE_PATH
    }`;

    // Get uploaded image filenames
    const imageUrls =
      req?.files?.images?.map((file) => `${file.filename}`) || [];

    // Replace base64 images with uploaded image URLs
    let updatedContent = content;

    if (imageUrls.length > 0) {
      updatedContent = updatedContent.replace(
        /<img[^>]*src="data:image\/[^"]*"/g,
        () => {
          const imgUrl = imageUrls.shift();
          return `<img src="${imgUrl}"`;
        }
      );
    }

    // Create the blog with the main image and content
    const blog = await Blog.create({
      title,
      description,
      content: updatedContent,
      image: req?.files?.mainimage?.[0]?.filename
        ? `${req.files.mainimage[0].filename}`
        : null,
    });

    successResponse(res, blog);
  } catch (error) {
    next(error);
  }
};

const updateBlog = async (req, res, next) => {
  try {
    const { id, title, description, content } = req.body;
    const blog = await Blog.findById(id);

    if (!blog) {
      return queryErrorRelatedResponse(res, 404, "Blog not found");
    }

    blog.title = title;
    blog.description = description;

    if (req?.files?.mainimage && req?.files?.mainimage[0]?.filename) {
      if (blog.image) {
        await deleteFiles(`${process.env.BLOG_IMAGE_PATH}/${blog.image}`);
      }
      blog.image = req?.files?.mainimage[0]?.filename;
    }

    const baseUrl = `${req.protocol}://${req.get("host")}${
      process.env.BLOG_IMAGE_PATH
    }`;

    // Extract all images from the existing blog content and the new content
    const extractImages = (html) => {
      const regex = /<img src="([^"]+)"/g;
      const images = [...html.matchAll(regex)].map((match) => match[1]);

      const regularImages = images.filter(
        (img) => img.startsWith("http://") || img.startsWith("https://")
      );
      const base64Images = images.filter((img) => img.startsWith("data:image"));

      return { regularImages, base64Images };
    };

    const images1 = extractImages(blog.content || "");
    const images2 = extractImages(content);

    const nonMatchingRegular = images1.regularImages.filter(
      (img) => !images2.regularImages.includes(img)
    );

    // Delete non-matching regular images
    if (nonMatchingRegular.length > 0) {
      await Promise.all(
        nonMatchingRegular.map(async (img) => {
          await deleteFiles(
            `${process.env.BLOG_IMAGE_PATH}/${img.split("/").pop()}`
          );
        })
      );
    }

    let updatedContent = content;

    // Replace base64 images with uploaded image URLs
    if (images2.base64Images.length > 0 && req?.files?.images) {
      const imageUrls = req.files.images.map((file) => `${file.filename}`);

      updatedContent = updatedContent.replace(
        /<img[^>]*src="data:image\/[^"]*"/g,
        () => {
          const imgUrl = imageUrls.shift();
          return `<img src="${imgUrl}"`;
        }
      );
    }

    // Ensure all local images have the full base URL
    updatedContent = updatedContent.replace(
      /<img src="(?!http|https)(.*?)"/g,
      (match, p1) => {
        return `<img src="${p1.split("/").pop()}"`;
      }
    );

    blog.content = updatedContent;

    await blog.save();

    successResponse(res, "Blog updated successfully");
  } catch (error) {
    next(error);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const { id, status } = req.body;

    const blog = await Blog.findById(id);
    if (!blog) {
      return queryErrorRelatedResponse(res, 404, "Blog not found");
    }
    if (status !== undefined) {
      blog.status = status === "true" || status === true;
    }
    await blog.save();
    successResponse(res, blog);
  } catch (error) {
    next(error);
  }
};

const deleteBlog = async (req, res, next) => {
  try {
    const { id } = req.body;
    const blog = await Blog.findById(id);

    if (!blog) {
      return queryErrorRelatedResponse(res, 404, "Blog not found");
    }

    // Delete the main image
    if (blog.image) {
      await deleteFiles(`${process.env.BLOG_IMAGE_PATH}/${blog.image}`);
    }

    // Delete all images in the content
    if (blog.content) {
      // Extract image URLs properly
      const images = [...blog.content.matchAll(/<img[^>]*src="([^"]+)"/g)].map(
        (match) => match[1]
      );

      if (images.length > 0) {
        await Promise.all(
          images.map(async (img) => {
            // Only delete local images, ignore external URLs (http/https)

            await deleteFiles(
              `${process.env.BLOG_IMAGE_PATH}/${img.split("/").pop()}`
            );
          })
        );
      }
    }

    await blog.deleteOne();

    successResponse(res, "Blog deleted successfully");
  } catch (error) {
    next(error);
  }
};

const getAllBlog = async (req, res, next) => {
  try {
    const baseUrl = `${req.protocol}://${req.get("host")}${
      process.env.BLOG_IMAGE_PATH
    }`;
    const blogs = await Blog.find();
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

// const getAllBlog = async (req, res, next) => {
//   try {
//     const baseUrl = `${req.protocol}://${req.get("host")}${process.env.BLOG_IMAGE_PATH}`;

//     const blogs = await Blog.find();

//     const updatedBlogs = blogs.map((blog) => {
//       let updatedContent = blog.content;

//       // Ensure all local images have the full base URL
//       updatedContent = updatedContent.replace(
//         /<img src="(?!http)(.*?)"/g,
//         (match, p1) => {
//           // Skip adding base URL if it already exists
//           if (p1.startsWith(baseUrl)) {
//             return match;
//           }
//           return `<img src="${baseUrl}/${p1.split('/').pop()}"`;
//         }
//       );

//       return {
//         ...blog._doc,
//         image: blog.image ? `${baseUrl}/${blog.image}` : null,
//         content: updatedContent,
//       };
//     });

//     successResponse(res, updatedBlogs);
//   } catch (error) {
//     next(error);
//   }
// };

const getBlogById = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.body.id);
    const baseUrl = `${req.protocol}://${req.get("host")}${
      process.env.BLOG_IMAGE_PATH
    }`;
    const imageUrl = `${baseUrl}${blog.image}`;
    let updatedContent = blog.content;
    if (blog.content) {
      updatedContent = updatedContent.replace(
        /<img>\s*src="(.*?)"/g,
        (match, p1) => {
          return `<img src="${baseUrl}${p1}"`;
        }
      );

      // Also handle properly formatted <img> tags without the base URL
      updatedContent = updatedContent.replace(
        /<img src="(?!http)(.*?)"/g,
        (match, p1) => {
          return `<img src="${baseUrl}${p1}"`;
        }
      );
    }

    const blogData = {
      ...blog.toObject(),
      image: imageUrl,
      content: updatedContent,
    };
    successResponse(res, blogData);
  } catch (error) {
    next(error);
  }
};
module.exports = {
  createBlog,
  getAllBlog,
  getBlogById,
  updateBlog,
  updateStatus,
  deleteBlog,
};
