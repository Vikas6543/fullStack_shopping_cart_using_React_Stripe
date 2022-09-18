import { createStore, combineReducers } from 'redux';
import { productReducer } from './reducers';

const reducer = combineReducers({
  products: productReducer,
});

const store = createStore(reducer);

export default store;
