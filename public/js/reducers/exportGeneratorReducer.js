import Immutable from 'immutable';
import _ from 'lodash';

import { SELECT_INPUT_PROCESSOR, SET_GENERATOR_NAME, SET_SEGMENTATION } from '../actions/exportGeneratorActions';

let defaultState = Immutable.fromJS({
  name: '',
  inputProcess: new Map(),
  segments: new Map()
});

export default function (state = defaultState, action) {
  const { field, mapping, width } = action;
  if (action.type === SET_SEGMENTATION) {
    console.log(action);
  }
  switch (action.type) {
    case SET_GENERATOR_NAME:
      return state.set('name', action.name);

    case SELECT_INPUT_PROCESSOR:
      return state.set('inputProcess', action.inputProcessor);

    case SET_SEGMENTATION:
      if (action.oldSegment) {
        let newSegments = state.get('segments');
         newSegments = newSegments.delete(action.oldSegment);
        state.set('segments', newSegments);
      }

      return state.setIn(['segments', action.segment], action.values);

    default:
      return state;
  }
}
