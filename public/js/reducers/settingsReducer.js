import { UPDATE_SETTING,
         GOT_SETTINGS,
	 ADD_PAYMENT_GATEWAY,
	 REMOVE_PAYMENT_GATEWAY,
	 UPDATE_PAYMENT_GATEWAY } from '../actions/settingsActions';
import { ADD_USAGET_MAPPING } from '../actions/inputProcessorActions';
import Immutable from 'immutable';

const defaultState = Immutable.fromJS({
  subscribers: {
    account: {
      fields: []
    },
    subscriber: {
      fields: []
    }
  },
  payment_gateways: []
});

export default function (state = defaultState, action) {
  let { name, value, category, settings, gateway, param } = action;

  switch(action.type) {
    case UPDATE_SETTING:
      return state.setIn([category, name], value);

    case ADD_USAGET_MAPPING:
      const usaget_mapping = state.get('unit_types');
      return state.update('usage_types', list => list.push(action.usaget));

    case GOT_SETTINGS:
      return state.withMutations(map => {
	settings.map(setting => {
	  const data = setting.data.details;
	  if (setting.name === "pricing") data.vat = data.vat * 100;
          map.set(setting.name, Immutable.fromJS(data));
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

    default:
      return state;
  }
}
