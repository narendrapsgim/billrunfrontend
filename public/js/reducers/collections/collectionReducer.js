import Immutable from 'immutable';
import {
  SET_COLLECTION_NAME,
  SET_COLLECTION_DAYS,
  SET_COLLECTION_ACTIVE,
  SET_COLLECTION_MAIL_SUBJECT,
  SET_COLLECTION_MAIL_BODY,
  CLEAR_COLLECTION,
  SET_DUMNMY_COLLECTION,
  SET_DUMNMY_COLLECTION_2
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
                body: "Hello [[first name]],<br/>As one of our most valued customers, we would like to remind you that the payment of [[amount_due]] of last month was not paid. <br />We will appreciate your action and we highly appreciate your loyalty to us."
              });

    case SET_DUMNMY_COLLECTION_2:
      return  Immutable.Map({
        id: 2,
        name: "Second collection",
        days: 8,
        active: 1,
        subject: "Please complete your payment",
        body: "Hello [[first name]],<br/>Following our previous note, we wanted to update you that so far ,as of [[current date]] your payment for the amount  due of [[amount_due]] wasn't received.<br/>Please let us know, by responding to this mail or by calling [[call center number]] on your plans to pay."
      });

    case CLEAR_COLLECTION:
      return defaultState;

    default:
      return state;
  }
};

export default collectionReducer;
