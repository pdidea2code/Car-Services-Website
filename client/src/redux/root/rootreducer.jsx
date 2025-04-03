import { combineReducers } from "redux";
import loadingReducer from "../reducer/loding";
import themeProviderReducer from "../reducer/themeprovider";
import appSettingReducer from "../reducer/appsetting";
import authProviderReducer from "../reducer/authprovider";

const rootReducer = combineReducers({
  loading: loadingReducer,
  theme: themeProviderReducer,
  appSetting: appSettingReducer,
  auth: authProviderReducer,
});

export default rootReducer;
