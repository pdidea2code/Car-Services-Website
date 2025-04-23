import axios from 'axios'
import {
  MAIN_URL,
  LOGIN_API,
  GET_ALL_USER_API,
  UPDATE_USER_API,
  GET_ALL_CAR_TYPE_API,
  ADD_CAR_TYPE_API,
  EDIT_CAR_TYPE_API,
  DELETE_CAR_TYPE_API,
  GET_ALL_SHOWCASE_API,
  ADD_SHOWCASE_API,
  EDIT_SHOWCASE_API,
  DELETE_SHOWCASE_API,
  GET_ALL_SERVICE_API,
  ADD_SERVICE_API,
  EDIT_SERVICE_API,
  GET_ALL_ADDONS_API,
  ADD_ADDONS_API,
  EDIT_ADDONS_API,
  DELETE_ADDONS_API,
  GET_ADDONS_BY_SERVICE_API,
  GET_ALL_APP_SETTING_API,
  EDIT_APP_SETTING_API,
  GET_ALL_FAQ_API,
  ADD_FAQ_API,
  EDIT_FAQ_API,
  DELETE_FAQ_API,
  GET_ADMIN_THEME_API,
  EDIT_ADMIN_THEME_API,
  ADD_BLOG_API,
  GET_BLOG_BY_ID_API,
  UPDATE_BLOG_API,
  GET_ALL_BLOG_API,
  UPDATE_BLOG_STATUS_API,
  DELETE_BLOG_API,
  GET_ALL_ADDRESS_API,
  ADD_ADDRESS_API,
  EDIT_ADDRESS_API,
  DELETE_ADDRESS_API,
  GET_ALL_BUSINESS_HOUR_API,
  EDIT_BUSINESS_HOUR_API,
  DELETE_BUSINESS_HOUR_API,
  GET_ALL_USER_THEME_API,
  SET_ACTIVE_USER_THEME_API,
  ADD_USER_THEME_API,
  SOFT_DELETE_SERVICE_API,
  GET_ALL_PROMOCODE_API,
  ADD_PROMOCODE_API,
  EDIT_PROMOCODE_API,
  DELETE_PROMOCODE_API,
  GET_ALL_ORDER_API,
  GET_UPCOMING_ORDER_API,
  UPDATE_ORDER_STATUS_API,
  GET_ALL_REVIEW_API,
  CHANGE_REVIEW_STATUS_API,
  DELETE_REVIEW_API,
  GET_SERVICE_BY_ID_API,
  GET_KPI_METRICS_API,
  GET_ORDER_STATUS_BREAKDOWN_API,
  GET_TOP_SERVICES_AND_ADDONS_API,
  GET_RECENT_ACTIVITY_API,
  GET_SYSTEM_HEALTH_ALERTS_API,
  GET_PAST_ORDER_API,
  GET_TODAY_ORDER_API,
  GET_CONTENT_API,
  DELETE_CONTENT_API,
  UPDATE_CONTENT_API,
} from '../../constant'
import Cookies from 'js-cookie'
axios.interceptors.response.use(
  (response) => response,
  async (err) => {
    const originalRequest = err.config

    // Check for 401 Unauthorized (expired token) and ensure no infinite retry
    if (err.response?.status === 402 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = Cookies.get('refreshToken')

        if (!refreshToken) {
          // No refresh token available, redirect to login
          Cookies.remove('token')
          Cookies.remove('refreshToken')
          Cookies.remove('admin')
          window.location.href = '/'
          return Promise.reject(err)
        }

        // Request new access token using refresh token
        const res = await axios.post(`${MAIN_URL}/api/admin/auth/refreshtoken`, {
          refreshToken,
        })
        const accessToken = res.data.info // Adjust based on actual response structure

        // Update access token in cookies
        Cookies.set('token', accessToken, { sameSite: 'Strict', secure: true })

        // Update Authorization header and retry original request
        originalRequest.headers.Authorization = `Bearer ${accessToken}`

        return axios(originalRequest)
      } catch (refreshErr) {
        console.error('Error refreshing token:', refreshErr)
        // Clear cookies and redirect to login on refresh failure
        Cookies.remove('token')
        Cookies.remove('refreshToken')
        Cookies.remove('admin')
        window.location.href = '/'
        return Promise.reject(refreshErr)
      }
    }

    // Handle other errors (e.g., 403 Forbidden or invalid credentials)
    if (err.response?.status === 403) {
      Cookies.remove('token')
      Cookies.remove('refreshToken')
      Cookies.remove('admin')
      window.location.href = '/'
    }

    return Promise.reject(err)
  },
)

