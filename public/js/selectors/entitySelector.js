import { createSelector } from 'reselect';
import moment from 'moment';

const getUniqueFiled = (state, props, itemType) => {
  switch (itemType) {
    case 'product':
      return 'key';
    default:
      return 'name';
  }
};

const getRevisions = (state, props, itemType) => {
  switch (itemType) {
    default:
      const itemsType = `${itemType}s`;
      return state.entityList.revisions.get(itemsType);
  }
};

const getTab = (state, props, itemType) => { // eslint-disable-line no-unused-vars
  if (props.location && props.location.query) {
    return props.location.query.tab || undefined;
  }
  return undefined;
};

const getAction = (state, props, itemType) => { // eslint-disable-line no-unused-vars
  if (props.location && props.location.query && props.location.query.action) {
    return props.location.query.action.length > 0 ? props.location.query.action : null;
  }
  return null;
};

const getId = (state, props, itemType) => { // eslint-disable-line no-unused-vars
  if (props.params && props.params.itemId) {
    return props.params.itemId.length > 0 ? props.params.itemId : null;
  }
  return null;
};

const getItem = (state, props, itemType) => state[itemType];

const selectRevisions = (item, allRevisions, uniqueFiled) => {
  if (allRevisions && item && item.getIn(['_id', '$id'], false)) {
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
  if (item && item.getIn(['_id', '$id'], false)) {
    const from = moment.unix(item.getIn(['from', 'sec'], 0));
    const to = moment.unix(item.getIn(['to', 'sec'], 0));
    if (to.isBefore(moment())) {
      return 'view';
    }
    if (from.isAfter(moment())) {
      return 'update';
    }
    return 'closeandnew';
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
