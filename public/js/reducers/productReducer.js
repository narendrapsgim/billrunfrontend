import  {
  UPDATE_PRODUCT_FIELD_VALUE,
  UPDATE_PRODUCT_USAGET_VALUE,
  ADD_PRODUCT_RATE,
  REMOVE_PRODUCT_RATE,
  GOT_PRODUCT,
  CLEAR_PRODUCT } from '../actions/productActions';
import moment from 'moment';
import Immutable from 'immutable';

const PRODUCT_UNLIMITED = globalSetting.productUnlimitedValue;
const defaultState = Immutable.Map({
  key: '',
  code: '',
  description: '',
  vatable : false,
});
const DefaultRate = Immutable.Record({
  from: 0,
  to: PRODUCT_UNLIMITED,
  interval: '',
  price: ''
});


export default function (state = defaultState, action) {

  switch (action.type) {

    case UPDATE_PRODUCT_FIELD_VALUE:
      return state.updateIn(action.path, value => action.value);

    case UPDATE_PRODUCT_USAGET_VALUE:
      let oldPath = [...action.path, action.oldUsaget];
      let newPath = [...action.path, action.newUsaget];
      state = state.setIn(newPath, state.getIn(oldPath, Immutable.List()));
      state = state.deleteIn(oldPath);
      return state;

    case ADD_PRODUCT_RATE:
      let insertItem = new DefaultRate();
      // if product prices array is not empty
      if (state.getIn(action.path) && state.getIn(action.path).size > 0) {
        // use last item for new price
        insertItem = state.getIn(action.path).last();
        // reset TO value of last item if it 'Unlimited'
        if (insertItem.get('to') === PRODUCT_UNLIMITED){
          state = state.updateIn(action.path, list =>
            list.update(list.size - 1, item => item.set('to', ''))
          )
        }
        // update FROM field to the TO field from last item and set TO field to unlimited
        insertItem = insertItem.set('from', insertItem.get('to')).set('to', PRODUCT_UNLIMITED);
      }
      state = state.updateIn(action.path, list => {
        if(typeof list === 'undefined'){
          list = Immutable.List();
        }
        return list.push(insertItem)
      });
      return state;

    case REMOVE_PRODUCT_RATE:
      return state.updateIn(action.path, list => list.delete(action.index)) ;

    case GOT_PRODUCT:
      return Immutable.fromJS(action.product);

    case CLEAR_PRODUCT:
      return defaultState;

    default:
      return state;
  }
}
