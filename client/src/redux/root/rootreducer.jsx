import { combineReducers } from 'redux';
import loadingReducer from '../reducer/loding'; 
import themeProviderReducer from '../reducer/themeprovider';
import appSettingReducer from '../reducer/appsetting';

const rootReducer = combineReducers({
    loading: loadingReducer,
    theme: themeProviderReducer,
    appSetting: appSettingReducer,
});

export default rootReducer;
