import Immutable from 'immutable';
import _ from 'lodash';

import {
  SELECT_INPUT_PROCESSOR,
  SET_GENERATOR_NAME,
  SET_SEGMENTATION,
  ADD_SEGMENTATION,
  DELETE_SEGMENTATION,
  CLEAR_EXPORT_GENERATOR
} from '../actions/exportGeneratorActions';

let defaultState = Immutable.fromJS({
  name: '',
  inputProcess: {},
  segments: [{id: 0, field: null, from: null, to: null}]
});

export default function (state = defaultState, action) {
  // const {field, mapping, width} = action;

  switch (action.type) {
    case SET_GENERATOR_NAME:
      return state.set('name', action.name);

    case SELECT_INPUT_PROCESSOR:
      return state.set('inputProcess', action.inputProcessor);

    case SET_SEGMENTATION:
      let segment = state.get('segments').get(action.index);
      let segments = state.get('segments');
      segment = segment.set(action.key, action.value);
      segments = segments.set(action.index, segment);
      return state.set('segments', segments);

    case ADD_SEGMENTATION:
      let newSegment = Immutable.fromJS({id: 0, field: null, from: null, to: null});
      return state.update('segments', segments => segments.push(newSegment)); //state.set('segments', state.get('segments').push(newSegment));

    case DELETE_SEGMENTATION:
        return state.set('segments', state.get('segments').delete(action.index));

    case CLEAR_EXPORT_GENERATOR:
      return defaultState;

    default:
      return state;
  }
}
