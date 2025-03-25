import axios from "axios";
import {MAIN_URL, APP_SETTING, GET_THEME, GET_BUSINESS_HOUR, GET_ALL_SERVICE } from "./Apilist";

/*-----------------------------------   AppSetting    -----------------------------------*/
export const getAppSetting =  () => axios.get(MAIN_URL + APP_SETTING)

export const getThemeSetting =  () => axios.get(MAIN_URL + GET_THEME)

export const getBusinessHour =  () => axios.get(MAIN_URL + GET_BUSINESS_HOUR)

/*----------------------------------- End AppSetting    -----------------------------------*/
/*-----------------------------------   Service    -----------------------------------*/
export const getAllService =  () => axios.get(MAIN_URL + GET_ALL_SERVICE)
/*----------------------------------- End Service    -----------------------------------*/