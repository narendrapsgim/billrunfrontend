import faker from 'faker';


export const fakeDoughnutDetails = () => ({
  labels: Array.from(Array(4)).map(() => faker.commerce.productName()),
  values: Array.from(Array(4)).map(() => faker.random.number({ min: 21000, max: 84000 })),
  sign: Array.from(Array(4)).map(() => faker.random.number({ min: -2, max: 2 })),
});

export const fakeDoughnutLegend = () => ({
  labels: ['Existing', 'New', 'Dorm.', 'Churn'],
  values: Array.from(Array(4)).map(() => faker.random.number({ min: 0, max: 200 })),
});

export const fakePercentBar = () => ({
  values: Array.from(Array(12)).map(() => faker.random.number({ min: 0, max: 800 })),
});
