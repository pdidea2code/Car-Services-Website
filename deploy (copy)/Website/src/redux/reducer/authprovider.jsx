import { SET_LOGIN, SET_LOGOUT } from "../action/action";

const initialState = {
  auth: null,
};

const authProviderReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_LOGIN:
      return { ...state, auth: action.payload };
    case SET_LOGOUT:
      return { ...state, auth: null };
    default:
      return state;
  }
};

export default authProviderReducer;
