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

const getTaxation = (state, props) => // eslint-disable-line no-unused-vars
  state.settings.getIn(['taxation']);

const getPricing = (state, props) => // eslint-disable-line no-unused-vars
  state.settings.getIn(['pricing']);

const getUsageType = (state, props) => // eslint-disable-line no-unused-vars
  state.settings.get('usage_types');

const getPropertyTypes = (state, props) => // eslint-disable-line no-unused-vars
  state.settings.get('property_types');

const getBillrun = (state, props) => // eslint-disable-line no-unused-vars
  state.settings.get('billrun');

const getEntityFields = (state, props) =>
  state.settings.getIn([props.entityName, 'fields']);

const getMinEntityDate = (state, props) => // eslint-disable-line no-unused-vars
  state.settings.get('minimum_entity_start_date');

const getAccountFields = (state, props) => // eslint-disable-line no-unused-vars
  state.settings.getIn(['subscribers', 'account', 'fields']);

const getSubscriberFields = (state, props) => // eslint-disable-line no-unused-vars
  state.settings.getIn(['subscribers', 'subscriber', 'fields']);

const getProductFields = (state, props) => // eslint-disable-line no-unused-vars
    state.settings.getIn(['rates', 'fields']);

const getInvoiceExport = (state, props) => // eslint-disable-line no-unused-vars
    state.settings.get('invoice_export');

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
    ratingCalculators.forEach((fields) => {
      const currentFields = fields
      .filter(field => field.get('rate_key', '').startsWith('params.'))
      .map(field => field.get('rate_key', ''));
      options = options.concat(currentFields);
    });
  });
  return options.toList();
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

const selectLinesFields = (customKeys) => {
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

const selectUsageTypes = (usageTypes) => {
  if (!usageTypes) {
    return undefined;
  }
  return usageTypes.map(usageType => usageType.get('usage_type', ''));
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

export const linesFiledsSelector = createSelector(
  inputProssesorCustomKeysSelector,
  selectLinesFields,
);


export const taxationSelector = createSelector(
  getTaxation,
  taxation => taxation,
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

export const usageTypeSelector = createSelector(
  getUsageType,
  selectUsageTypes,
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

export const subscriberImportFieldsSelector = createSelector(
  subscriberFieldsSelector,
  accountImportFieldsSelector,
  selectSubscriberImportFields,
);

export const productFieldsSelector = createSelector(
  getProductFields,
  productFields => productFields,
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

const concatJoinFields = (fields, joinFields = Immutable.Map()) => {
  if (!fields) {
    return Immutable.List();
  }
  return fields.withMutations((fieldsWithMutations) => {
    joinFields.forEach((entityfields, entity) => {
      const entityLabel = sentenceCase(getConfig(['systemItems', entity, 'itemName'], entity));
      if (!entityfields.isEmpty()) {
        entityfields.forEach((entityfield) => {
          const joinId = `$${entity}.${entityfield.get('id', '')}`;
          const joinTitle = `${entityLabel}: ${entityfield.get('title', entityfield.get('id', ''))}`;
          const joinField = entityfield.set('id', joinId).set('title', joinTitle);
          fieldsWithMutations.push(joinField);
        });
      }
    });
  });
};

const selectReportFields = (subscriberFields, accountFields, linesFileds) => Immutable.Map({
  usage: linesFileds,
  // usage: concatJoinFields(linesFileds, Immutable.Map({
  //   subscription: subscriberFields, customer: accountFields,
  // }),
  subscription: subscriberFields,
  // subscription = concatJoinFields(subscriberFields, Immutable.Map({
  //   customer: accountFields, usage: linesFileds,
  // })),
  customer: accountFields,
  // customer = concatJoinFields(accountFields, Immutable.Map({
  //   subscription: subscriberFields, usage: linesFileds,
  // })),
});

const mergeEntityAndReportConfigFields = (fields, type) => { // 'account' 'subscribers'
  const predefinedFileds = getConfig(['reports', 'fields', type], Immutable.List());
  const entityFields = formatReportFields(fields);
  return predefinedFileds.withMutations((fieldsWithMutations) => {
    predefinedFileds.forEach((predefinedFiled, idx) => {
      if (!predefinedFiled.has('title')) {
        const fieldName = getFieldName(predefinedFiled.get('id', ''), getFieldNameType(type));
        const title = fieldName === predefinedFiled.get('id', '') ? sentenceCase(fieldName) : fieldName;
        fieldsWithMutations.setIn([idx, 'title'], title);
      }
    });

    entityFields.forEach((entityField) => {
      if (predefinedFileds.findIndex(predefinedFiled => predefinedFiled.get('id', '') === entityField.get('id', '')) === -1) {
        fieldsWithMutations.push(entityField);
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

const reportSubscriberFieldsSelector = createSelector(
  subscriberFieldsSelector,
  fields => mergeEntityAndReportConfigFields(fields, 'subscribers'),
);

const reportAccountFieldsSelector = createSelector(
  accountFieldsSelector,
  fields => mergeEntityAndReportConfigFields(fields, 'account'),
);

const reportLinesFieldsSelector = createSelector(
  inputProssesorCustomKeysSelector,
  selectReportLinesFields,
);

export const reportFieldsSelector = createSelector(
  reportSubscriberFieldsSelector,
  reportAccountFieldsSelector,
  reportLinesFieldsSelector,
  selectReportFields,
);

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
