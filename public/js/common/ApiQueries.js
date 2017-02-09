import moment from 'moment';


export const getProductByKeyQuery = key => ({
  api: 'find',
  params: [
    { collection: 'rates' },
    { size: 1 },
    { page: 0 },
    { query: JSON.stringify({
      key,
      to: { $gte: moment().toISOString() },
      from: { $lte: moment().toISOString() },
    }) },
  ],
});

export const getProductsByKeysQuery = (keys, project = {}) => ({
  api: 'find',
  params: [
    { collection: 'rates' },
    { size: 1000 },
    { page: 0 },
    { project: JSON.stringify(project) },
    { query: JSON.stringify({
      key: { $in: keys },
      to: { $gt: moment().toISOString() },
      from: { $lte: moment().toISOString() },
    }) },
  ],
});

export const saveQuery = body => ({
  api: 'save',
  options: {
    method: 'POST',
    body,
  },
});

export const getPaymentGatewaysQuery = () => ({
  api: 'paymentgateways',
  action: 'list',
});


/* Aggregate API */
export const auditTrailEntityTypesQuery = () => {
  const revenueQuery = [{
    $match: { source: 'audit' },
  }, {
    $group: { _id: '$collection' },
  }, {
    $project: { name: '$_id', _id: 0 },
  }, {
    $sort: { name: 1 },
  }];
  return {
    api: 'aggregate',
    params: [
      { collection: 'log' },
      { pipelines: JSON.stringify(revenueQuery) },
    ],
  };
};


/* Settings API */
export const savePaymentGatewayQuery = gateway => ({
  api: 'settings',
  params: [
    { category: 'payment_gateways' },
    { action: 'set' },
    { data: JSON.stringify(gateway) },
  ],
});

export const disablePaymentGatewayQuery = name => ({
  api: 'settings',
  params: [
    { category: 'payment_gateways' },
    { action: 'unset' },
    { data: JSON.stringify({ name }) },
  ],
});


/* BillAPI */
export const getGroupsQuery = (collection) => {
  const queryString = {
    'include.groups': { $exists: true },
    to: { $gte: moment().toISOString() },
    from: { $lte: moment().toISOString() },
  };
  const projectString = {
    name: 1,
    include: 1,
  };
  return {
    action: 'uniqueget',
    entity: collection,
    params: [
      { query: JSON.stringify(queryString) },
      { project: JSON.stringify(projectString) },
      { page: 0 },
      { size: 9999 },
    ],
  };
};

export const getSubscribersByAidQuery = aid => ({
  action: 'uniqueget',
  entity: 'subscribers',
  params: [
    { query: JSON.stringify({ aid }) },
    { page: 0 },
    { size: 9999 },
  ],
});

export const getEntityByIdQuery = (collection, id) => ({
  action: 'get',
  entity: collection,
  params: [
    { query: JSON.stringify({ _id: id }) },
    { page: 0 },
    { size: 1 },
  ],
});

export const getEntitesQuery = (collection, project = {}) => {
  let action;
  switch (collection) {
    case 'users':
      action = 'get';
      break;
    default:
      action = 'uniqueget';
  }
  return ({
    action,
    entity: collection,
    params: [
      { page: 0 },
      { size: 9999 },
      { project: JSON.stringify(project) },
      { sort: JSON.stringify(project) },
    ],
  });
};

// List
export const getPrepaidIncludesQuery = () => getEntitesQuery('prepaidincludes');
export const getProductsKeysQuery = () => getEntitesQuery('rates', { key: 1 });
export const getServicesKeysQuery = () => getEntitesQuery('services', { name: 1 });
export const getPlansKeysQuery = () => getEntitesQuery('plans', { name: 1 });
export const getUserKeysQuery = () => getEntitesQuery('users', { username: 1 });
export const getAllGroupsQuery = () => ([
  getGroupsQuery('plans'),
  getGroupsQuery('services'),
]);
// By ID
export const fetchServiceByIdQuery = id => getEntityByIdQuery('services', id);
export const fetchProductByIdQuery = id => getEntityByIdQuery('rates', id);
export const fetchPrepaidIncludeByIdQuery = id => getEntityByIdQuery('prepaidincludes', id);
export const fetchPlanByIdQuery = id => getEntityByIdQuery('plans', id);
export const fetchUserByIdQuery = id => getEntityByIdQuery('users', id);
