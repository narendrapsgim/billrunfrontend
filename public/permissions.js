import Immutable from 'immutable';

export const permissions = Immutable.fromJS({
  dashboard:{
    view: ["read"]
  },
  plans: {
    view: ["admin"]
  },
  plan: {
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
