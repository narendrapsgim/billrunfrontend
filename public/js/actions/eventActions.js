import { updateSetting } from './settingsActions';
import { getEventConvertedConditions } from '../components/Events/EventsUtil';
import {
  usageTypesDataSelector,
  propertyTypeSelector,
} from '../selectors/settingsSelector';

export const saveEvent = (entityType, index, event) => (dispatch, getState) => { // eslint-disable-line import/prefer-default-export
  const state = getState();
  const usageTypesData = usageTypesDataSelector(state);
  const propertyTypes = propertyTypeSelector(state);
  const convertedEvent = event.withMutations((eventWithMutations) => {
    eventWithMutations.set('conditions', getEventConvertedConditions(propertyTypes, usageTypesData, event, true));
  });
  return dispatch(updateSetting('events', [entityType, index], convertedEvent));
};