/* ---------------------------- END Auth API ---------------------------- */
export const LoginApi = async (data) => axios.post(MAIN_URL + LOGIN_API, data)

/* ---------------------------- END User API ---------------------------- */
export const getAllUserApi = async () =>
  axios.get(MAIN_URL + GET_ALL_USER_API, {
    headers: {
      Authorization: `Bearer ${Cookies.get('token')}`,
    },
  })
export const updateUserApi = async (data) =>
  axios.post(MAIN_URL + UPDATE_USER_API, data, {
    headers: {
      Authorization: `Bearer ${Cookies.get('token')}`,
    },
  })

/* ---------------------------- END User API ---------------------------- */
/* ---------------------------- Car Type API ---------------------------- */
export const getAllCarTypeApi = async () =>
  axios.get(MAIN_URL + GET_ALL_CAR_TYPE_API, {
    headers: {
      Authorization: `Bearer ${Cookies.get('token')}`,
    },
  })
export const addCarTypeApi = async (data) =>
  axios.post(MAIN_URL + ADD_CAR_TYPE_API, data, {
    headers: {
      Authorization: `Bearer ${Cookies.get('token')}`,
    },
  })
export const editCarTypeApi = async (data) =>
  axios.post(MAIN_URL + EDIT_CAR_TYPE_API, data, {
    headers: {
      Authorization: `Bearer ${Cookies.get('token')}`,
    },
  })
export const deleteCarTypeApi = async (data) =>
  axios.post(MAIN_URL + DELETE_CAR_TYPE_API, data, {
    headers: {
      Authorization: `Bearer ${Cookies.get('token')}`,
    },
  })
/* ---------------------------- END Car Type API ---------------------------- */
/* ---------------------------- Showcase API ---------------------------- */
export const getAllShowcaseApi = async () =>
  axios.get(MAIN_URL + GET_ALL_SHOWCASE_API, {
    headers: {
      Authorization: `Bearer ${Cookies.get('token')}`,
    },
  })
export const addShowcaseApi = async (data) =>
  axios.post(MAIN_URL + ADD_SHOWCASE_API, data, {
    headers: {
      Authorization: `Bearer ${Cookies.get('token')}`,
    },
  })

export const editShowcaseApi = async (data) =>
  axios.post(MAIN_URL + EDIT_SHOWCASE_API, data, {
    headers: {
      Authorization: `Bearer ${Cookies.get('token')}`,
    },
  })

export const deleteShowcaseApi = async (data) =>
  axios.post(MAIN_URL + DELETE_SHOWCASE_API, data, {
    headers: {
      Authorization: `Bearer ${Cookies.get('token')}`,
    },
  })
/* ---------------------------- END Showcase API ---------------------------- */
/* ---------------------------- Service API ---------------------------- */
export const getAllServiceApi = async () =>
  axios.get(MAIN_URL + GET_ALL_SERVICE_API, {
    headers: {
      Authorization: `Bearer ${Cookies.get('token')}`,
    },
  })
export const addServiceApi = async (data) =>
  axios.post(MAIN_URL + ADD_SERVICE_API, data, {
    headers: {
      Authorization: `Bearer ${Cookies.get('token')}`,
    },
  })

export const editServiceApi = async (data) =>
  axios.post(MAIN_URL + EDIT_SERVICE_API, data, {
    headers: {
      Authorization: `Bearer ${Cookies.get('token')}`,
    },
  })
export const softDeleteServiceApi = async (data) =>
  axios.post(MAIN_URL + SOFT_DELETE_SERVICE_API, data, {
    headers: {
      Authorization: `Bearer ${Cookies.get('token')}`,
    },
  })
export const getServiceByIdApi = async (data) =>
  axios.post(MAIN_URL + GET_SERVICE_BY_ID_API, data, {
    headers: {
      Authorization: `Bearer ${Cookies.get('token')}`,
    },
  })
