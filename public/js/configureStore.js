import { createStore, applyMiddleware, compose } from 'redux';
import Immutable from 'immutable';
import thunkMiddleware from 'redux-thunk';
import persistState from 'redux-localstorage';
import rootReducer from './reducers';
import DevTools from './containers/DevTools';


export default function configureStore(initialState = {}) {
  const localstorageConfig = {
    key: globalSetting.storageVersion || 'app',
    slicer: paths => (state) => {
      const subset = {};
      paths.forEach((path) => {
        if (path === 'entityList') {
          subset.entityList = {
            size: state.entityList.size,
            filter: state.entityList.filter,
            sort: state.entityList.sort,
            state: state.entityList.state,
          };
        } else {
          subset[path] = state[path];
        }
      });
      return subset;
    },
    deserialize: (serializedData) => {
      const parseData = JSON.parse(serializedData);
      if (parseData) {
        Object.keys(parseData).forEach((key) => {
          if (key === 'entityList') {
            Object.keys(parseData[key]).forEach((entityListKey) => {
              parseData[key][entityListKey] = Immutable.fromJS(parseData[key][entityListKey]);
            });
          }
        });
      }
      return parseData;
    },
  };

  const enhancer = process.env.NODE_ENV !== 'production'
    ? compose(
        persistState(['entityList'], localstorageConfig),
        // Middleware you want to use in development:
        applyMiddleware(thunkMiddleware),
        // Required! Enable Redux DevTools with the monitors you chose
        DevTools.instrument()
      )
    : compose(
        persistState(['entityList'], localstorageConfig),
        applyMiddleware(thunkMiddleware),
      );

  return createStore(
    rootReducer,
    initialState,
    enhancer
  );
}
