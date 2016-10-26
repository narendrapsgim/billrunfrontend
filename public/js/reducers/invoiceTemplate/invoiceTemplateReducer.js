import Immutable from 'immutable';
import {
  SET_INVOICE_TEMPLATE,
  CLEAR_INVOICE_TEMPLATE
} from '../../actions/invoiceTemplateActions';

const defaultState = Immutable.Map({
  header: '',
  footer: ''
});

const collectionReducer = (state = defaultState, action) => {

  switch(action.type) {
    case SET_INVOICE_TEMPLATE:
      return state.set(action.path, action.value);

    case CLEAR_INVOICE_TEMPLATE:
      return defaultState;

    default:
      return state;
  }
};

export default collectionReducer;
