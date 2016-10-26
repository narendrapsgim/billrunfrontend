import Immutable from 'immutable';
import {
  SET_COLLECTION_NAME,
  SET_COLLECTION_DAYS,
  SET_COLLECTION_ACTIVE,
  SET_COLLECTION_MAIL_SUBJECT,
  SET_COLLECTION_MAIL_BODY,
  CLEAR_COLLECTION,
  SET_DUMNMY_COLLECTION
} from '../../actions/collectionsActions';

const defaultState = Immutable.Map({
  id: undefined,
  name: '',
  days: 1,
  active: 1,
  subject: '',
  body: ''
});

const collectionReducer = (state = defaultState, action) => {

  switch(action.type) {
    case SET_COLLECTION_NAME:
      return state.set('name', action.name);

    case SET_COLLECTION_DAYS:
      return state.set('days', action.days);

    case SET_COLLECTION_ACTIVE:
      return state.set('active', action.active);

    case SET_COLLECTION_ACTIVE:
      return state.set('active', action.active);

    case SET_COLLECTION_MAIL_SUBJECT:
      return state.set('subject', action.subject);

    case SET_COLLECTION_MAIL_BODY:
      return state.set('body', action.body);

    case SET_DUMNMY_COLLECTION:
      return  Immutable.Map({
                id: 1,
                name: "First collection",
                days: 3,
                active: 1,
                subject: "Please complete your payment",
                body: "Dear [[customer name]], <br />you have not pay for your last"
              });

    case CLEAR_COLLECTION:
      return defaultState;

    default:
      return state;
  }
};

export default collectionReducer;
