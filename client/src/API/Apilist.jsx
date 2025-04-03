export const MAIN_URL = process.env.REACT_APP_API_URL;

/*-----------------------------------   AppSetting    -----------------------------------*/

export const APP_SETTING = "/api/user/appsetting/getappsetting";
export const GET_THEME = "/api/user/appsetting/gettheme";
export const GET_BUSINESS_HOUR = "/api/user/appsetting/getbusinesshour";
export const GET_CARTYPE = "/api/user/service/getcartype";
/*----------------------------------- End AppSetting    -----------------------------------*/
/*-----------------------------------   Service    -----------------------------------*/
export const GET_ALL_SERVICE = "/api/user/service/getallservice";
export const GET_SERVICE_BY_ID = "/api/user/service/getservicebyid";
export const GET_ADDON_BY_SERVICE_ID = "/api/user/service/getaddonbyserviceid";
/*----------------------------------- End Service    -----------------------------------*/

/*-----------------------------------   Blog    -----------------------------------*/
export const GET_ALL_BLOG = "/api/user/blog/getallblog";
export const GET_BLOG_BY_ID = "/api/user/blog/getblogbyid/";
/*----------------------------------- End Blog    -----------------------------------*/

/*-----------------------------------   Faq    -----------------------------------*/
export const GET_ALL_FAQ = "/api/user/faq/getallfaq";
/*----------------------------------- End Faq    -----------------------------------*/

/*-----------------------------------   Banner    -----------------------------------*/
export const GET_BANNER = "/api/user/appsetting/getbanner";
/*----------------------------------- End Banner    -----------------------------------*/

/*-----------------------------------   Auth    -----------------------------------*/
export const REGISTER = "/api/user/auth/register";
export const VERIFY_EMAIL = "/api/user/auth/verifyemail";
export const LOGIN = "/api/user/auth/login";
export const CHECK_EMAIL_ID_SEND_OTP = "/api/user/auth/checkemailid";
export const VERIFY_OTP = "/api/user/auth/verifyotp";
export const FORGOT_PASSWORD = "/api/user/auth/forgotpassword";
export const EDIT_PROFILE = "/api/user/auth/editprofile";
export const SOCIAL_LOGIN = "/api/user/auth/sociallogin";
export const GOOGLE_LOGIN = "https://www.googleapis.com/oauth2/v3/userinfo";
export const GET_PROFILE = "/api/user/auth/getprofile";
/*----------------------------------- End Auth    -----------------------------------*/

/*-----------------------------------   Contact Us    -----------------------------------*/
export const GET_ADDRESS = "/api/user/contectus/getaddress";
export const ADD_CONTENT = "/api/user/contectus/addcontent";
/*----------------------------------- End Contact Us    -----------------------------------*/
