import { createSelector } from 'reselect';
import Immutable from 'immutable';
import { sentenceCase } from 'change-case';
import { getFieldName, getConfig } from '../common/Util';

const getTaxation = (state, props) => // eslint-disable-line no-unused-vars
  state.settings.getIn(['taxation']);

const getPricing = (state, props) => // eslint-disable-line no-unused-vars
    state.settings.getIn(['pricing']);

const getBillrun = (state, props) => // eslint-disable-line no-unused-vars
      state.settings.get('billrun');

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
  const predefinedFileds = getConfig(['reports', 'fields', 'lines'], Immutable.List());
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
          title: `${title} (CF)`,
          filter: true,
          display: true,
        }));
      }
    });
  })
  .sort(sortFieldOption);
};


export const inputProssesorCsiOptionsSelector = createSelector(
  getInputProssesors,
  selectCsiOptions
);

export const inputProssesorCustomKeysSelector = createSelector(
  getInputProssesors,
  selectCustomKeys
);

export const linesFiledsSelector = createSelector(
  inputProssesorCustomKeysSelector,
  selectLinesFields
);


export const taxationSelector = createSelector(
  getTaxation,
  taxation => taxation
);

export const pricingSelector = createSelector(
  getPricing,
  pricing => pricing
);

export const billrunSelector = createSelector(
  getBillrun,
  billrun => billrun
);

export const currencySelector = createSelector(
  pricingSelector,
  (pricing = Immutable.Map()) => pricing.get('currency')
);

export const chargingDaySelector = createSelector(
  billrunSelector,
  (billrun = Immutable.Map()) => {
    const chargingDay = billrun.get('charging_day');
    return (isNaN(chargingDay)) ? chargingDay : Number(chargingDay);
  }
);
