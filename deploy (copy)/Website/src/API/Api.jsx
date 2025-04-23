import axios from "axios";
import Cookies from "js-cookie";
import {
  MAIN_URL,
  APP_SETTING,
  GET_THEME,
  GET_BUSINESS_HOUR,
  GET_ALL_SERVICE,
  GET_ALL_BLOG,
  GET_ALL_FAQ,
  GET_BANNER,
  GET_SERVICE_BY_ID,
  REGISTER,
  VERIFY_EMAIL,
  CHECK_EMAIL_ID_SEND_OTP,
  VERIFY_OTP,
  FORGOT_PASSWORD,
  EDIT_PROFILE,
  LOGIN,
  GOOGLE_LOGIN,
  SOCIAL_LOGIN,
  GET_PROFILE,
  GET_BLOG_BY_ID,
  GET_ADDRESS,
  ADD_CONTENT,
  GET_ADDON_BY_SERVICE_ID,
  GET_CARTYPE,
  VERIFY_PROMOCODE,
  CREATE_ORDER,
  GET_ORDER,
  GET_ORDER_DETAILS,
  ADD_CARD,
  SAVE_CARD,
  GET_CARD,
  DELETE_CARD,
  CARD_PAYMENT,
  VERIFY_PAYMENT,
  REFUND_PAYMENT,
  CREATE_CHECKOUT_SESSION,
  ADD_REVIEW,
  DISPLAY_REVIEW,
} from "./Apilist";

/*-----------------------------------   AppSetting    -----------------------------------*/
export const getAppSetting = () => axios.get(MAIN_URL + APP_SETTING);

export const getThemeSetting = () => axios.get(MAIN_URL + GET_THEME);

export const getBusinessHour = () => axios.get(MAIN_URL + GET_BUSINESS_HOUR);

/*----------------------------------- End AppSetting    -----------------------------------*/
/*-----------------------------------   Service    -----------------------------------*/
export const getAllService = () => axios.get(MAIN_URL + GET_ALL_SERVICE);
export const getServiceById = (request) =>
  axios.post(MAIN_URL + GET_SERVICE_BY_ID, request);
export const getAddonByServiceId = (request) =>
  axios.post(MAIN_URL + GET_ADDON_BY_SERVICE_ID, request);
export const getCartype = () => axios.get(MAIN_URL + GET_CARTYPE);
/*----------------------------------- End Service    -----------------------------------*/

/*-----------------------------------   Blog    -----------------------------------*/
export const getAllBlog = (request) =>
  axios.post(MAIN_URL + GET_ALL_BLOG, request);
export const getBlogById = (id) => axios.get(MAIN_URL + GET_BLOG_BY_ID + id);
/*----------------------------------- End Blog    -----------------------------------*/

/*-----------------------------------   Faq    -----------------------------------*/
export const getAllFaq = () => axios.get(MAIN_URL + GET_ALL_FAQ);
/*----------------------------------- End Faq    -----------------------------------*/

/*-----------------------------------   Banner    -----------------------------------*/
export const getAllBanner = () => axios.get(MAIN_URL + GET_BANNER);
/*----------------------------------- End Banner    -----------------------------------*/

/*-----------------------------------   Auth    -----------------------------------*/
export const RegisterApi = (request) =>
  axios.post(MAIN_URL + REGISTER, request);
export const VerifyEmailApi = (request) =>
  axios.post(MAIN_URL + VERIFY_EMAIL, request);
export const LoginApi = (request) => axios.post(MAIN_URL + LOGIN, request);
export const CheckEmailIdApi = (request) =>
  axios.post(MAIN_URL + CHECK_EMAIL_ID_SEND_OTP, request);
export const VerifyOtpApi = (request) =>
  axios.post(MAIN_URL + VERIFY_OTP, request);
export const ForgotPasswordApi = (request) =>
  axios.post(MAIN_URL + FORGOT_PASSWORD, request);
export const EditProfileApi = (request) =>
  axios.post(MAIN_URL + EDIT_PROFILE, request, {
    headers: {
      Authorization: `Bearer ${Cookies.get("token")}`,
    },
  });
