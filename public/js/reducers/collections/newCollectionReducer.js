import Immutable from 'immutable';
import uuid from 'uuid';
import { UPDATE_COLLECTION, CLEAR_COLLECTION } from '../../actions/collectionsActions';

const defaultState = Immutable.Map();
const collectionStepMail = Immutable.Map({
  id: '',
  name: '',
  type: 'mail',
  active: '',
  do_after_days: '',
  content: Immutable.Map({
    subject: '',
    body: '',
  }),
});

const newCollectionReducer = (state = defaultState, action) => {
  switch (action.type) {
    case UPDATE_COLLECTION:
      return state.setIn(action.path, action.value);

    case CLEAR_COLLECTION: {
      const id = uuid.v4();
      return collectionStepMail.set('id', id);
    }

    default:
      return state;
  }
};

export default newCollectionReducer;
