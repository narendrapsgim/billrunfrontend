import { createSelector } from 'reselect';
import Immutable from 'immutable';
import moment from 'moment';
import { sentenceCase } from 'change-case';
import {
  getFieldName,
  getFieldNameType,
  getConfig,
  isLinkerField,
} from '../common/Util';
import { getEventConvertedConditions } from '../components/Events/EventsUtil';

const getTaxation = (state, props) => // eslint-disable-line no-unused-vars
  state.settings.getIn(['taxation']);

const getPricing = (state, props) => // eslint-disable-line no-unused-vars
  state.settings.getIn(['pricing']);

const getUsageType = (state, props) => // eslint-disable-line no-unused-vars
  state.settings.get('usage_types');

const getEventCode = (state, props) => // eslint-disable-line no-unused-vars
  state.settings.getIn(['events', 'balance']);

const getPropertyTypes = (state, props) => // eslint-disable-line no-unused-vars
  state.settings.get('property_types');

const getBillrun = (state, props) => // eslint-disable-line no-unused-vars
  state.settings.get('billrun');

const getEntityFields = (state, props) => {
  const entityName = Array.isArray(props.entityName) ? props.entityName : [props.entityName];
  return state.settings.getIn([...entityName, 'fields']);
};

const getMinEntityDate = (state, props) => // eslint-disable-line no-unused-vars
  state.settings.get('minimum_entity_start_date');

const getAccountFields = (state, props) => // eslint-disable-line no-unused-vars
  state.settings.getIn(['subscribers', 'account', 'fields']);

const getSubscriberFields = (state, props) => // eslint-disable-line no-unused-vars
  state.settings.getIn(['subscribers', 'subscriber', 'fields']);

const getLinesFields = (state, props) => // eslint-disable-line no-unused-vars
  state.settings.getIn(['lines', 'fields']);

const getProductFields = (state, props) => // eslint-disable-line no-unused-vars
    state.settings.getIn(['rates', 'fields']);

const getInvoiceExport = (state, props) => // eslint-disable-line no-unused-vars
    state.settings.get('invoice_export');

const getEvents = (state, props) => // eslint-disable-line no-unused-vars
    state.settings.getIn(['events']);

const selectSubscriberImportFields = (fields, accountfields) => {
  if (fields) {
    const importLinkers = accountfields.filter(isLinkerField);
    if (importLinkers.size > 0) {
      return fields.withMutations((fieldsWithMutations) => {
        importLinkers.forEach((importLinker) => {
          fieldsWithMutations.push(Immutable.Map({
            linker: true,
            field_name: importLinker.get('field_name', 'linker'),
            title: importLinker.get('title', importLinker.get('field_name', 'linker')),
          }));
        });
      });
    }
    return fields.push(Immutable.Map({
      linker: true,
      field_name: 'account_import_id',
      title: 'Customer Import ID',
    }));
  }
  return fields;
};

const selectAccountImportFields = (fields) => {
  if (fields) {
    const existImportLinker = fields.findIndex(isLinkerField);
    return (existImportLinker !== -1)
      ? fields
      : fields.push(Immutable.Map({
        unique: true,
        generated: false,
        mandatory: true,
        field_name: 'account_import_id',
        title: 'Customer Import ID (for subscriber import)',
      }));
  }
  return fields;
};

const getUniqueUsageTypesFormInputProssesors = (inputProssesor) => {
  let usageTypes = Immutable.Set();
  const defaultUsaget = inputProssesor.getIn(['processor', 'default_usaget'], '');
  if (defaultUsaget !== '') {
    usageTypes = usageTypes.add(defaultUsaget);
  }
  inputProssesor
    .getIn(['processor', 'usaget_mapping'], Immutable.List())
    .forEach((usagetMapping) => {
      const usaget = usagetMapping.get('usaget', '');
      if (usaget !== '') {
        usageTypes = usageTypes.add(usaget);
      }
    });
  return usageTypes.toList();
};

const getInputProssesors = (state, props) =>  // eslint-disable-line no-unused-vars
  state.settings.get('file_types', Immutable.Map());

