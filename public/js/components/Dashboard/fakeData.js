import faker from 'faker';
import moment from 'moment';
import { delay } from '../../common/Api';


export const fakeDoughnutDetails = () => delay(3, true, {
  labels: Array.from(Array(4)).map(() => faker.commerce.productName()),
  values: Array.from(Array(4)).map(() => faker.random.number({ min: 21000, max: 84000 })),
  sign: Array.from(Array(4)).map(() => faker.random.number({ min: -2, max: 2 })),
});

export const fakeDoughnutLegend = () => delay(2, true, {
  labels: ['Existing', 'New', 'Dorm.', 'Churn'],
  values: Array.from(Array(4)).map(() => faker.random.number({ min: 0, max: 200 })),
});

export const fakePercentBar = () => delay(1, true, {
  values: Array.from(Array(12)).map(() => faker.random.number({ min: 0, max: 800 })),
});

export const fakeLines = () => delay(5, true, {
  x: [{
    label: 'AVG',
    values: Array.from(Array(12)).map(() => faker.random.number({ min: 5000, max: 50000 })),
  }, {
    label: faker.commerce.productName(),
    values: Array.from(Array(3)).map(() => faker.random.number({ min: 10000, max: 20000 })),
  }],
  y: Array.from(Array(12)).map((v, i) => moment().year(2015).month(i).date(1)),
});

export const fakeBar = () => delay(4, true, {
  x: [{
    label: '2015',
    values: Array.from(Array(12)).map(() => faker.random.number({ min: 5000, max: 50000 })),
  }, {
    label: '2016',
    values: Array.from(Array(12)).map(() => faker.random.number({ min: 10000, max: 20000 })),
  }, {
    label: '2017',
    values: Array.from(Array(3)).map(() => faker.random.number({ min: 10000, max: 20000 })),
  }],
  y: Array.from(Array(12)).map((v, i) => moment.months(i)),
});
