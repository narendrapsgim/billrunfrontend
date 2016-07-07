import Immutable from 'immutable';

import { GOT_INPUT_PROCESSORS } from '../actions/inputProcessorActions';

const defaultState = Immutable.fromJS([]);

export default function (state = defaultState, action) {
  switch (action.type) {
    case GOT_INPUT_PROCESSORS:
      return Immutable.fromJS(action.input_processors);

    default:
      return state;
  }
}
