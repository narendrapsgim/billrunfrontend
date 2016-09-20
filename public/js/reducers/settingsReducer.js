import { UPDATE_SETTING,
         GOT_SETTINGS,
	 SELECT_PAYMENT_GATEWAY,
	 DESELECT_PAYMENT_GATEWAY,
	 CHANGE_PAYMENT_GATEWAY_PARAM } from '../actions/settingsActions';
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
  let { name, value, category, settings, gateway_name, param } = action;
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

    case DESELECT_PAYMENT_GATEWAY:
      return state.update('payment_gateways', list =>
	list.filterNot(pg =>
	  pg.get('name') === gateway_name
	));

    case SELECT_PAYMENT_GATEWAY:
      return state.update('payment_gateways', list => list.push(Immutable.fromJS({name: gateway_name})));

    case CHANGE_PAYMENT_GATEWAY_PARAM:
      const idx = state.get('payment_gateways').findIndex(pg => pg.get('name') === gateway_name);
      if (idx < 0) return state;
      return state.update('payment_gateways', list =>
	list.update(idx, pg => pg.set(param, value))
      );
      
    default:
      return state;
  }
}
