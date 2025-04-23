import { createStore } from 'redux';
import rootReducer from '../root/rootreducer';  // Fixed path

const store = createStore(rootReducer);

export default store;
