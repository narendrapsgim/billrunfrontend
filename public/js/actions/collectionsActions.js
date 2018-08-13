import uuid from 'uuid';

import {
  saveSettings,
  getSettings,
  actions as settingsActions,
} from './settingsActions';

import { toImmutableList } from '../common/Util';

/* Collection Steps */
export const saveCollectionSteps = () => saveSettings(['collection.steps']);

export const getCollectionSteps = () => getSettings(['collection.steps']);

export const updateCollectionSteps = (path, value) => ({
  type: settingsActions.UPDATE_SETTING,
  category: 'collection',
  name: ['steps', ...toImmutableList(path)],
  value,
});

export const removeCollectionStep = index => ({
  type: settingsActions.REMOVE_SETTING_FIELD,
  category: 'collection',
  name: ['steps', index],
});

export const addCollectionSteps = value => ({
  type: settingsActions.PUSH_TO_SETTING,
  category: 'collection',
  path: 'steps',
  value: value.set('id', uuid.v4()),
});

/* Collection Settings */
export const saveCollectionSettings = () => saveSettings(['collection.settings']);

export const getCollectionSettings = () => getSettings(['collection.settings']);

export const updateCollectionSettings = (path, value) => ({
  type: settingsActions.UPDATE_SETTING,
  category: 'collection',
  name: ['settings', ...toImmutableList(path)],
  value,
});
