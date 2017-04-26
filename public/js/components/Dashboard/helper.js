import moment from 'moment';
import countries from './countries.json';

export const getCountryKeyByCountryName = (name, notSetValue = null) => {
  for (const key in countries) {
    if (countries[key] === name) {
      return key;
    }
  }
  return notSetValue;
};

export const parseCurrencyValue = (value, currency) =>
  Number(value).toLocaleString('en-US', { style: 'currency', currency });

export const parseCurrencyThousandValue = (value, currency) =>
  Number(value).toLocaleString('en-US', { style: 'currency', currency, maximumFractionDigits: 0 });

export const parseCountValue = value =>
  Number(value).toLocaleString('en-US');

export const parseDateValue = value =>
  moment(value).format('MMM YYYY');

export const parseMonthValue = value =>
  moment(value).format('MMM');

export const parsePercent = value =>
  Number(value).toLocaleString('en-US', { style: 'percent', maximumFractionDigits: 2 });
