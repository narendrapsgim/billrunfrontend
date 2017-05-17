import Immutable from 'immutable';
import {
  UPDATE_SETTING,
  REMOVE_SETTING_FIELD,
  GOT_SETTINGS,
  PUSH_TO_SETTING,
  ADD_PAYMENT_GATEWAY,
  REMOVE_PAYMENT_GATEWAY,
  UPDATE_PAYMENT_GATEWAY,
  SET_FIELD_POSITION,
  ADD_SHARED_SECRET,
  REMOVE_SHARED_SECRET,
  UPDATE_SHARED_SECRET,
} from '../actions/settingsActions';
import { ADD_USAGET_MAPPING } from '../actions/inputProcessorActions';
import { LOGOUT } from '../actions/userActions';

const LogoImg = require(`img/${globalSetting.defaultLogo}`);// eslint-disable-line  import/no-dynamic-require
const defaultState = Immutable.fromJS({
  subscribers: {
    account: {
      fields: [],
    },
    subscriber: {
      fields: [],
    },
  },
  files: {
    logo: LogoImg,
  },
  payment_gateways: [],
});

export default function (state = defaultState, action) {
  const { name, value, category, settings, gateway, secret } = action;

  switch(action.type) {
    case LOGOUT:
      return defaultState;

    case UPDATE_SETTING: {
      if (Array.isArray(name)) {
        return state.setIn([category, ...name], value);
      }
      return state.setIn([category, name], value);
    }

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
      return state.update('usage_types', list => list.push(action.usaget));

    case GOT_SETTINGS:
      return state.withMutations((stateWithMutations) => {
        settings.forEach((setting) => {
          const data = setting.data.details;
          if (setting.name === 'taxation') {
            data.vat *= 100;
          }
          stateWithMutations.setIn(setting.name.split('.'), Immutable.fromJS(data));
        });
      });

    case ADD_PAYMENT_GATEWAY: {
      const added = state.get('payment_gateways').filterNot(pg => pg.get('name') === gateway.name).push(Immutable.fromJS(gateway));
      return state.set('payment_gateways', added);
    }

    case REMOVE_PAYMENT_GATEWAY: {
      const removed = state.get('payment_gateways').filterNot(pg => pg.get('name') === gateway);
      return state.set('payment_gateways', removed);
    }

    case UPDATE_PAYMENT_GATEWAY: {
      const paymentgateway = state.get('payment_gateways').find(pg => pg.get('name') === gateway.name).set('params', gateway.params);
      const paymentgateways = state.get('payment_gateways').filterNot(pg => pg.get('name') === gateway.name).push(paymentgateway);
      return state.set('payment_gateways', paymentgateways);
    }

    case ADD_SHARED_SECRET: {
      const added = state.get('shared_secret').filterNot(shared => shared.get('key') === secret.get('key')).push(Immutable.fromJS(secret));
      return state.set('shared_secret', added);
    }

    case UPDATE_SHARED_SECRET: {
      const sharedSecrets = state.get('shared_secret').filterNot(shared => shared.get('key') === secret.get('key')).push(Immutable.fromJS(secret));
      return state.set('shared_secret', sharedSecrets);
    }

    case REMOVE_SHARED_SECRET: {
      const removed = state.get('shared_secret').filterNot(shared => shared.get('key') === secret);
      return state.set('shared_secret', removed);
    }

    case REMOVE_SETTING_FIELD: {
      if (Array.isArray(name)) {
        return state.deleteIn([category, ...name]);
      }
      return state.deleteIn([category, name]);
    }

    case SET_FIELD_POSITION: {
      const curr = state.getIn([...action.path, action.oldIndex]);
      return state.updateIn(action.path, Immutable.List(), list =>
        list.delete(action.oldIndex).insert(action.newIndex, curr)
      );
    }

    default:
      return state;
  }
}
