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

const concatJoinFields = (fields, joinFields = Immutable.Map(), excludeFields = Immutable.Map()) =>
((!fields)
  ? Immutable.List()
  : fields
  .filter(field => !excludeFields.get('base', Immutable.List()).includes(field.get('id', '')))
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

const getReportConfigFields = type => getConfig(['reports', 'fields', type], Immutable.List());

const getReportEntities = () => getConfig(['reports', 'entities'], Immutable.List());

const mergeEntityAndReportConfigFields = (reportConfigFields, billrunConfigFields, type) => {
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
    reportConfigFields.forEach((predefinedFiled) => {
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

const selectReportLinesFields = (customKeys) => {
  const predefinedFileds = getConfig(['reports', 'fields', 'usage'], Immutable.List());
  return Immutable.List().withMutations((optionsWithMutations) => {
    // Set predefined fields
    predefinedFileds.forEach((predefinedFiled) => {
      if (predefinedFiled.has('title')) {
        optionsWithMutations.push(predefinedFiled);
      } else {
        const fieldName = getFieldName(predefinedFiled.get('id', ''), 'lines');
        const title = fieldName === predefinedFiled.get('id', '') ? sentenceCase(fieldName) : fieldName;
        optionsWithMutations.push(predefinedFiled.set('title', title));
      }
    });
    // Set custom fields
    customKeys.forEach((customKey) => {
      if (predefinedFileds.findIndex(predefinedFiled => predefinedFiled.get('id', '') === customKey) === -1) {
        const fieldName = getFieldName(customKey, 'lines');
        const title = fieldName === customKey ? sentenceCase(fieldName) : fieldName;
        optionsWithMutations.push(Immutable.Map({
          id: `uf.${customKey}`,
          title: `${title}`,
          searchable: true,
          aggregatable: true,
        }));
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
    base: Immutable.List(['firstname', 'lastname']),
  });
  const usage = concatJoinFields(linesFileds, Immutable.Map({
    subscription: subscriberFields,
    customer: accountFields,
  }), usageExcludeIds);

  // const subscription = subscriberFields;
  const subscriptionExcludeIds = Immutable.Map({
    customer: Immutable.List(['aid', 'type']),
    usage: Immutable.List(['firstname', 'lastname', 'sid', 'aid', 'plan']),
    base: Immutable.List([]),
  });
  const subscription = concatJoinFields(subscriberFields, Immutable.Map({
    customer: accountFields,
    usage: linesFileds,
  }), subscriptionExcludeIds);

  const customer = accountFields; // without collections join (one -> many still not possible on BE)
  // const customerExcludeIds = Immutable.Map({
  //   subscription: Immutable.List(['sid', 'type']),
  //   usage: Immutable.List(['firstname', 'lastname', 'sid', 'sid', 'plan']),
  //   base: Immutable.List([]),
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

const reportSubscriberFieldsSelector = createSelector(
  () => getReportConfigFields('subscribers'),
  subscriberFieldsSelector,
  () => 'subscribers',
  mergeEntityAndReportConfigFields,
);

const reportAccountFieldsSelector = createSelector(
  () => getReportConfigFields('account'),
  accountFieldsSelector,
  () => 'account',
  mergeEntityAndReportConfigFields,
);

const reportlogFileFieldsSelector = createSelector(
  () => getReportConfigFields('logFile'),
  () => Immutable.List(),
  () => 'logFile',
  mergeEntityAndReportConfigFields,
);

const reportEventFileFieldsSelector = createSelector(
  () => getReportConfigFields('event'),
  () => Immutable.List(),
  () => 'event',
  mergeEntityAndReportConfigFields,
);

const reportLinesFieldsSelector = createSelector(
  inputProssesorCustomKeysSelector,
  selectReportLinesFields,
);

const reportQueueFieldsSelector = createSelector(
  () => getReportConfigFields('queue'),
  reportLinesFieldsSelector,
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
  reportLinesFieldsSelector,
  reportlogFileFieldsSelector,
  reportQueueFieldsSelector,
  reportEventFileFieldsSelector,
  selectReportFields,
);
