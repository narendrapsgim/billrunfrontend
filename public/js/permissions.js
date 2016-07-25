import Immutable from 'immutable';

export const permissions = Immutable.fromJS({
  plans: {
    view: ["read"]
  },
  plan_setup: {
    view: ["read", "write"],
    save: ["write"]
  }
});