const selectCsiOptions = (inputProssesors) => {
  let options = Immutable.List();
  inputProssesors.forEach((inputProssesor) => {
    const usageTypes = getUniqueUsageTypesFormInputProssesors(inputProssesor);
    const customKeys = inputProssesor.getIn(['parser', 'custom_keys'], Immutable.List());
    usageTypes.forEach((usageType) => {
      options = options.push(Immutable.Map({
        fileType: inputProssesor.get('file_type', ''),
        usageType,
        customKeys,
      }));
    });
  });
  return options;
};

const selectCustomKeys = (inputProssesors) => {
  let options = Immutable.Set();
  inputProssesors.forEach((inputProssesor) => {
    const customKeys = inputProssesor.getIn(['parser', 'custom_keys'], Immutable.List());
    options = options.concat(customKeys);
  });
  return options.toList();
};

const selectRatingParams = (inputProssesors) => {
  let options = Immutable.Set();
  inputProssesors.forEach((inputProssesor) => {
    const ratingCalculators = inputProssesor.get('rate_calculators', Immutable.Map());
    ratingCalculators.forEach((ratingCalculatorsPriority) => {
      ratingCalculatorsPriority.forEach((fields) => {
        const currentFields = fields
        .filter(field => field.get('rate_key', '').startsWith('params.'))
        .map(field => field.get('rate_key', ''));
        options = options.concat(currentFields);
      });
    });
  });
  return options.toList();
};

const selectUsageTypes = (usageTypes) => {
  if (!usageTypes) {
    return undefined;
  }
  return usageTypes.map(usageType => usageType.get('usage_type', ''));
};

const selectEventCode = (events) => {
  if (!events) {
    return undefined;
  }
  return events.map(event => event.get('event_code', ''));
};

const selectFileType = (fileTypes) => {
  if (!fileTypes) {
    return undefined;
  }
  return fileTypes.map(fileType => fileType.get('file_type', ''));
};

export const inputProssesorCsiOptionsSelector = createSelector(
  getInputProssesors,
  selectCsiOptions,
);

export const inputProssesorCustomKeysSelector = createSelector(
  getInputProssesors,
  selectCustomKeys,
);

export const inputProssesorRatingParamsSelector = createSelector(
  getInputProssesors,
  selectRatingParams,
);

export const taxationSelector = createSelector(
  getTaxation,
  taxation => taxation,
);

export const taxationTypeSelector = createSelector(
  taxationSelector,
  (taxation = Immutable.Map()) => taxation.get('tax_type'),
);

export const pricingSelector = createSelector(
  getPricing,
  pricing => pricing,
);

export const billrunSelector = createSelector(
  getBillrun,
  billrun => billrun,
);

export const minEntityDateSelector = createSelector(
  getMinEntityDate,
  minEntityDate => (minEntityDate && !isNaN(minEntityDate) ? moment.unix(minEntityDate) : moment(0)),
);

export const currencySelector = createSelector(
  pricingSelector,
  (pricing = Immutable.Map()) => pricing.get('currency'),
);

export const chargingDaySelector = createSelector(
  billrunSelector,
  (billrun = Immutable.Map()) => {
    const chargingDay = billrun.get('charging_day');
    return (isNaN(chargingDay)) ? chargingDay : Number(chargingDay);
  },
);

export const fileTypeSelector = createSelector(
  getInputProssesors,
  selectFileType,
);

export const usageTypeSelector = createSelector(
  getUsageType,
  selectUsageTypes,
);

export const eventCodeSelector = createSelector(
  getEventCode,
  selectEventCode,
);

export const usageTypesDataSelector = createSelector(
  getUsageType,
  usageTypes => usageTypes,
);

export const propertyTypeSelector = createSelector(
  getPropertyTypes,
  propertyTypes => propertyTypes,
);

export const entityFieldSelector = createSelector(
  getEntityFields,
  fields => fields,
);

export const accountFieldsSelector = createSelector(
  getAccountFields,
  (fields) => {
    if (fields) {
      return fields.map(field => (
        field.get('title', '') !== ''
        ? field
        : field.set('title', getFieldName(field.get('field_name', ''), 'account'))
      ));
    }
    return undefined;
  },
);

export const accountImportFieldsSelector = createSelector(
  accountFieldsSelector,
  selectAccountImportFields,
);

export const subscriberFieldsSelector = createSelector(
  getSubscriberFields,
  (fields) => {
    if (fields) {
      return fields.map(field => (
        field.get('title', '') !== ''
        ? field
        : field.set('title', getFieldName(field.get('field_name', ''), 'subscription'))
      ));
    }
    return undefined;
  },
);

