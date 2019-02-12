import { createSelector } from 'reselect';
import Immutable from 'immutable';
import moment from 'moment';
import {
  getFieldName,
  getFieldNameType,
  isLinkerField,
  setFieldTitle,
  addPlayToFieldTitle,
} from '../common/Util';

const getTaxation = (state, props) => // eslint-disable-line no-unused-vars
  state.settings.getIn(['taxation']);

const getSystemSettings = (state, props) => // eslint-disable-line no-unused-vars
  state.settings.getIn(['system']);

const getPlaysSettings = (state, props) => // eslint-disable-line no-unused-vars
  state.settings.getIn(['plays']);

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

const getEventType = (state, props) => props.eventType;

const getMinEntityDate = (state, props) => // eslint-disable-line no-unused-vars
  state.settings.get('minimum_entity_start_date');

const getAccountFields = (state, props) => // eslint-disable-line no-unused-vars
  state.settings.getIn(['subscribers', 'account', 'fields']);

const getSubscriberFields = (state, props) => // eslint-disable-line no-unused-vars
  state.settings.getIn(['subscribers', 'subscriber', 'fields']);

const getLinesFields = (state, props) => // eslint-disable-line no-unused-vars
  state.settings.getIn(['lines', 'fields']);

const getServiceFields = (state, props) => // eslint-disable-line no-unused-vars
  state.settings.getIn(['services', 'fields']);

const getProductFields = (state, props) => // eslint-disable-line no-unused-vars
    state.settings.getIn(['rates', 'fields']);

const getPlanFields = (state, props) => // eslint-disable-line no-unused-vars
    state.settings.getIn(['plans', 'fields']);

const getInvoiceExport = (state, props) => // eslint-disable-line no-unused-vars
    state.settings.get('invoice_export');

const getEmailTemplates = (state, props) => // eslint-disable-line no-unused-vars
    state.settings.get('email_templates');

const getEvents = (state, props) => // eslint-disable-line no-unused-vars
    state.settings.getIn(['events']);

const getCollections = (state, props) => // eslint-disable-line no-unused-vars
    state.settings.getIn(['collection']);

const getTemplateTokens = (state, props) => // eslint-disable-line no-unused-vars
    state.settings.getIn(['template_token']);

const getPaymentGateways = (state, props) => // eslint-disable-line no-unused-vars
    state.settings.getIn(['payment_gateways']);

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

