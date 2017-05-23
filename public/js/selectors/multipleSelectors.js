/**
 * cross import is not possible : import A -> B, import B -> A.
 * This MultipleSelector can import multiple selectors files and combine them together.
 */

import { createSelector } from 'reselect';
import Immutable from 'immutable';
import { itemSelector } from './entitySelector';
import { accountFieldsSelector, subscriberFieldsSelector, formatFieldOptions } from './settingsSelector';


const selectorFieldsByEntity = (item = Immutable.Map(), accountFields, subscriberFields) => {
  switch (item.get('entity')) {
    case 'customer':
      return accountFields;
    case 'subscription':
      return subscriberFields;
    default:
      return undefined;
  }
};

export const importFieldsSelector = createSelector(
  itemSelector,
  accountFieldsSelector,
  subscriberFieldsSelector,
  selectorFieldsByEntity,
);


export const importFieldsOptionsSelector = createSelector(
  importFieldsSelector,
  itemSelector,
  formatFieldOptions,
);
