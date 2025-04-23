const UserTheme = require("../../models/UserTheme");
const { successResponse, queryErrorRelatedResponse } = require("../../helper/sendResponse");
const deleteFiles = require("../../helper/deleteFiles");

const getAllUserTheme = async (req, res, next) => {
  try {
    const userTheme = await UserTheme.find();
    const baseUrl = req.protocol + "://" + req.get("host") + process.env.USER_THEME_PATH;
    const userThemeData = userTheme.map((item) => {
      return {
        ...item.toObject(),
        mainimage: item.mainimage ? baseUrl + item.mainimage : null,
        headerimage: item.headerimage ? baseUrl + item.headerimage : null,
        workingimage: item.workingimage ? baseUrl + item.workingimage : null,
        springimage: item.springimage ? baseUrl + item.springimage : null,
      };
    });
    successResponse(res, userThemeData);
  } catch (error) {
    next(error);
  }
};

const addUserTheme = async (req, res, next) => {
  try {
    const { name, color1, color2, color3, is_active } = req.body; 
    const userTheme = await UserTheme.create(
        { name, color1, color2, color3, is_active ,
            mainimage: req?.files?.mainimage[0]?.filename,
            headerimage: req?.files?.headerimage[0]?.filename,
            workingimage: req?.files?.workingimage[0]?.filename,
            springimage: req?.files?.springimage[0]?.filename,
    });
    
    await userTheme.save();
    successResponse(res, userTheme);    
  } catch (error) {
    next(error);
  }
};

const updateUserTheme = async (req, res, next) => { 
  try {
    const { id, name, color1, color2, color3, is_active } = req.body;
    const userTheme = await UserTheme.findOne({_id: id});
    if (!userTheme) {
      return queryErrorRelatedResponse(res, 404, "User theme not found");
    }
    
    userTheme.name = name?name:userTheme.name;
    userTheme.color1 = color1?color1:userTheme.color1;
    userTheme.color2 = color2?color2:userTheme.color2;
    userTheme.color3 = color3?color3:userTheme.color3;
    if (is_active !== undefined) {
      userTheme.is_active = is_active === "true" || is_active === true;
    }
    if (req?.files?.mainimage && req?.files?.mainimage[0]) {
      const mainimage = req?.files?.mainimage[0];
      if (userTheme.mainimage) {
        deleteFiles(process.env.USER_THEME_PATH + userTheme.mainimage);
      }
      userTheme.mainimage = mainimage.filename;
    }
     if (req?.files?.headerimage && req?.files?.headerimage[0]) {
      const headerimage = req?.files?.headerimage[0];
      if (userTheme.headerimage) {
        deleteFiles(process.env.USER_THEME_PATH + userTheme.headerimage);
      }
      userTheme.headerimage = headerimage.filename;
    }
    if (req?.files?.workingimage && req?.files?.workingimage[0]) {
      const workingimage = req?.files?.workingimage[0];
      if (userTheme.workingimage) {
        deleteFiles(process.env.USER_THEME_PATH + userTheme.workingimage);
      }
      userTheme.workingimage = workingimage.filename;
    }
    if (req?.files?.springimage && req?.files?.springimage[0]) {
      const springimage = req?.files?.springimage[0];
      if (userTheme.springimage) {
        deleteFiles(process.env.USER_THEME_PATH + userTheme.springimage);
      }
      userTheme.springimage = springimage.filename;
    }       
        
         
    
    await userTheme.save();
    successResponse(res, userTheme);
  } catch (error) {
    next(error);
  }
};

const deleteUserTheme = async (req, res, next) => {
  try {
    const { id } = req.body;
    const userTheme = await UserTheme.findOne({_id: id});
    if (!userTheme) {
      return queryErrorRelatedResponse(res, 404, "User theme not found");
    }
    if (userTheme.mainimage) {
      deleteFiles(process.env.USER_THEME_PATH + userTheme.mainimage);
    }
    if (userTheme.headerimage) {
      deleteFiles(process.env.USER_THEME_PATH + userTheme.headerimage);
    }
    if (userTheme.workingimage) {
      deleteFiles(process.env.USER_THEME_PATH + userTheme.workingimage);
    }
    if (userTheme.springimage) {
      deleteFiles(process.env.USER_THEME_PATH + userTheme.springimage);
    }
    await userTheme.deleteOne();        
    successResponse(res, "User theme deleted successfully");
  } catch (error) {
    next(error);
  }
};

const setActiveUserTheme = async (req, res, next) => {
  try {
    const { id } = req.body;
    const userTheme = await UserTheme.findOne({_id: id});
    if (!userTheme) {
      return queryErrorRelatedResponse(res, 404, "User theme not found");
    }
    const allUserTheme = await UserTheme.find();
    allUserTheme.forEach(async (item) => {
      if (item._id.toString() !== userTheme._id.toString()) {
        item.is_active = false;
        await item.save();
      }
    });
    userTheme.is_active = true;
    await userTheme.save();
    successResponse(res, userTheme);
  } catch (error) {
    next(error);
  }
};
module.exports = { getAllUserTheme, addUserTheme, updateUserTheme, deleteUserTheme, setActiveUserTheme };   
