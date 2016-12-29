import Immutable from 'immutable';
import { UPDATE_SETTING,
         REMOVE_SETTING_FIELD,
         GOT_SETTINGS,
         PUSH_TO_SETTING,
	 ADD_PAYMENT_GATEWAY,
	 REMOVE_PAYMENT_GATEWAY,
	 UPDATE_PAYMENT_GATEWAY,
         SET_FIELD_POSITION } from '../actions/settingsActions';
import { ADD_USAGET_MAPPING } from '../actions/inputProcessorActions';
import { LOGOUT } from '../actions/userActions';

const LogoImg = require(`img/${globalSetting.defaultLogo}`);// eslint-disable-line  import/no-dynamic-require
const defaultState = Immutable.fromJS({
  subscribers: {
    account: {
      fields: []
    },
    subscriber: {
      fields: []
    }
  },
  files: {
    logo: LogoImg,
  },
  payment_gateways: []
});

export default function (state = defaultState, action) {
  let { name, value, category, settings, gateway, param } = action;

  switch(action.type) {
    case LOGOUT:
      return defaultState;

    case UPDATE_SETTING:
      if (Array.isArray(name)) {
        return state.setIn([category, ...name], value);
      }
      return state.setIn([category, name], value);

    case PUSH_TO_SETTING: {
      let path;
      if (!action.path) {
        path = [category];
      } else if (action.path && Array.isArray(action.path)) {
        path = [category, ...action.path];
      } else {
        path = [category, action.path];
      }
      return state.updateIn(path, Immutable.List(), list => list.push(action.value));
    }

    case ADD_USAGET_MAPPING:
      const usaget_mapping = state.get('unit_types');
      return state.update('usage_types', list => list.push(action.usaget));

    case GOT_SETTINGS:
      return state.withMutations((stateWithMutations) => {
        settings.forEach((setting) => {
          const data = setting.data.details;
          if (setting.name === 'pricing') {
            data.vat *= 100;
          }
          stateWithMutations.setIn(setting.name.split('.'), Immutable.fromJS(data));
        });
      });

    case ADD_PAYMENT_GATEWAY:
      const added = state.get('payment_gateways').filterNot(pg => pg.get('name') === gateway.name).push(Immutable.fromJS(gateway));
      return state.set('payment_gateways', added);

    case REMOVE_PAYMENT_GATEWAY:
      const removed = state.get('payment_gateways').filterNot(pg => pg.get('name') === gateway);
      return state.set('payment_gateways', removed);

    case UPDATE_PAYMENT_GATEWAY:
      const paymentgateway = state.get('payment_gateways').find(pg => pg.get('name') === gateway.name).set('params', gateway.params);
      const paymentgateways = state.get('payment_gateways').filterNot(pg => pg.get('name') === gateway.name).push(paymentgateway);
      return state.set('payment_gateways', paymentgateways);

    case REMOVE_SETTING_FIELD:
      if (Array.isArray(name)) {
        return state.deleteIn([category, ...name]);
      }
      return state.deleteIn([category, name]);

    case SET_FIELD_POSITION:
      const curr = state.getIn([...action.setting, action.index]);
      return state.updateIn(action.setting, list => list.delete(action.index).insert(action.over, curr));

    default:
      return state;
  }
}