export const linesFieldsSelector = createSelector(
  getLinesFields,
  (fields) => {
    if (fields) {
      return fields.map((field) => {
        if (field.get('title', '') !== '') {
          return field;
        }
        if (field.has('foreign')) {
          const x = getFieldName(field.getIn(['foreign', 'field'], ''));
          const y = getFieldNameType(field.getIn(['foreign', 'entity'], ''));
          console.log(x, " - ", y);
          return field.set('title', getFieldName(field.getIn(['foreign', 'field'], ''), getFieldNameType(field.getIn(['foreign', 'entity'], ''))));
        }
        return field.set('title', getFieldName(field.get('field_name', ''), 'lines'));
      });
    }
    return undefined;
  },
);

export const subscriberImportFieldsSelector = createSelector(
  subscriberFieldsSelector,
  accountImportFieldsSelector,
  selectSubscriberImportFields,
);

export const productFieldsSelector = createSelector(
  getProductFields,
  productFields => productFields,
);

const selectEvents = (events, usageTypesData, propertyTypes) => {
  if (!events) {
    return undefined;
  }
  return events
    .filter((event, eventType) => eventType !== 'settings')
    .map(eventsList =>
      eventsList.map(event =>
        event.set('conditions', getEventConvertedConditions(propertyTypes, usageTypesData, event, false)),
      ),
    );
};

export const eventsSettingsSelector = createSelector(
  getEvents,
  events => (events ? events.get('settings', Immutable.Map()) : undefined),
);

export const eventsSelector = createSelector(
  getEvents,
  usageTypesDataSelector,
  propertyTypeSelector,
  selectEvents,
);

export const formatFieldOptions = (fields, item = Immutable.Map()) => {
  const type = getFieldNameType(item.get('entity', ''));
  if (fields) {
    return fields.map(field => ({
      value: field.get('field_name', ''),
      label: field.get('title', getFieldName(field.get('field_name', ''), type)),
      editable: field.get('editable', true),
      generated: field.get('generated', false),
      unique: field.get('unique', false),
      mandatory: field.get('mandatory', false),
      linker: field.get('linker', false),
    }));
  }
  return undefined;
};

export const addDefaultFieldOptions = (formatedFields, item = Immutable.Map()) => {
  if (formatedFields) {
    const entity = item.get('entity', '');
    const defaultFieldsByEntity = {
      subscription: [{
        value: 'from',
        label: 'From',
        editable: true,
        generated: false,
        unique: false,
        mandatory: true,
      }, {
        value: 'to',
        label: 'To',
        editable: true,
        generated: false,
        unique: false,
        mandatory: true,
      }],
    };
    return formatedFields.withMutations((fieldsWithMutations) => {
      const defaultFields = defaultFieldsByEntity[entity] || [];
      defaultFields
        .filter(defaultField =>
          formatedFields.findIndex(field => field.value === defaultField.value) === -1)
        .forEach((defaultField) => {
          fieldsWithMutations.push(defaultField);
        });
    });
  }
  return undefined;
};

export const invoiceTemplateHeaderSelector = createSelector(
  getInvoiceExport,
  (invoiceExport = Immutable.Map()) => invoiceExport.get('header'),
);
export const invoiceTemplateFooterSelector = createSelector(
  getInvoiceExport,
  (invoiceExport = Immutable.Map()) => invoiceExport.get('footer'),
);

export const invoiceTemplateSuggestionsSelector = createSelector(
  getInvoiceExport,
  (invoiceExport = Immutable.Map()) => invoiceExport.get('html_translation'),
);

export const invoiceTemplateTemplatesSelector = createSelector(
  getInvoiceExport,
  (invoiceExport = Immutable.Map()) => invoiceExport.get('templates'),
  // (invoiceExport = Immutable.Map()) => {
  //   const defaultTamplates = Immutable.Map({
  //     header: Immutable.List([
  //       Immutable.Map({ label: 'Empty', content: '<p>Empty</p>' }),
  //       Immutable.Map({ label: 'Default', content: '<p>default</p>' }),
  //     ]),
  //   });
  //   return invoiceExport.get('templates', defaultTamplates);
  // },
);

export const invoiceTemplateStatusSelector = createSelector(
  getInvoiceExport,
  (invoiceExport = Immutable.Map()) => invoiceExport.get('status'),
);
