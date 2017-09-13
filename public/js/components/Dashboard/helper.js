import moment from 'moment';
import { getSymbolFromCurrency } from 'currency-symbol-map';
import countries from './countries.json';

export const getCountryKeyByCountryName = (name, notSetValue = null) => {
  for (const key in countries) {
    if (countries[key] === name) {
      return key;
    }
  }
  return notSetValue;
};

export const parseCurrencyValue = (value, currency) => {
  const currencySymbol = getSymbolFromCurrency(currency);
  const lacaleNumber = isNaN(value) ? 0 : Number(value).toLocaleString('en-US');
  return `${lacaleNumber}${currencySymbol}`;
};

export const parseCurrencyThousandValue = (value, currency) => {
  const currencySymbol = getSymbolFromCurrency(currency);
  const lacaleNumber = isNaN(value) ? 0 : Number(value).toLocaleString('en-US', { maximumFractionDigits: 0 });
  return `${lacaleNumber}${currencySymbol}`;
};

export const parseCountValue = (value) => {
  if (isNaN(value)) {
    return 0;
  }
  return Number(value).toLocaleString('en-US');
};

export const parseIntegerValue = (value) => {
  if (isNaN(value)) {
    return 0;
  }
  return Number(value).toLocaleString('en-US', { maximumFractionDigits: 0 });
};

export const parseDateValue = value => moment(value).format('MMM YYYY');

export const parseMonthValue = value => moment(value).format('MMM');

export const parsePercent = (value) => {
  const percent = isNaN(value) ? 0 : value;
  return Number(percent).toLocaleString('en-US', { style: 'percent', maximumFractionDigits: 2 });
};
