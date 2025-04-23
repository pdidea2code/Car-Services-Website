import { LOGIN_SUCCESS, LOGOUT } from '../actions/action'

const initialState = {
  isAuthenticated: false,
  admin: null,
}

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS: {
      return {
        ...state,
        isAuthenticated: true,
        admin: action.data,
      }
    }

    case LOGOUT: {
      return {
        ...state,
        isAuthenticated: false,
        admin: null,
      }
    }
    default: {
      return {
        ...state,
      }
    }
  }
}

export default authReducer
