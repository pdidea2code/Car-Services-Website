const fs = require("fs");
const path = require("path");

const deleteFiles = (files) => {
  try {
    if (Array.isArray(files)) {
      // If `files` is an array, handle multiple deletions
      files.forEach((file) => {
        const filePath = path.join(__dirname, "../public", file);
        if (fs.existsSync(filePath) && fs.lstatSync(filePath).isFile()) {
          fs.unlinkSync(filePath);
        } else {
          console.error(`Path is not a file: ${filePath}`);
        }
      });
    } else {
      // If `files` is a single string
      const filePath = path.join(__dirname, "../public", files);
      if (fs.existsSync(filePath) && fs.lstatSync(filePath).isFile()) {
        fs.unlinkSync(filePath);
      } else {
        console.error(`Path is not a file: ${filePath}`);
      }
    }
  } catch (error) {
    console.error("Error deleting files:", error);
  }
};

module.exports = deleteFiles;
