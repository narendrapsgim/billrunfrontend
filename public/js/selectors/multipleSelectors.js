/**
 * cross import is not possible : import A -> B, import B -> A.
 * This MultipleSelector can import multiple selectors files and combine them together.
 */

import { createSelector } from 'reselect';
import { compose } from 'redux';


import {
  itemSelector,
  selectorFieldsByEntity,
} from './entitySelector';
import {
  accountImportFieldsSelector,
  subscriberImportFieldsSelector,
  formatFieldOptions,
  addDefaultFieldOptions,
} from './settingsSelector';


export const importFieldsOptionsSelector = createSelector(
  itemSelector,
  accountImportFieldsSelector,
  subscriberImportFieldsSelector,
  (item, accountFields, subscriberImportFields) => compose(
    composedFields => (composedFields ? composedFields.toArray() : undefined),
    addDefaultFieldOptions,
    fieldsByEntity => formatFieldOptions(fieldsByEntity, item),
    selectorFieldsByEntity,
  )(item, accountFields, subscriberImportFields),
);
