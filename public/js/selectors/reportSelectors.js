import { createSelector } from 'reselect';
import Immutable from 'immutable';
import { sentenceCase } from 'change-case';
import {
  getFieldName,
  getFieldNameType,
  getConfig,
} from '../common/Util';
import {
  subscriberFieldsSelector,
  inputProssesorCustomKeysSelector,
  accountFieldsSelector,
} from './settingsSelector';


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
    aggregatable: true,
    searchable: field.get('searchable', true),
  }));
};

const selectReportLinesFields = customKeys =>
  Immutable.List().withMutations((optionsWithMutations) => {
    customKeys.forEach((customKey) => {
      const fieldName = getFieldName(customKey, 'lines');
      optionsWithMutations.push(Immutable.Map({
        field_name: `uf.${customKey}`,
        title: (fieldName === customKey) ? sentenceCase(fieldName) : fieldName,
      }));
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

const selectReportFields = (subscriberFields, accountFields, linesFileds, logFileFields, queueFields, eventFields) => {
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
  return Immutable.Map({ usage, subscription, customer, logFile, queue, event });
};

const reportLinesFieldsSelector = createSelector(
  inputProssesorCustomKeysSelector,
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
  selectReportFields,
);