const selectFieldNames = (fields) => {
  if (fields) {
    return fields.map(field => field.get('field_name', ''));
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

const selectRateCategories = (fields) => {
  if (fields) {
    const categoriesField = fields.find(field => field.get('field_name', '') === 'tariff_category');
    if (categoriesField) {
      return Immutable.List(categoriesField.get('select_options', '').split(','));
    }
  }
  return undefined;
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
  state.settings.get('file_types', Immutable.List());

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

const selectFielteredFields = (inputProssesors) => {
  let options = Immutable.Set();
  inputProssesors.forEach((inputProssesor) => {
    const filteredFields = inputProssesor.getIn(['parser', 'structure'], Immutable.List())
                                          .filter(field => field.get('checked', true) === true)
                                          .map(field => field.get('name', ''));
    options = options.concat(filteredFields);
  });
  return options.toList();
};

const selectRatingParams = (inputProssesors) => {
  let options = Immutable.Set();
  inputProssesors.forEach((inputProssesor) => {
    const ratingCalculators = inputProssesor.get('rate_calculators', Immutable.Map());
    ratingCalculators.forEach((ratingCalculatorsInCategory) => {
      ratingCalculatorsInCategory.forEach((ratingCalculatorsPriority) => {
        ratingCalculatorsPriority.forEach((fields) => {
          const currentFields = fields
          .filter(field => field.get('rate_key', '').startsWith('params.'))
          .map(field => field.get('rate_key', ''));
          options = options.concat(currentFields);
        });
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

export const inputProssesorUsageTypesOptionsSelector = createSelector(
  getInputProssesors,
  (inputProssesors = Immutable.List()) => Immutable.Map()
    .withMutations((nputProssesorUsageTypesWithMutations) => {
      inputProssesors.forEach((inputProssesor) => {
        const types = getUniqueUsageTypesFormInputProssesors(inputProssesor);
        nputProssesorUsageTypesWithMutations.set(inputProssesor.get('file_type'), types);
      });
    }),
);

export const inputProssesorfilteredFieldsSelector = createSelector(
  getInputProssesors,
  selectFielteredFields,
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

export const systemSettingsSelector = createSelector(
  getSystemSettings,
  system => system,
);

export const playsSettingsSelector = createSelector(
  getPlaysSettings,
  plays => plays,
);

export const playsEnabledSelector = createSelector(
  playsSettingsSelector,
  (plays = Immutable.List()) => (plays
    ? plays.filter(play => play.get('enabled', true))
    : Immutable.List()
  ),
);

export const isPlaysEnabledSelector = createSelector(
  playsEnabledSelector,
  (playsEnabled = Immutable.List()) => playsEnabled.size > 1,
);

export const availablePlaysSettingsSelector = createSelector(
  getPlaysSettings,
  plays => (plays ? plays.filter(play => play.get('enabled', true)) : undefined),
);

export const closedCycleChangesSelector = createSelector(
  systemSettingsSelector,
  (system = Immutable.Map()) => system.get('closed_cycle_changes'),
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

export const accountFieldNamesSelector = createSelector(
  accountFieldsSelector,
  selectFieldNames,
);

export const accountImportFieldsSelector = createSelector(
  accountFieldsSelector,
  selectAccountImportFields,
);

export const availablePlaysLabelsSelector = createSelector(
  availablePlaysSettingsSelector,
  (plays = Immutable.List()) => plays.reduce(
    (labels, item) => labels.set(item.get('name'), item.get('label')),
    Immutable.Map(),
  ),
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

export const subscriberFieldsWithPlaySelector = createSelector(
  subscriberFieldsSelector,
  availablePlaysLabelsSelector,
  isPlaysEnabledSelector,
  (fields = Immutable.List(), plays = Immutable.Map(), isPlaysEnabled = false) =>
    fields.map(field => (isPlaysEnabled ? addPlayToFieldTitle(field, plays) : field)),
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
  (fields = Immutable.List()) => fields.map(field => setFieldTitle(field, 'product')),
);

export const rateCategoriesSelector = createSelector(
  getProductFields,
  selectRateCategories,
);

export const seriveceFieldsSelector = createSelector(
  getServiceFields,
  (fields = Immutable.List()) => fields.map(field => setFieldTitle(field, 'service')),
);

export const planFieldsSelector = createSelector(
  getPlanFields,
  (fields = Immutable.List()) => fields.map(field => setFieldTitle(field, 'plan')),
);

export const templateTokenSettingsSelector = createSelector(
  getTemplateTokens,
  templateTokens => templateTokens,
);

export const templateTokenSettingsSelectorForEditor = createSelector(
  templateTokenSettingsSelector,
  (state, props, types) => types,
  (templateTokens, types) => templateTokens
    .filter((tokens, type) => types.includes(type))
    .reduce((acc, tokens, type) =>
      Immutable.List([...acc, ...tokens.map(token => `${type}::${token}`)]),
      Immutable.List(),
    ),
);

export const collectionSettingsSelector = createSelector(
  getCollections,
  collection => (collection ? collection.get('settings', Immutable.Map()) : undefined),
);

export const collectionStepsSelector = createSelector(
  getCollections,
  collection => (collection ? collection.get('steps', Immutable.List()) : undefined),
);

export const collectionStepsSelectorForList = createSelector(
  collectionStepsSelector,
  steps => (steps
    ? steps.sortBy(item => parseFloat(item.get('do_after_days', 0)))
    : undefined),
);

export const eventsSettingsSelector = createSelector(
  getEvents,
  events => (events ? events.get('settings', Immutable.Map()) : undefined),
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
      type: field.get('type', 'string'),
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

export const paymentGatewaysSelector = createSelector(
  getPaymentGateways,
  availablePaymentGateways => availablePaymentGateways,
);

export const emailTemplatesSelector = createSelector(
  getEmailTemplates,
  emailTemplates => emailTemplates,
);

export const eventsSelector = createSelector(
  getEvents,
  getEventType,
  (events = Immutable.Map(), type) => events.get(type),
);
