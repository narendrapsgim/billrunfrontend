import { createSelector } from 'reselect';
import Immutable from 'immutable';
import { sentenceCase } from 'change-case';
import {
  getFieldName,
  getFieldNameType,
  getConfig,
  createRateListNameByArgs,
} from '../common/Util';
import {
  subscriberFieldsSelector,
  inputProssesorfilteredFieldsSelector,
  accountFieldsSelector,
  linesFieldsSelector,
  rateCategoriesSelector,
  usageTypeSelector,
  fileTypeSelector,
  eventCodeSelector,
} from './settingsSelector';
import {
  listByNameSelector,
  productsOptionsSelector,
  cyclesOptionsSelector,
  plansOptionsSelector,
  servicesOptionsSelector,
  groupsOptionsSelector,
  calcNameSelector,
  bucketsNamesSelector,
  bucketsExternalIdsSelector,
} from './listSelectors';


const sortFieldOption = (optionsA, optionB) => {
  const a = optionsA.get('title', '').toUpperCase(); // ignore upper and lowercase
  const b = optionB.get('title', '').toUpperCase(); // ignore upper and lowercase
  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }
  return 0;
};

const getReportEntityConfigFields = type => getConfig(['reports', 'fields', type], Immutable.List());

const getReportEntities = () => getConfig(['reports', 'entities'], Immutable.List());

const formatReportFields = (fields) => {
  if (!fields) {
    return undefined;
  }
  return fields.map(field => Immutable.Map({
    id: field.get('field_name', ''),
    title: field.get('title', ''),
    type: field.get('type', 'string'),
    aggregatable: true,
    searchable: field.get('searchable', true),
    inputConfig: field.get('inputConfig', null),
  }));
};

const selectReportLinesFields = (customKeys = Immutable.List(), billrunFields = Immutable.List(), categoryFields = Immutable.List()) =>
  Immutable.List().withMutations((optionsWithMutations) => {
    // set fields from IP
    customKeys.forEach((customKey) => {
      const fieldName = getFieldName(customKey, 'lines');
      optionsWithMutations.push(Immutable.Map({
        field_name: `uf.${customKey}`,
        title: (fieldName === customKey) ? sentenceCase(fieldName) : fieldName,
      }));
    });
    categoryFields.forEach((customKey) => {
      const fieldLabel = getFieldName(customKey, 'lines', sentenceCase(customKey));
      const chargeLabel = getFieldName('charge‎', 'lines', sentenceCase('charge‎'));
      const productKeyLabel = getFieldName('product_key', 'lines', sentenceCase('product_key'));
      const fieldsPreffix = `rates.tariff_category.${customKey}`;
      optionsWithMutations.push(Immutable.Map({
        field_name: `${fieldsPreffix}.pricing.charge`,
        title: `${fieldLabel} ${chargeLabel}`,
        type: 'number',
      }));
      optionsWithMutations.push(Immutable.Map({
        field_name: `${fieldsPreffix}.key`,
        title: `${fieldLabel} ${productKeyLabel}`,
        inputConfig: Immutable.Map({
          inputType: 'select',
          callback: 'getProductsOptions',
          callbackArgument: Immutable.Map({ tariff_category: customKey }),
        }),
      }));
    });

    // Set fields from billrun settings
    billrunFields.forEach((billrunField) => {
      optionsWithMutations.push(billrunField);
    });
  });

const concatJoinFields = (fields, joinFields = Immutable.Map(), excludeFields = Immutable.Map()) =>
((!fields)
  ? Immutable.List()
  : fields
  .filter(field => !excludeFields.get('currentEntity', Immutable.List()).includes(field.get('id', '')))
  .withMutations((fieldsWithMutations) => {
    joinFields.forEach((entityfields, entity) => {
      const entityLabel = sentenceCase(getConfig(['systemItems', entity, 'itemName'], entity));
      if (!entityfields.isEmpty()) {
        entityfields.forEach((entityfield) => {
          if (!excludeFields.get(entity, Immutable.List()).includes(entityfield.get('id', ''))) {
            const joinId = `$${entity}.${entityfield.get('id', '')}`;
            const joinTitle = `${entityLabel}: ${entityfield.get('title', entityfield.get('id', ''))}`;
            const joinField = entityfield.withMutations(field => field
              .set('id', joinId)
              .set('title', joinTitle)
              .set('entity', entity),
            );
            fieldsWithMutations.push(joinField);
          }
        });
      }
    });
  })
);

const mergeEntityAndReportConfigFields = (billrunConfigFields, type) => {
  const entityFields = (type === 'queue') ? billrunConfigFields : formatReportFields(billrunConfigFields);
  const defaultField = Immutable.Map({
    searchable: true,
    aggregatable: true,
  });
  return Immutable.List().withMutations((fieldsWithMutations) => {
    // Push all fields from Billrun config
    entityFields.forEach((entityField) => {
      fieldsWithMutations.push(entityField);
    });
    // Push report config fields or overide if exist
    getReportEntityConfigFields(type).forEach((predefinedFiled) => {
      const index = fieldsWithMutations.findIndex(field => field.get('id', '') === predefinedFiled.get('id', ''));
      if (index === -1) {
        fieldsWithMutations.push(defaultField.merge(predefinedFiled));
      } else {
        fieldsWithMutations.update(index, Immutable.Map(), field => field.merge(predefinedFiled));
      }
    });
    // Set title if not exist
    fieldsWithMutations.forEach((field, index) => {
      if (!field.has('title')) {
        const configTitle = getFieldName(field.get('id', ''), getFieldNameType(type));
        const title = configTitle === field.get('id', '') ? sentenceCase(configTitle) : configTitle;
        fieldsWithMutations.setIn([index, 'title'], title);
      }
    });
  })
  .sort(sortFieldOption);
};

