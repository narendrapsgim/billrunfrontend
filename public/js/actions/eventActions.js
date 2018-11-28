import Immutable from 'immutable';
import uuid from 'uuid';
import { getEventConvertedConditions } from '../components/Events/EventsUtil';
import {
  saveSettings,
  updateSetting,
  removeSettingField,
  pushToSetting,
  getSettings,
} from './settingsActions';
import {
  usageTypesDataSelector,
  propertyTypeSelector,
  eventsSelectorForList,
} from '../selectors/settingsSelector';


const convertFromApiToUi = event => event.withMutations((eventWithMutations) => {
  const uiFlags = Immutable.Map({
    id: uuid.v4(),
  });
  eventWithMutations.set('ui_flags', uiFlags);
});

const convertFromUiToApi = event => event.withMutations((eventWithMutations) => {
  eventWithMutations.delete('ui_flags');
});

export const getEvents = (eventCategory = '') => (dispatch, getState) => {
  const settingsPath = (eventCategory === '') ? 'events' : `events.${eventCategory}`;
  return dispatch(getSettings(settingsPath)).then(() => {
    // Add local ID to events
    const state = getState();
    const settingsEvents = state.settings.get('events', Immutable.List());
    settingsEvents.forEach((events, eventType) => {
      if (!['settings'].includes(eventType) && (eventCategory === '' || eventCategory === eventType)) {
        const eventsWithId = events.map(event => convertFromApiToUi(event));
        dispatch(updateSetting('events', eventType, eventsWithId));
      }
    });
  });
};

export const saveEvents = (eventCategory = '') => (dispatch, getState) => {
  // remove local ID to events
  const state = getState();
  const settingsEvents = state.settings.get('events', Immutable.List());
  settingsEvents.forEach((events, eventType) => {
    if (!['settings'].includes(eventType) && (eventCategory === '' || eventCategory === eventType)) {
      const eventsWithId = events.map(event => convertFromUiToApi(event));
      dispatch(updateSetting('events', eventType, eventsWithId));
    }
  });
  const settingsPath = (eventCategory === '') ? 'events' : `events.${eventCategory}`;
  return dispatch(saveSettings([settingsPath]));
};

export const saveEvent = (entityType, index, event) => (dispatch, getState) => { // eslint-disable-line import/prefer-default-export
  const state = getState();
  const usageTypesData = usageTypesDataSelector(state);
  const propertyTypes = propertyTypeSelector(state);
  const convertedEvent = event.withMutations((eventWithMutations) => {
    eventWithMutations.set('conditions', getEventConvertedConditions(propertyTypes, usageTypesData, event, true));
  });
  return dispatch(updateSetting('events', [entityType, index], convertedEvent));
};

export const addEvent = (eventType, event) => (dispatch) => {
  const newEvent = event.setIn(['ui_flags', 'id'], uuid.v4());
  return dispatch(pushToSetting('events', newEvent, eventType));
};

export const updateEvent = (eventType, event) => (dispatch, getState) => {
  const events = eventsSelectorForList(getState(), { eventType });
  const index = events.findIndex(e => e.getIn(['ui_flags', 'id'], '') === event.getIn(['ui_flags', 'id'], ''));
  if (index !== -1) {
    return dispatch(updateSetting('events', [eventType, index], event));
  }
  return false;
};

export const removeEvent = (eventType, event) => (dispatch, getState) => {
  const events = eventsSelectorForList(getState(), { eventType });
  const index = events.findIndex(e => e.getIn(['ui_flags', 'id'], '') === event.getIn(['ui_flags', 'id'], ''));
  if (index !== -1) {
    return dispatch(removeSettingField('events', [eventType, index]));
  }
  return false;
};

export const saveEventSettings = () => dispatch => dispatch(saveSettings(['events.settings']));

export const updateEventSettings = (path, value) => dispatch => dispatch(updateSetting('events', ['settings', ...path], value));

export const getEventSettings = () => dispatch => dispatch(getSettings(['events.settings']));