/* ---------------------------- END Service API ---------------------------- */
/* ---------------------------- Addons API ---------------------------- */
export const getAllAddonsApi = async () =>
  axios.get(MAIN_URL + GET_ALL_ADDONS_API, {
    headers: {
      Authorization: `Bearer ${Cookies.get('token')}`,
    },
  })
export const addAddonsApi = async (data) =>
  axios.post(MAIN_URL + ADD_ADDONS_API, data, {
    headers: {
      Authorization: `Bearer ${Cookies.get('token')}`,
    },
  })
export const editAddonsApi = async (data) =>
  axios.post(MAIN_URL + EDIT_ADDONS_API, data, {
    headers: {
      Authorization: `Bearer ${Cookies.get('token')}`,
    },
  })
export const deleteAddonsApi = async (data) =>
  axios.post(MAIN_URL + DELETE_ADDONS_API, data, {
    headers: {
      Authorization: `Bearer ${Cookies.get('token')}`,
    },
  })
export const getAddonsByServiceApi = async (data) =>
  axios.post(MAIN_URL + GET_ADDONS_BY_SERVICE_API, data, {
    headers: {
      Authorization: `Bearer ${Cookies.get('token')}`,
    },
  })
/* ---------------------------- END Addons API ---------------------------- */
/* ---------------------------- App Setting API ---------------------------- */
export const getAllAppSettingApi = async () =>
  axios.get(MAIN_URL + GET_ALL_APP_SETTING_API, {
    headers: {
      Authorization: `Bearer ${Cookies.get('token')}`,
    },
  })
export const editAppSettingApi = async (data) =>
  axios.post(MAIN_URL + EDIT_APP_SETTING_API, data, {
    headers: {
      Authorization: `Bearer ${Cookies.get('token')}`,
    },
  })
/* ---------------------------- END App Setting API ---------------------------- */
/* ---------------------------- FAQ API ---------------------------- */
export const getAllFaqApi = async () =>
  axios.get(MAIN_URL + GET_ALL_FAQ_API, {
    headers: {
      Authorization: `Bearer ${Cookies.get('token')}`,
    },
  })
export const addFaqApi = async (data) =>
  axios.post(MAIN_URL + ADD_FAQ_API, data, {
    headers: {
      Authorization: `Bearer ${Cookies.get('token')}`,
    },
  })
export const editFaqApi = async (data) =>
  axios.post(MAIN_URL + EDIT_FAQ_API, data, {
    headers: {
      Authorization: `Bearer ${Cookies.get('token')}`,
    },
  })
export const deleteFaqApi = async (data) =>
  axios.post(MAIN_URL + DELETE_FAQ_API, data, {
    headers: {
      Authorization: `Bearer ${Cookies.get('token')}`,
    },
  })
/* ---------------------------- END FAQ API ---------------------------- */
/* ---------------------------- Admin Theme API ---------------------------- */
export const getAdminThemeApi = async () =>
  axios.get(MAIN_URL + GET_ADMIN_THEME_API, {
    headers: {
      Authorization: `Bearer ${Cookies.get('token')}`,
    },
  })
export const editAdminThemeApi = async (data) =>
  axios.post(MAIN_URL + EDIT_ADMIN_THEME_API, data, {
    headers: {
      Authorization: `Bearer ${Cookies.get('token')}`,
    },
  })
/* ---------------------------- END Admin Theme API ---------------------------- */
/* ---------------------------- Blog API ---------------------------- */
export const addBlogApi = async (data) =>
  axios.post(MAIN_URL + ADD_BLOG_API, data, {
    headers: {
      Authorization: `Bearer ${Cookies.get('token')}`,
    },
  })
export const getBlogByIdApi = async (data) =>
  axios.post(MAIN_URL + GET_BLOG_BY_ID_API, data, {
    headers: {
      Authorization: `Bearer ${Cookies.get('token')}`,
    },
  })

export const updateBlogApi = async (data) =>
  axios.post(MAIN_URL + UPDATE_BLOG_API, data, {
    headers: {
      Authorization: `Bearer ${Cookies.get('token')}`,
    },
  })
