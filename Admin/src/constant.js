export const MAIN_URL = process.env.REACT_APP_API_URL
/* ---------------------------- ALL Auth API ---------------------------- */

export const LOGIN_API = '/api/admin/auth/login'
export const CHANGEPASSEORD_API = '/api/admin/auth/changepassword'

/* ---------------------------- END Auth API ---------------------------- */
export const GET_ALL_USER_API = '/api/admin/user/getalluser'
export const UPDATE_USER_API = '/api/admin/user/changestatus'

/* ---------------------------- END User API ---------------------------- */
/* ---------------------------- Car Type API ---------------------------- */
export const GET_ALL_CAR_TYPE_API = '/api/admin/cartype/getallcartype'
export const ADD_CAR_TYPE_API = '/api/admin/cartype/addcartype'
export const EDIT_CAR_TYPE_API = '/api/admin/cartype/editcartype'
export const DELETE_CAR_TYPE_API = '/api/admin/cartype/deletecartype'
export const DELETE_MULTI_CAR_TYPE_API = '/api/admin/cartype/deletemultiplecartype'
/* ---------------------------- END Car Type API ---------------------------- */
/* ---------------------------- Showcase API ---------------------------- */
export const GET_ALL_SHOWCASE_API = '/api/admin/showcase/getallshowcase'
export const ADD_SHOWCASE_API = '/api/admin/showcase/addshowcase'
export const EDIT_SHOWCASE_API = '/api/admin/showcase/editshowcase'
export const DELETE_SHOWCASE_API = '/api/admin/showcase/deleteshowcase'
export const DELETE_MULTI_SHOWCASE_API = '/api/admin/showcase/deletemultipleshowcase'

/* ---------------------------- END Showcase API ---------------------------- */
/* ---------------------------- Service API ---------------------------- */
export const GET_ALL_SERVICE_API = '/api/admin/service/allservice'
export const ADD_SERVICE_API = '/api/admin/service/addservice'
export const EDIT_SERVICE_API = '/api/admin/service/editservice'
export const SOFT_DELETE_SERVICE_API = '/api/admin/service/softdeleteservice'
export const GET_SERVICE_BY_ID_API = '/api/admin/service/servicebyid'
export const DELETE_MULTI_SERVICE_API = '/api/admin/service/deletemultipleservice'

/* ---------------------------- END Service API ---------------------------- */
/* ---------------------------- Addons API ---------------------------- */
export const GET_ALL_ADDONS_API = '/api/admin/addons/getalladdons'
export const ADD_ADDONS_API = '/api/admin/addons/addaddons'
export const EDIT_ADDONS_API = '/api/admin/addons/editaddons'
export const DELETE_ADDONS_API = '/api/admin/addons/deleteaddons'
export const GET_ADDONS_BY_SERVICE_API = '/api/admin/addons/getaddonsbyService'
export const DELETE_MULTI_ADDONS_API = '/api/admin/addons/deletemultipleaddons'

/* ---------------------------- END Addons API ---------------------------- */
/* ---------------------------- App Setting API ---------------------------- */
export const GET_ALL_APP_SETTING_API = '/api/admin/appsetting/getappsetting'
export const EDIT_APP_SETTING_API = '/api/admin/appsetting/editappsetting'
/* ---------------------------- END App Setting API ---------------------------- */
/* ---------------------------- FAQ API ---------------------------- */
export const GET_ALL_FAQ_API = '/api/admin/faq/getallfaq'
export const ADD_FAQ_API = '/api/admin/faq/addfaq'
export const EDIT_FAQ_API = '/api/admin/faq/editfaq'
export const DELETE_FAQ_API = '/api/admin/faq/deletefaq'
export const DELETE_MULTI_FAQ_API = '/api/admin/faq/deletemultiplefaq'

/* ---------------------------- END FAQ API ---------------------------- */
/* ---------------------------- Admin Theme API ---------------------------- */
export const GET_ADMIN_THEME_API = '/api/admin/theme/getadmintheme'
export const EDIT_ADMIN_THEME_API = '/api/admin/theme/editadmintheme'
/* ---------------------------- END Admin Theme API ---------------------------- */
/* ---------------------------- Blog API ---------------------------- */
export const ADD_BLOG_API = '/api/admin/blog/createblog'
export const GET_BLOG_BY_ID_API = '/api/admin/blog/getblogbyid'
export const UPDATE_BLOG_API = '/api/admin/blog/updateblog'
export const GET_ALL_BLOG_API = '/api/admin/blog/getallblog'
export const UPDATE_BLOG_STATUS_API = '/api/admin/blog/updatestatus'
export const DELETE_BLOG_API = '/api/admin/blog/deleteblog'
export const DELETE_MULTI_BLOG_API = '/api/admin/blog/deletemultipleblog'

