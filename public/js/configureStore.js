import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from './reducers';
import thunkMiddleware from 'redux-thunk';
import DevTools from './containers/DevTools';

export default function configureStore(initialState = {}) {
  const enhancer = process.env.NODE_ENV !== 'production' ?
                   compose(
                     // Middleware you want to use in development:
                     applyMiddleware(thunkMiddleware),
                     // Required! Enable Redux DevTools with the monitors you chose
                     DevTools.instrument()
                   ) :
                   applyMiddleware(thunkMiddleware);

  return createStore(
    rootReducer,
    initialState,
    enhancer
  );
}
