import { SET_LOADING, SET_LOADING_FALSE } from "../action/action";

const initialState = {
    loading: false,
};

const loadingReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_LOADING:
            return { ...state, loading: true };
        case SET_LOADING_FALSE:
            return { ...state, loading: false };
        default:
            return state;
    }
};

export default loadingReducer;
