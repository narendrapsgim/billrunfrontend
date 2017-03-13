import { createSelector } from 'reselect';
import Immutable from 'immutable';

const getTaxation = (state, props) => // eslint-disable-line no-unused-vars
  state.settings.getIn(['taxation']);

const getPricing = (state, props) => // eslint-disable-line no-unused-vars
    state.settings.getIn(['pricing']);

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


export const inputProssesorCsiOptionsSelector = createSelector(
  getInputProssesors,
  selectCsiOptions
);

export const taxationSelector = createSelector(
  getTaxation,
  taxation => taxation
);

export const pricingSelector = createSelector(
  getPricing,
  pricing => pricing
);

export const currencySelector = createSelector(
  pricingSelector,
  pricing => pricing.get('currency')
);
