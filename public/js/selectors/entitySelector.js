import { createSelector } from 'reselect';
import { getConfig, getItemId, getItemMode, getItemMinFromDate } from '../common/Util';
import { minEntityDateSelector } from './settingsSelector';


const getPropsItem = (state, props) => props.item;

const getUniqueFiled = (state, props, entityName) =>
  getConfig(['systemItems', entityName, 'uniqueField'], 'name');

const getRevisions = (state, props, entityName) => {
  const entityCollectin = getConfig(['systemItems', entityName, 'collection'], '');
  return state.entityList.revisions.get(entityCollectin);
};

const getTab = (state, props) => {
  if (props.location && props.location.query && typeof props.location.query.tab !== 'undefined') {
    return parseInt(props.location.query.tab) || undefined;
  }
  return undefined;
};

const getMessage = (state, props) => {
  if (props.location && props.location.query && typeof props.location.query.message !== 'undefined') {
    return props.location.query.message;
  }
  return undefined;
};

const getAction = (state, props) => {
  if (props.location && props.location.query && props.location.query.action) {
    return props.location.query.action.length > 0 ? props.location.query.action : null;
  }
  return null;
};

const getId = (state, props) => {
  if (props.params && props.params.itemId) {
    return props.params.itemId.length > 0 ? props.params.itemId : null;
  }
  return null;
};

const getItem = (state, props, entityName) => {
  switch (entityName) {
    case 'prepaid_include':
    case 'customer':
    case 'subscription':
    case 'discount':
    case 'reports':
    case 'importer':
      return state.entity.get(entityName);
    case 'charging_plan':
      return state.plan;
    default: {
      return state[entityName];
    }
  }
};

const selectMaxFrom = (item = null, minDate = null) => getItemMinFromDate(item, minDate);

const selectRevisions = (item, allRevisions, uniqueFiled) => {
  if (allRevisions && getItemId(item, false)) {
    return allRevisions.get(item.get(uniqueFiled, ''));
  }
  return undefined;
};

const selectFormMode = (action, id, item) => {
  if (action) {
    return action;
  }
  if (!id) {
    return 'create';
  }

  if (getItemId(item, false)) {
    return getItemMode(item);
  }
  return 'loading';
};

const selectSimpleMode = (action, id, item) => {
  if (action) {
    return action;
  }
  if (!id) {
    return 'create';
  }

  if (getItemId(item, false)) {
    return 'update';
  }
  return 'loading';
};

export const revisionsSelector = createSelector(
  getItem,
  getRevisions,
  getUniqueFiled,
  selectRevisions,
);

export const tabSelector = createSelector(
  getTab,
  tab => tab,
);

export const messageSelector = createSelector(
  getMessage,
  (message) => {
    if (message) {
      try {
        return JSON.parse(message);
      } catch (e) {
        return undefined;
      }
    }
    return undefined;
  },
);

export const itemSelector = createSelector(
  getItem,
  item => item,
);

export const idSelector = createSelector(
  getId,
  id => id,
);

export const modeSelector = createSelector(
  getAction,
  idSelector,
  itemSelector,
  selectFormMode,
);

export const modeSimpleSelector = createSelector(
  getAction,
  idSelector,
  itemSelector,
  selectSimpleMode,
);

export const entityMinFrom = createSelector(
  getPropsItem,
  minEntityDateSelector,
  selectMaxFrom,
);
