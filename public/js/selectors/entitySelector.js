import { createSelector } from 'reselect';
import { getConfig, isItemClosed, getItemId, getItemMode } from '../common/Util';


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
      return state.entity.get(entityName);
    case 'discount':
      return state.entity.get(entityName);
    default: {
      return state[entityName];
    }
  }
};

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

export const revisionsSelector = createSelector(
  getItem,
  getRevisions,
  getUniqueFiled,
  selectRevisions,
);

export const tabSelector = createSelector(
  getTab,
  tab => tab
);

export const itemSelector = createSelector(
  getItem,
  item => item
);

export const idSelector = createSelector(
  getId,
  id => id
);

export const modeSelector = createSelector(
  getAction,
  idSelector,
  itemSelector,
  selectFormMode,
);
