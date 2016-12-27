import { saveSettings, getSettings,
  UPDATE_SETTING, REMOVE_SETTING_FIELD, PUSH_TO_SETTING } from './settingsActions';

export const UPDATE_COLLECTION = 'UPDATE_COLLECTION';
export const CLEAR_COLLECTION = 'CLEAR_COLLECTION';
export const RESET_COLLECTION_EDITED = 'RESET_COLLECTION_EDITED';
export const SET_COLLECTION_EDITED = 'SET_COLLECTION_EDITED';

export function resetCollectionEdited() {
  return {
    type: RESET_COLLECTION_EDITED,
  };
}
export function setCollectionEdited() {
  return {
    type: SET_COLLECTION_EDITED,
  };
}

export function saveCollection(subCategories = 'steps') {
  const saveCategories = Array.isArray(subCategories)
    ? subCategories.map(subCategorie => `collection.${subCategorie}`)
    : [`collection.${subCategories}`];
  return saveSettings(saveCategories);
}

export function getCollection(subCategories = 'steps') {
  const getCategories = Array.isArray(subCategories)
    ? subCategories.map(subCategorie => `collection.${subCategorie}`)
    : [`collection.${subCategories}`];
  return getSettings(getCategories);
}

export function updateCollectionSteps(path, value) {
  return {
    type: UPDATE_SETTING,
    category: 'collection',
    name: ['steps', ...path],
    value,
  };
}

export function updateCollectionSettings(path, value) {
  const pathArray = Array.isArray(path) ? path : [path];
  return {
    type: UPDATE_SETTING,
    category: 'collection',
    name: [...pathArray],
    value,
  };
}

export function removeCollectionStep(index) {
  return {
    type: REMOVE_SETTING_FIELD,
    category: 'collection',
    name: ['steps', index],
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
    path: 'steps',
  };
}
