const initialState = {
  appSetting: null,
};

const appSettingReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_APP_SETTING":
      return {
        ...state,
        appSetting: action.payload,
      };
    default:
      return state;
  }
};

export default appSettingReducer;