export const getAllBlogApi = async () =>
  axios.get(MAIN_URL + GET_ALL_BLOG_API, {
    headers: {
      Authorization: `Bearer ${Cookies.get('token')}`,
    },
  })
export const updateBlogStatusApi = async (data) =>
  axios.post(MAIN_URL + UPDATE_BLOG_STATUS_API, data, {
    headers: {
      Authorization: `Bearer ${Cookies.get('token')}`,
    },
  })
export const deleteBlogApi = async (data) =>
  axios.post(MAIN_URL + DELETE_BLOG_API, data, {
    headers: {
      Authorization: `Bearer ${Cookies.get('token')}`,
    },
  })
/* ---------------------------- END Blog API ---------------------------- */
/* ---------------------------- Address API ---------------------------- */
export const getAllAddressApi = async () =>
  axios.get(MAIN_URL + GET_ALL_ADDRESS_API, {
    headers: {
      Authorization: `Bearer ${Cookies.get('token')}`,
    },
  })
export const addAddressApi = async (data) =>
  axios.post(MAIN_URL + ADD_ADDRESS_API, data, {
    headers: {
      Authorization: `Bearer ${Cookies.get('token')}`,
    },
  })
export const editAddressApi = async (data) =>
  axios.post(MAIN_URL + EDIT_ADDRESS_API, data, {
    headers: {
      Authorization: `Bearer ${Cookies.get('token')}`,
    },
  })
export const deleteAddressApi = async (data) =>
  axios.post(MAIN_URL + DELETE_ADDRESS_API, data, {
    headers: {
      Authorization: `Bearer ${Cookies.get('token')}`,
    },
  })
/* ---------------------------- END Address API ---------------------------- */
/* ---------------------------- Business Hour API ---------------------------- */
export const getAllBusinessHourApi = async () =>
  axios.get(MAIN_URL + GET_ALL_BUSINESS_HOUR_API, {
    headers: {
      Authorization: `Bearer ${Cookies.get('token')}`,
    },
  })

export const editBusinessHourApi = async (data) =>
  axios.post(MAIN_URL + EDIT_BUSINESS_HOUR_API, data, {
    headers: {
      Authorization: `Bearer ${Cookies.get('token')}`,
    },
  })

export const deleteBusinessHourApi = async (data) =>
  axios.post(MAIN_URL + DELETE_BUSINESS_HOUR_API, data, {
    headers: {
      Authorization: `Bearer ${Cookies.get('token')}`,
    },
  })
/* ---------------------------- END Business Hour API ---------------------------- */
/* ---------------------------- User Theme API ---------------------------- */
export const getAllUserThemeApi = async () =>
  axios.get(MAIN_URL + GET_ALL_USER_THEME_API, {
    headers: {
      Authorization: `Bearer ${Cookies.get('token')}`,
    },
  })
export const setActiveUserThemeApi = async (data) =>
  axios.post(MAIN_URL + SET_ACTIVE_USER_THEME_API, data, {
    headers: {
      Authorization: `Bearer ${Cookies.get('token')}`,
    },
  })
export const addUserThemeApi = async (data) =>
  axios.post(MAIN_URL + ADD_USER_THEME_API, data, {
    headers: {
      Authorization: `Bearer ${Cookies.get('token')}`,
    },
  })
/* ---------------------------- END User Theme API ---------------------------- */
/* ---------------------------- Promocode API ---------------------------- */
export const getAllPromocodeApi = async () =>
  axios.get(MAIN_URL + GET_ALL_PROMOCODE_API, {
    headers: {
      Authorization: `Bearer ${Cookies.get('token')}`,
    },
  })
export const addPromocodeApi = async (data) =>
  axios.post(MAIN_URL + ADD_PROMOCODE_API, data, {
    headers: {
      Authorization: `Bearer ${Cookies.get('token')}`,
    },
  })
export const editPromocodeApi = async (data) =>
  axios.post(MAIN_URL + EDIT_PROMOCODE_API, data, {
    headers: {
      Authorization: `Bearer ${Cookies.get('token')}`,
    },
  })
export const deletePromocodeApi = async (data) =>
  axios.post(MAIN_URL + DELETE_PROMOCODE_API, data, {
    headers: {
      Authorization: `Bearer ${Cookies.get('token')}`,
    },
  })
