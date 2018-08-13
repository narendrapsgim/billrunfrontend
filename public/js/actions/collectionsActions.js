import uuid from 'uuid';
import { collectionStepsSelector } from '../selectors/settingsSelector';
import {
  saveSettings,
  getSettings,
  actions as settingsActions,
} from './settingsActions';

import { toImmutableList } from '../common/Util';

/* Collection Steps */
const updateCollectionSteps = (path, value) => ({
  type: settingsActions.UPDATE_SETTING,
  category: 'collection',
  name: ['steps', ...toImmutableList(path)],
  value,
});

const removeCollectionStepByIndex = index => ({
  type: settingsActions.REMOVE_SETTING_FIELD,
  category: 'collection',
  name: ['steps', index],
});

const addCollectionSteps = value => ({
  type: settingsActions.PUSH_TO_SETTING,
  category: 'collection',
  path: 'steps',
  value,
});

export const saveCollectionSteps = () => saveSettings(['collection.steps']);

export const getCollectionSteps = () => getSettings(['collection.steps']);

export const removeCollectionStep = editedItem => (dispatch, getState) => {
  const steps = collectionStepsSelector(getState());
  const index = steps.findIndex(step => step.get('id', '') === editedItem.get('id', ''));
  if (index !== -1) {
    return dispatch(removeCollectionStepByIndex(index));
  }
  return false;
};

export const saveCollectionStep = step => (dispatch, getState) => {
  if (!step.has('id')) {
    return dispatch(addCollectionSteps(step.set('id', uuid.v4())));
  }
  const existingSteps = collectionStepsSelector(getState());
  const index = existingSteps.findIndex(existingStep => existingStep.get('id', '') === step.get('id', ''));
  if (index !== -1) {
    return dispatch(updateCollectionSteps(index, step));
  }
  return false;
};

/* Collection Settings */
export const saveCollectionSettings = () => saveSettings(['collection.settings']);

export const getCollectionSettings = () => getSettings(['collection.settings']);

export const updateCollectionSettings = (path, value) => ({
  type: settingsActions.UPDATE_SETTING,
  category: 'collection',
  name: ['settings', ...toImmutableList(path)],
  value,
});