/* ---------------------------- END Blog API ---------------------------- */
/* ---------------------------- Address API ---------------------------- */
export const GET_ALL_ADDRESS_API = '/api/admin/address/getalladdress'
export const ADD_ADDRESS_API = '/api/admin/address/addaddress'
export const EDIT_ADDRESS_API = '/api/admin/address/editaddress'
export const DELETE_ADDRESS_API = '/api/admin/address/deleteaddress'
export const DELETE_MULTI_ADDRESS_API = '/api/admin/address/deletemultipleaddress'

/* ---------------------------- END Address API ---------------------------- */
/* ---------------------------- Business Hour API ---------------------------- */
export const GET_ALL_BUSINESS_HOUR_API = '/api/admin/businesshour/getallbusinesshour'
export const EDIT_BUSINESS_HOUR_API = '/api/admin/businesshour/updatebusinesshour'
export const DELETE_BUSINESS_HOUR_API = '/api/admin/businesshour/deletebusinesshour'
/* ---------------------------- END Business Hour API ---------------------------- */
/* ---------------------------- User Theme API ---------------------------- */
export const GET_ALL_USER_THEME_API = '/api/admin/usertheme/getallusertheme'
export const SET_ACTIVE_USER_THEME_API = '/api/admin/usertheme/setactiveusertheme'
export const ADD_USER_THEME_API = '/api/admin/usertheme/addusertheme'
/* ---------------------------- END User Theme API ---------------------------- */
/* ---------------------------- Promocode API ---------------------------- */
export const ADD_PROMOCODE_API = '/api/admin/promocode/addpromocode'
export const GET_ALL_PROMOCODE_API = '/api/admin/promocode/getallpromocode'
export const EDIT_PROMOCODE_API = '/api/admin/promocode/editpromocode'
export const DELETE_PROMOCODE_API = '/api/admin/promocode/deletepromocode'
export const DELETE_MULTI_PROMOCODE_API = '/api/admin/promocode/deletemultiplepromoCode'

/* ---------------------------- END Promocode API ---------------------------- */
/* ---------------------------- Order API ---------------------------- */
export const GET_ALL_ORDER_API = '/api/admin/booking/getorder'
export const UPDATE_ORDER_STATUS_API = '/api/admin/booking/updateOrderStatus'
export const GET_UPCOMING_ORDER_API = '/api/admin/booking/getupcomingorder'
export const GET_PAST_ORDER_API = '/api/admin/booking/getpastorder'
export const GET_TODAY_ORDER_API = '/api/admin/booking/gettodayorder'
/* ---------------------------- END Order API ---------------------------- */
/* ---------------------------- Review API ---------------------------- */
export const GET_ALL_REVIEW_API = '/api/admin/review/getallreviews'
export const CHANGE_REVIEW_STATUS_API = '/api/admin/review/changereviewstatus'
export const DELETE_REVIEW_API = '/api/admin/review/deletereview'
export const DELETE_MULTI_REVIEW_API = '/api/admin/review/deletemultiplereview'

/* ---------------------------- END Review API ---------------------------- */
/* ---------------------------- Dashboard API ---------------------------- */
export const GET_KPI_METRICS_API = '/api/admin/dashbord/kpimetrics'
export const GET_ORDER_STATUS_BREAKDOWN_API = '/api/admin/dashbord/orderstatusbreakdown'
export const GET_TOP_SERVICES_AND_ADDONS_API = '/api/admin/dashbord/topservicesandaddons'
export const GET_RECENT_ACTIVITY_API = '/api/admin/dashbord/recentactivity'
export const GET_SYSTEM_HEALTH_ALERTS_API = '/api/admin/dashbord/systemhealthalerts'
/* ---------------------------- END Dashboard API ---------------------------- */
/* ---------------------------- Content API ---------------------------- */
export const GET_CONTENT_API = '/api/admin/content/getcontent'
export const DELETE_CONTENT_API = '/api/admin/content/deletecontent'
export const UPDATE_CONTENT_API = '/api/admin/content/updatecontent'
export const DELETE_MULTI_CONTENT_API = '/api/admin/content/deletemultiplecontent'

/* ---------------------------- END Content API ---------------------------- */

/* ---------------------------- ALL Popup Image API ---------------------------- */
export const ADD_POPUP_IMAGE_API = '/api/admin/popupimage/addpopupimage'
export const GET_ALL_POPUP_IMAGE_API = '/api/admin/popupimage/getpopupimage'
export const UPDATE_POPUP_IMAGE_API = '/api/admin/popupimage/updatepopupimage'
/* ---------------------------- END Popup Image API ---------------------------- */