export const GoogleLoginApi = (accessToken) =>
  axios.get(GOOGLE_LOGIN, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
export const SocialLoginApi = (request) =>
  axios.post(MAIN_URL + SOCIAL_LOGIN, request);
export const getProfile = () =>
  axios.get(MAIN_URL + GET_PROFILE, {
    headers: {
      Authorization: `Bearer ${Cookies.get("token")}`,
    },
  });
/*----------------------------------- End Auth    -----------------------------------*/

/*-----------------------------------   Contact Us    -----------------------------------*/
export const getAddress = () => axios.get(MAIN_URL + GET_ADDRESS);
export const addContent = (request) =>
  axios.post(MAIN_URL + ADD_CONTENT, request);
/*----------------------------------- End Contact Us    -----------------------------------*/

/*-----------------------------------   Booking    -----------------------------------*/
export const verifyPromocode = (request) =>
  axios.post(MAIN_URL + VERIFY_PROMOCODE, request, {
    headers: {
      Authorization: `Bearer ${Cookies.get("token")}`,
    },
  });
export const createOrder = (request) =>
  axios.post(MAIN_URL + CREATE_ORDER, request, {
    headers: {
      Authorization: `Bearer ${Cookies.get("token")}`,
    },
  });
export const getOrder = () =>
  axios.get(MAIN_URL + GET_ORDER, {
    headers: {
      Authorization: `Bearer ${Cookies.get("token")}`,
    },
  });
export const cardPayment = (request) =>
  axios.post(MAIN_URL + CARD_PAYMENT, request, {
    headers: {
      Authorization: `Bearer ${Cookies.get("token")}`,
    },
  });
export const verifyPayment = (request) =>
  axios.post(MAIN_URL + VERIFY_PAYMENT, request, {
    headers: {
      Authorization: `Bearer ${Cookies.get("token")}`,
    },
  });
export const refundPayment = (request) =>
  axios.post(MAIN_URL + REFUND_PAYMENT, request, {
    headers: {
      Authorization: `Bearer ${Cookies.get("token")}`,
    },
  });
export const getOrderDetails = (request) =>
  axios.post(MAIN_URL + GET_ORDER_DETAILS, request, {
    headers: {
      Authorization: `Bearer ${Cookies.get("token")}`,
    },
  });
export const createCheckoutSession = (request) =>
  axios.post(MAIN_URL + CREATE_CHECKOUT_SESSION, request, {
    headers: {
      Authorization: `Bearer ${Cookies.get("token")}`,
    },
  });
/*----------------------------------- End Booking    -----------------------------------*/

/*-----------------------------------   Card    -----------------------------------*/
export const addCard = (request) =>
  axios.post(MAIN_URL + ADD_CARD, request, {
    headers: {
      Authorization: `Bearer ${Cookies.get("token")}`,
    },
  });

export const saveCard = (request) =>
  axios.post(MAIN_URL + SAVE_CARD, request, {
    headers: {
      Authorization: `Bearer ${Cookies.get("token")}`,
    },
  });
export const getCard = () =>
  axios.get(MAIN_URL + GET_CARD, {
    headers: {
      Authorization: `Bearer ${Cookies.get("token")}`,
    },
  });
export const deleteCard = (request) =>
  axios.post(MAIN_URL + DELETE_CARD, request, {
    headers: {
      Authorization: `Bearer ${Cookies.get("token")}`,
    },
  });
/*----------------------------------- End Card    -----------------------------------*/

/*-----------------------------------   Review    -----------------------------------*/
export const addReview = (request) =>
  axios.post(MAIN_URL + ADD_REVIEW, request, {
    headers: {
      Authorization: `Bearer ${Cookies.get("token")}`,
    },
  });
export const displayReview = () =>
  axios.get(MAIN_URL + DISPLAY_REVIEW, {
    headers: {
      Authorization: `Bearer ${Cookies.get("token")}`,
    },
  });
/*----------------------------------- End Review    -----------------------------------*/
