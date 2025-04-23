import { createStore } from 'redux'
import rootReducer from '../root/rootReducer'

const store = createStore(rootReducer)
export default store
