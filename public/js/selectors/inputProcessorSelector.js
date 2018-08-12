import { createSelector } from 'reselect';
import Immutable from 'immutable';

const getCheckedFields = state => state.inputProcessor.get('fields', Immutable.List());

const getAllFields = state => state.inputProcessor.get('unfiltered_fields', Immutable.List());

const selectAllChecked = (checkedFields, allFields) => checkedFields.size === allFields.size;

export const allCheckedSelector = createSelector(
  getCheckedFields,
  getAllFields,
  selectAllChecked,
);
