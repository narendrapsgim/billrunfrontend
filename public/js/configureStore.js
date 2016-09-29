import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from './reducers';
import thunkMiddleware from 'redux-thunk';
import DevTools from './containers/DevTools';

const enhancer = compose(
  // Middleware you want to use in development:
  applyMiddleware(thunkMiddleware),
  // Required! Enable Redux DevTools with the monitors you chose
  DevTools.instrument()
);


export default function configureStore(initialState = {}) {
  return createStore(
    rootReducer,
    initialState,
    enhancer
  );
}
