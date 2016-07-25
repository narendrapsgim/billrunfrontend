import Immutable from 'immutable';

export const permissions = Immutable.fromJS({
  plans: {
    view: ["read"]
  },
  plan_setup: {
    view: ["read"],
    save: ["write"],
    update: ["write"]
  },
  products: {
    view: ["read"]
  },
  product_setup: {
    update: ["write"]
  },
  subscribers: {
    view: ["read"]
  },
});
