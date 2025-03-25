import axios from "axios";
import {
  MAIN_URL,
  APP_SETTING,
  GET_THEME,
  GET_BUSINESS_HOUR,
  GET_ALL_SERVICE,
  GET_ALL_BLOG,
  GET_ALL_FAQ,
  GET_BANNER,
} from "./Apilist";

/*-----------------------------------   AppSetting    -----------------------------------*/
export const getAppSetting = () => axios.get(MAIN_URL + APP_SETTING);

export const getThemeSetting = () => axios.get(MAIN_URL + GET_THEME);

export const getBusinessHour = () => axios.get(MAIN_URL + GET_BUSINESS_HOUR);

/*----------------------------------- End AppSetting    -----------------------------------*/
/*-----------------------------------   Service    -----------------------------------*/
export const getAllService = () => axios.get(MAIN_URL + GET_ALL_SERVICE);
/*----------------------------------- End Service    -----------------------------------*/

/*-----------------------------------   Blog    -----------------------------------*/
export const getAllBlog = () => axios.get(MAIN_URL + GET_ALL_BLOG);
/*----------------------------------- End Blog    -----------------------------------*/

/*-----------------------------------   Faq    -----------------------------------*/
export const getAllFaq = () => axios.get(MAIN_URL + GET_ALL_FAQ);
/*----------------------------------- End Faq    -----------------------------------*/

/*-----------------------------------   Banner    -----------------------------------*/
export const getAllBanner = () => axios.get(MAIN_URL + GET_BANNER);
/*----------------------------------- End Banner    -----------------------------------*/
