import Immutable from 'immutable';
import uuid from 'uuid';
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
  eventsSelector,
} from '../selectors/settingsSelector';
import { apiBillRun, apiBillRunErrorHandler, apiBillRunSuccessHandler } from '../common/Api';
import {
  saveSettingsQuery,
} from '../common/ApiQueries';
import { getValueByUnit } from '../common/Util';


const getEventConvertedConditions = (propertyTypes, usageTypes, item, toBaseUnit = true) => {
  const convertedConditions = item.get('conditions', Immutable.List()).withMutations((conditionsWithMutations) => {
    conditionsWithMutations.forEach((cond, index) => {
      const unit = cond.get('unit', '');
      const usaget = cond.get('usaget', '');
      if (unit !== '' && usaget !== '') {
        const value = cond.get('value', 0);
        const newValue = getValueByUnit(propertyTypes, usageTypes, usaget, unit, value, toBaseUnit);
        conditionsWithMutations.setIn([index, 'value'], newValue);
      }
    });
  });
  return !convertedConditions.isEmpty()
    ? convertedConditions
    : Immutable.List();
};

const convertFromApiToUi = (event, params) => event.withMutations((eventWithMutations) => {
  const { propertyTypes, usageTypesData } = params;
  const uiFlags = Immutable.Map({
    id: uuid.v4(),
  });
  eventWithMutations.set('conditions', getEventConvertedConditions(propertyTypes, usageTypesData, event, false));
  eventWithMutations.set('ui_flags', uiFlags);
});

const convertFromUiToApi = (event, params) => event.withMutations((eventWithMutations) => {
  const { propertyTypes, usageTypesData } = params;
  eventWithMutations.delete('ui_flags');
  eventWithMutations.set('conditions', getEventConvertedConditions(propertyTypes, usageTypesData, event, true));
});

export const getEvents = (eventCategory = '') => (dispatch, getState) => {
  const settingsPath = (eventCategory === '') ? 'events' : `events.${eventCategory}`;
  return dispatch(getSettings(settingsPath)).then(() => {
    // Add local ID to events
    const state = getState();
    const usageTypesData = usageTypesDataSelector(state);
    const propertyTypes = propertyTypeSelector(state);
    const params = ({ usageTypesData, propertyTypes });
    const settingsEvents = state.settings.get('events', Immutable.List());
    settingsEvents.forEach((events, eventType) => {
      if (!['settings'].includes(eventType) && (eventCategory === '' || eventCategory === eventType)) {
        const eventsWithId = events.map(event => convertFromApiToUi(event, params));
        dispatch(updateSetting('events', eventType, eventsWithId));
      }
    });
  });
};

export const saveEvents = (eventCategory = '') => (dispatch, getState) => {
  // remove local ID to events
  const state = getState();
  const usageTypesData = usageTypesDataSelector(state);
  const propertyTypes = propertyTypeSelector(state);
  const settingsEvents = state.settings.get('events', Immutable.List());
  const params = ({ usageTypesData, propertyTypes });
  settingsEvents.forEach((events, eventType) => {
    if (!['settings'].includes(eventType) && (eventCategory === '' || eventCategory === eventType)) {
      const eventsWithId = events.map(event => convertFromUiToApi(event, params));
      dispatch(updateSetting('events', eventType, eventsWithId));
    }
  });
  const settingsPath = (eventCategory === '') ? 'events' : `events.${eventCategory}`;
  return dispatch(saveSettings([settingsPath]));
};

export const saveEvent = (eventCategory, event) => (dispatch, getState) => {
  const state = getState();
  const usageTypesData = usageTypesDataSelector(state);
  const propertyTypes = propertyTypeSelector(state);
  const params = ({ usageTypesData, propertyTypes });
  const convertedEvent = convertFromUiToApi(event, params);
  const category = `event.${eventCategory}`;
  const queries = saveSettingsQuery(convertedEvent, category);
  return apiBillRun(queries)
    .then(success => dispatch(apiBillRunSuccessHandler(success)))
    .catch(error => dispatch(apiBillRunErrorHandler(error)));
};

export const addEvent = (eventType, event) => (dispatch) => {
  const newEvent = event.setIn(['ui_flags', 'id'], uuid.v4());
  return dispatch(pushToSetting('events', newEvent, eventType));
};

export const updateEvent = (eventType, event) => (dispatch, getState) => {
  const events = eventsSelector(getState(), { eventType });
  const index = events.findIndex(e => e.getIn(['ui_flags', 'id'], '') === event.getIn(['ui_flags', 'id'], ''));
  if (index !== -1) {
    return dispatch(updateSetting('events', [eventType, index], event));
  }
  return Promise.reject();
};

export const removeEvent = (eventType, event) => (dispatch, getState) => {
  const events = eventsSelector(getState(), { eventType });
  const index = events.findIndex(e => e.getIn(['ui_flags', 'id'], '') === event.getIn(['ui_flags', 'id'], ''));
  if (index !== -1) {
    return dispatch(removeSettingField('events', [eventType, index]));
  }
  return false;
};

export const saveEventSettings = () => dispatch => dispatch(saveSettings(['events.settings']));

export const updateEventSettings = (path, value) => dispatch => dispatch(updateSetting('events', ['settings', ...path], value));

export const getEventSettings = () => dispatch => dispatch(getSettings(['events.settings']));
