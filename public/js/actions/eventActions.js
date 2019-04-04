import Immutable from 'immutable';
import uuid from 'uuid';
import isNumber from 'is-number';
import {
  saveSettings,
  updateSetting,
  removeSettingField,
  pushToSetting,
  getSettings,
} from './settingsActions';
import { pushToList } from './listActions';
import {
  setFormModalError,
} from './guiStateActions/pageActions';
import {
  usageTypesDataSelector,
  propertyTypeSelector,
  eventsSelector,
} from '../selectors/settingsSelector';
import {
  effectOnEventUsagetFieldsSelector,
} from '../selectors/eventSelectors';
import { apiBillRun, apiBillRunErrorHandler, apiBillRunSuccessHandler } from '../common/Api';
import {
  getProductsByKeysQuery,
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

const getEventConvertedThreshold = (propertyTypes, usageTypes, item, toBaseUnit = true) => {
  const convertedThreshold = item.getIn(['threshold_conditions', 0], Immutable.List()).withMutations((thresholdWithMutations) => {
    thresholdWithMutations.forEach((threshold, index) => {
      const unit = threshold.get('unit', '');
      const usaget = threshold.get('usaget', '');
      const value = threshold.get('value', 0);
      if (unit !== '' && usaget !== '') {
        if (Immutable.List.isList(value) || Array.isArray(value)) {
          const arrayVal = value.map((val) => {
            const newValue = getValueByUnit(propertyTypes, usageTypes, usaget, unit, val, toBaseUnit);
            return isNumber(newValue) ? parseFloat(newValue) : newValue;
          });
          thresholdWithMutations.setIn([index, 'value'], arrayVal);
        } else {
          const newValue = getValueByUnit(propertyTypes, usageTypes, usaget, unit, value, toBaseUnit);
          const val = isNumber(newValue) ? parseFloat(newValue) : newValue;
          thresholdWithMutations.setIn([index, 'value'], val);
        }
      }
      if (!toBaseUnit && Immutable.Iterable.isIterable(value)) {
        thresholdWithMutations.setIn([index, 'value'], value.toList());
      }
      if (!toBaseUnit && !Immutable.Iterable.isIterable(value) && ['in', 'nin'].includes(threshold.get('op', ''))) {
        thresholdWithMutations.setIn([index, 'value'], Immutable.List([value]));
      }
    });
  });
  return !convertedThreshold.isEmpty()
    ? convertedThreshold
    : Immutable.List();
};

const convertFromApiToUi = (event, eventType, params) => event.withMutations((eventWithMutations) => {
  const { propertyTypes, usageTypesData, effectOnUsagetFields } = params;
  const eventUsageTypeFromEvent = Immutable.Map().withMutations((eventUsageTypeWithMutations) => {
    if (eventType === 'fraud') {
      event.getIn(['conditions', 0]).forEach((cond) => {
        if (effectOnUsagetFields.includes(cond.get('field', ''))) {
          eventUsageTypeWithMutations.set(cond.get('field', ''), cond.get('value', Immutable.List()));
        }
      });
    }
  });
  const uiFlags = Immutable.Map({
    id: uuid.v4(),
    eventUsageType: eventUsageTypeFromEvent,
  });
  eventWithMutations.set('conditions', getEventConvertedConditions(propertyTypes, usageTypesData, event, false));
  eventWithMutations.setIn(['threshold_conditions', 0], getEventConvertedThreshold(propertyTypes, usageTypesData, event, false));
  eventWithMutations.set('ui_flags', uiFlags);
});

const convertFromUiToApi = (event, eventType, params) =>
  event.withMutations((eventWithMutations) => {
    const { propertyTypes, usageTypesData } = params;
    eventWithMutations.delete('ui_flags');
    if (eventType === 'fraud') {
      const withoutEmptyConditions = eventWithMutations.getIn(['conditions', 0], Immutable.List())
        .filter(cond => (cond.get('field', '') !== '' && cond.get('op', '')));
      eventWithMutations.setIn(['conditions', 0], withoutEmptyConditions);
    }
    eventWithMutations.set('conditions', getEventConvertedConditions(propertyTypes, usageTypesData, eventWithMutations, true));
    eventWithMutations.setIn(['threshold_conditions', 0], getEventConvertedThreshold(propertyTypes, usageTypesData, eventWithMutations, true));
  });

export const getEvents = (eventCategory = '') => (dispatch, getState) => {
  const settingsPath = (eventCategory === '') ? 'events' : `events.${eventCategory}`;
  return dispatch(getSettings(settingsPath)).then(() => {
    // Add local ID to events
    const state = getState();
    const usageTypesData = usageTypesDataSelector(state);
    const propertyTypes = propertyTypeSelector(state);
    const effectOnUsagetFields = effectOnEventUsagetFieldsSelector(state, { eventType: 'fraud' });
    const params = ({ usageTypesData, propertyTypes, effectOnUsagetFields });
    const settingsEvents = state.settings.get('events', Immutable.List());
    settingsEvents.forEach((events, eventType) => {
      if (!['settings'].includes(eventType) && (eventCategory === '' || eventCategory === eventType)) {
        const eventsWithId = events.map(event => convertFromApiToUi(event, eventType, params));
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
      const eventsWithId = events.map(event => convertFromUiToApi(event, eventType, params));
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
  const convertedEvent = convertFromUiToApi(event, eventCategory, params);
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

export const getEventRates = eventRatesKeys => dispatch =>
  dispatch(pushToList('event_products', getProductsByKeysQuery(eventRatesKeys.toArray(), { key: 1, rates: 1 })));

export const validateFieldEventCode = (value = '') => {
  if (value === '') {
    return 'Event Code is required';
  }
  return true;
};

export const validateFieldRecurrenceValue = (value = '') => {
  if (value === '') {
    return 'Field is required';
  }
  return true;
};

export const validateFieldDateRangeValue = (value = '') => {
  if (value === '') {
    return 'Field is required';
  }
  return true;
};

export const validateThresholdField = (value = Immutable.Map()) => {
  if (value.get('field', '') === '') {
    return 'Threshold field is required';
  }
  if (value.get('op', '') === '') {
    return 'Threshold Operator is required';
  }
  if (['', []].includes(value.get('value', '')) || Immutable.is(Immutable.List(), value.get('value', Immutable.List()))) {
    return 'Threshold value is required';
  }
  return true;
};

export const validateEvent = (item, eventType) => (dispatch) => {
  let isValid = true;
  const eventCodeValid = validateFieldEventCode(item.get('event_code', ''));
  if (eventCodeValid !== true) {
    isValid = false;
    dispatch(setFormModalError('event_code', eventCodeValid));
  }
  if (eventType === 'fraud') {
    const recurrenceValueValid = validateFieldRecurrenceValue(item.getIn(['recurrence', 'value'], ''));
    if (recurrenceValueValid !== true) {
      isValid = false;
      dispatch(setFormModalError('recurrence.value', recurrenceValueValid));
    }
    const dateRangeValueValueValid = validateFieldRecurrenceValue(item.getIn(['date_range', 'value'], ''));
    if (dateRangeValueValueValid !== true) {
      isValid = false;
      dispatch(setFormModalError('date_range.value', dateRangeValueValueValid));
    }
    const thresholdConditions = item.getIn(['threshold_conditions', 0], Immutable.List());
    if (thresholdConditions.isEmpty()) {
      isValid = false;
      dispatch(setFormModalError('threshold_condition.0', validateThresholdField()));
    } else {
      thresholdConditions.forEach((condition, idx) => {
        const thresholdField = validateThresholdField(condition);
        if (thresholdField !== true) {
          isValid = false;
          dispatch(setFormModalError(`threshold_condition.${idx}`, thresholdField));
        }
      });
    }
  }

  return isValid;
};
