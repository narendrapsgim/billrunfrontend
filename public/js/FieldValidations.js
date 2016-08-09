import Immutable from 'immutable';

const validations = Immutable.fromJS({
  product_setup: {
    key: {
      mandatory: true
    },
    code: {
      mandatory: true
    },
    unit: {
      mandatory: true
    }
  },

  plan_setup: {
    PlanName: {
      mandatory: true
    },
    PlanCode: {
      mandatory: true
    },
    PlanDescription: {
      mandatory: true
    },
    Each: {
      mandatory: true
    },
    EachPeriod: {
      mandatory: true
    },
    ChargingMode: {
      mandatory: true
    },
    recurring_prices: {
      size: {
        '$gte': 1,
        '$lt': 3
      }
    }
  }
});

export default validations;