/* ---------------------------- END Promocode API ---------------------------- */
/* ---------------------------- Order API ---------------------------- */
export const getAllOrdersApi = async () =>
  axios.get(MAIN_URL + GET_ALL_ORDER_API, {
    headers: {
      Authorization: `Bearer ${Cookies.get('token')}`,
    },
  })
export const getUpcomingOrdersApi = async () =>
  axios.get(MAIN_URL + GET_UPCOMING_ORDER_API, {
    headers: {
      Authorization: `Bearer ${Cookies.get('token')}`,
    },
  })
export const getPastOrdersApi = async () =>
  axios.get(MAIN_URL + GET_PAST_ORDER_API, {
    headers: {
      Authorization: `Bearer ${Cookies.get('token')}`,
    },
  })
export const getTodayOrdersApi = async () =>
  axios.get(MAIN_URL + GET_TODAY_ORDER_API, {
    headers: {
      Authorization: `Bearer ${Cookies.get('token')}`,
    },
  })
export const updateOrderStatusApi = async (data) =>
  axios.post(MAIN_URL + UPDATE_ORDER_STATUS_API, data, {
    headers: {
      Authorization: `Bearer ${Cookies.get('token')}`,
    },
  })
/* ----------------------------\ END Order API ---------------------------- */
/* ---------------------------- Review API ---------------------------- */
export const getAllReviewsApi = async () =>
  axios.get(MAIN_URL + GET_ALL_REVIEW_API, {
    headers: {
      Authorization: `Bearer ${Cookies.get('token')}`,
    },
  })
export const changeReviewStatusApi = async (data) =>
  axios.post(MAIN_URL + CHANGE_REVIEW_STATUS_API, data, {
    headers: {
      Authorization: `Bearer ${Cookies.get('token')}`,
    },
  })
export const deleteReviewApi = async (data) =>
  axios.post(MAIN_URL + DELETE_REVIEW_API, data, {
    headers: {
      Authorization: `Bearer ${Cookies.get('token')}`,
    },
  })
/* ---------------------------- END Review API ---------------------------- */
/* ---------------------------- Dashboard API ---------------------------- */
export const getKpiMetricsApi = async () =>
  axios.get(MAIN_URL + GET_KPI_METRICS_API, {
    headers: {
      Authorization: `Bearer ${Cookies.get('token')}`,
    },
  })
export const getOrderStatusBreakdownApi = async () =>
  axios.get(MAIN_URL + GET_ORDER_STATUS_BREAKDOWN_API, {
    headers: {
      Authorization: `Bearer ${Cookies.get('token')}`,
    },
  })
export const getTopServicesAndAddonsApi = async () =>
  axios.get(MAIN_URL + GET_TOP_SERVICES_AND_ADDONS_API, {
    headers: {
      Authorization: `Bearer ${Cookies.get('token')}`,
    },
  })
export const getRecentActivityApi = async () =>
  axios.get(MAIN_URL + GET_RECENT_ACTIVITY_API, {
    headers: {
      Authorization: `Bearer ${Cookies.get('token')}`,
    },
  })

export const getSystemHealthAlertsApi = async () =>
  axios.get(MAIN_URL + GET_SYSTEM_HEALTH_ALERTS_API, {
    headers: {
      Authorization: `Bearer ${Cookies.get('token')}`,
    },
  })
/* ---------------------------- END Dashboard API ---------------------------- */
/* ---------------------------- Content API ---------------------------- */
export const getAllContentApi = async () =>
  axios.get(MAIN_URL + GET_CONTENT_API, {
    headers: {
      Authorization: `Bearer ${Cookies.get('token')}`,
    },
  })
export const deleteContentApi = async (data) =>
  axios.post(MAIN_URL + DELETE_CONTENT_API, data, {
    headers: {
      Authorization: `Bearer ${Cookies.get('token')}`,
    },
  })
export const updateContentApi = async (data) =>
  axios.post(MAIN_URL + UPDATE_CONTENT_API, data, {
    headers: {
      Authorization: `Bearer ${Cookies.get('token')}`,
    },
  })
/* ---------------------------- END Content API ---------------------------- */
