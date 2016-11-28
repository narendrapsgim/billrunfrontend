import { saveSettings, UPDATE_SETTING, REMOVE_SETTING_FIELD, PUSH_TO_SETTING } from './settingsActions';

export const UPDATE_COLLECTION = 'UPDATE_COLLECTION';
export const CLEAR_COLLECTION = 'CLEAR_COLLECTION';

export function saveCollection() {
  return saveSettings(['collection']);
}

export function updateCollection(path, value) {
  return {
    type: UPDATE_SETTING,
    category: 'collection',
    name: path,
    value,
  };
}

export function removeCollection(index) {
  return {
    type: REMOVE_SETTING_FIELD,
    category: 'collection',
    name: index,
  };
}

export function updateNewCollection(path, value) {
  return {
    type: UPDATE_COLLECTION,
    path,
    value,
  };
}

export function clearNewCollection() {
  return {
    type: CLEAR_COLLECTION,
  };
}

export function pushNewCollection(value) {
  return {
    type: PUSH_TO_SETTING,
    category: 'collection',
    value,
  };
}