const selectReportFields = (subscriberFields, accountFields, linesFileds, logFileFields, queueFields, eventFields, billsFields) => {
  // usage: linesFileds,
  // duplicate fields list by join (same fields from different collections)
  // that will be removed frm UI.
  const usageExcludeIds = Immutable.Map({
    subscription: Immutable.List(['sid', 'aid']),
    customer: Immutable.List(['aid']),
    currentEntity: Immutable.List(['firstname', 'lastname']),
  });
  const usage = concatJoinFields(linesFileds, Immutable.Map({
    subscription: subscriberFields,
    customer: accountFields,
  }), usageExcludeIds);

  // const subscription = subscriberFields;
  const subscriptionExcludeIds = Immutable.Map({
    customer: Immutable.List(['aid', 'type']),
    usage: Immutable.List(['firstname', 'lastname', 'sid', 'aid', 'plan']),
    currentEntity: Immutable.List([]),
  });
  const subscription = concatJoinFields(subscriberFields, Immutable.Map({
    customer: accountFields,
    usage: linesFileds,
  }), subscriptionExcludeIds);

  const customer = accountFields; // without collections join (one -> many still not possible on BE)
  // const customerExcludeIds = Immutable.Map({
  //   subscription: Immutable.List(['sid', 'type']),
  //   usage: Immutable.List(['firstname', 'lastname', 'sid', 'sid', 'plan']),
  //   currentEntity: Immutable.List([]),
  // });
  // const customer = concatJoinFields(accountFields, Immutable.Map({
  //   subscription: subscriberFields,
  //   usage: linesFileds,
  // }), customerExcludeIds);

  const logFile = logFileFields;
  const queue = queueFields;
  const event = eventFields;
  const bills = billsFields;
  return Immutable.Map({ usage, subscription, customer, logFile, queue, event, bills });
};

const reportLinesFieldsSelector = createSelector(
  inputProssesorfilteredFieldsSelector,
  linesFieldsSelector,
  rateCategoriesSelector,
  selectReportLinesFields,
);

const reportSubscriberFieldsSelector = createSelector(
  subscriberFieldsSelector,
  () => 'subscribers',
  mergeEntityAndReportConfigFields,
);

const reportAccountFieldsSelector = createSelector(
  accountFieldsSelector,
  () => 'account',
  mergeEntityAndReportConfigFields,
);

const reportlogFileFieldsSelector = createSelector(
  () => Immutable.List(),
  () => 'logFile',
  mergeEntityAndReportConfigFields,
);

const reportEventFileFieldsSelector = createSelector(
  () => Immutable.List(),
  () => 'event',
  mergeEntityAndReportConfigFields,
);

export const reportUsageFieldsSelector = createSelector(
  reportLinesFieldsSelector,
  () => 'usage',
  mergeEntityAndReportConfigFields,
);

const reportQueueFieldsSelector = createSelector(
  reportUsageFieldsSelector,
  () => 'queue',
  mergeEntityAndReportConfigFields,
);

const reportBillsSelector = createSelector(
  () => Immutable.List(),
  () => 'bills',
  mergeEntityAndReportConfigFields,
);

export const reportEntitiesSelector = createSelector(
  getReportEntities,
  entities => entities,
);

export const reportEntitiesFieldsSelector = createSelector(
  reportSubscriberFieldsSelector,
  reportAccountFieldsSelector,
  reportUsageFieldsSelector,
  reportlogFileFieldsSelector,
  reportQueueFieldsSelector,
  reportEventFileFieldsSelector,
  reportBillsSelector,
  selectReportFields,
);

const getOptionCallback = (state, props) => {
  const callback = props.config.getIn(['inputConfig', 'callback']);
  switch (callback) {
    case 'getCyclesOptions': return cyclesOptionsSelector(state, props);
    case 'getProductsOptions': {
      const callbackArgument = props.config.getIn(['inputConfig', 'callbackArgument'], Immutable.Map());
      if (!callbackArgument.isEmpty()) {
        const listName = createRateListNameByArgs(callbackArgument);
        return listByNameSelector(state, props, listName);
      }
      return productsOptionsSelector(state, props);
    }
    case 'getPlansOptions': return plansOptionsSelector(state, props);
    case 'getServicesOptions': return servicesOptionsSelector(state, props);
    case 'getGroupsOptions': return groupsOptionsSelector(state, props);
    case 'getUsageTypesOptions': return usageTypeSelector(state, props);
    case 'getBucketsOptions': return bucketsNamesSelector(state, props);
    case 'getBucketsExternalIdsOptions': return bucketsExternalIdsSelector(state, props);
    case 'getFileTypeOptions': return fileTypeSelector(state, props);
    case 'getCalcNameOptions': return calcNameSelector(state, props);
    case 'getEventCodeOptions': return eventCodeSelector(state, props);
    default: return undefined;
  }
};

export const selectOptionSelector = createSelector(
  getOptionCallback,
  options => options,
);
