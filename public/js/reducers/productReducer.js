import Immutable from 'immutable';
import {
  UPDATE_PRODUCT_FIELD_VALUE,
  UPDATE_PRODUCT_USAGET_VALUE,
  UPDATE_PRODUCT_TO_VALUE,
  ADD_PRODUCT_RATE,
  REMOVE_PRODUCT_RATE,
  GOT_PRODUCT,
  CLEAR_PRODUCT } from '../actions/productActions';

const PRODUCT_UNLIMITED = globalSetting.productUnlimitedValue;
const defaultState = Immutable.Map({
  key: '',
  code: '',
  description: '',
  vatable: false,
});
const DefaultRate = Immutable.Record({
  from: 0,
  to: PRODUCT_UNLIMITED,
  interval: '',
  price: '',
});


export default function (state = defaultState, action) {
  switch (action.type) {

    case UPDATE_PRODUCT_FIELD_VALUE:
      return state.setIn(action.path, action.value);

    case UPDATE_PRODUCT_TO_VALUE: {
      return state.updateIn(action.path, Immutable.List(), (list) => {
        if (list.size > action.index) {
          const nextItemIndex = action.index + 1;
          return list
            .update(nextItemIndex, Immutable.Map(), item => item.set('from', action.value))
            .update(action.index, Immutable.Map(), item => item.set('to', action.value));
        }
        return list.update(action.index, Immutable.Map(), item => item.set('to', action.value));
      });
    }

    case UPDATE_PRODUCT_USAGET_VALUE: {
      const oldPath = [...action.path, action.oldUsaget];
      const newPath = [...action.path, action.newUsaget];
      return state.setIn(newPath, state.getIn(oldPath, Immutable.List())).deleteIn(oldPath);
    }

    case ADD_PRODUCT_RATE: {
      // if product prices array is empty - add new default item
      if (state.getIn(action.path, Immutable.List()).size === 0) {
        return state.updateIn(action.path, Immutable.List(), list => list.push(new DefaultRate()));
      }
      return state.updateIn(action.path, Immutable.List(), (list) => {
        // use last item for new price row
        const newItem = list.last();
        return list
          .update(list.size - 1, Immutable.Map(), item => (
            // reset TO value of last item if it 'Unlimited'
            (item.get('to') === PRODUCT_UNLIMITED) ? item.set('to', '') : item)
          )
          .push(newItem);
      });
    }

    case REMOVE_PRODUCT_RATE:
      return state.updateIn(action.path, (list) => {
        if (action.index > 0) {
          const prevItemIndex = action.index - 1;
          return list
            .update(prevItemIndex, item => item.set('to', PRODUCT_UNLIMITED))
            .delete(action.index);
        }
        return list.delete(action.index);
      });

    case GOT_PRODUCT:
      return Immutable.fromJS(action.product);

    case CLEAR_PRODUCT:
      return defaultState;

    default:
      return state;
  }
}
