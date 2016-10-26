import Immutable from 'immutable';
import {
  TOGGLE_DELETE_CONFIRM
} from '../../actions/guiStateActions/deleteConfirmAction';

// const defaultState = false;

const defaultState = Immutable.Map({
  isShow: false,
  desc: 'Please Confirm Delete'
});


const collectionReducer = (state = defaultState, action) => {
  switch(action.type) {
    case TOGGLE_DELETE_CONFIRM:

      return Immutable.Map({
        isShow: !state.get('isShow'),
        desc: action.desc || 'Please Confirm Delete'
      });

    default:
      return state;
  }
};

export default collectionReducer;
