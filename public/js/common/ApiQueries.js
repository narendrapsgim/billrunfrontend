// TODO: fix to uniqueget (for now billAoi can't search by 'rates')
export const searchProductsByKeyAndUsagetQuery = (usaget, key, notKeys) => {
  const query = {
    key: {
      $nin: notKeys,
      $regex: key,
      $options: 'i',
    },
  };
  if (usaget !== 'cost') {
    query[`rates.${usaget}`] = { $exists: true };
  }
  return {
    api: 'find',
    params: [
      { collection: 'rates' },
      { size: '20' },
      { page: '0' },
      { project: JSON.stringify({ key: 1 }) },
      { query: JSON.stringify(query) },
    ],
  };
};

export const saveQuery = body => ({
  api: 'save',
  options: {
    method: 'POST',
    body,
  },
});

export const getCurrenciesQuery = () => ({
  api: 'currencies',
  params: [
    { simpleArray: true },
  ],
});

export const getPaymentGatewaysQuery = () => ({
  api: 'paymentgateways',
  action: 'list',
});

export const getInputProcessorActionQuery = (fileType, action) => ({
  api: 'settings',
  params: [
    { category: 'file_types' },
    { action },
    { data: JSON.stringify({ file_type: fileType }) },
  ],
});

export const getAddUsagetQuery = usaget => ({
  api: 'settings',
  params: [
    { category: 'usage_types' },
    { action: 'set' },
    { data: [JSON.stringify(usaget)] },
  ],
});

export const getCreditChargeQuery = params => ({
  api: 'credit',
  params,
});

/* List Components queries*/
export const usageListQuery = (query, page, sort, size) => ({
  api: 'find',
  params: [
    { collection: 'lines' },
    { size },
    { page },
    { sort: JSON.stringify(sort) },
    { query: JSON.stringify(query) },
  ],
});

export const queueListQuery = (query, page, sort, size) => ({
  api: 'find',
  params: [
    { collection: 'queue' },
    { size },
    { page },
    { sort: JSON.stringify(sort) },
    { query: JSON.stringify(query) },
  ],
});

export const prepaidBalancesListQuery = (query, page, sort, size) => ({
  api: 'find',
  params: [
    { collection: 'balances' },
    { size },
    { page },
    { sort: JSON.stringify(sort) },
    { query: JSON.stringify(query) },
  ],
});

export const postpaidBalancesListQuery = (query, page, sort, size) => ({
  api: 'find',
  params: [
    { collection: 'balances' },
    { size },
    { page },
    { sort: JSON.stringify(sort) },
    { query: JSON.stringify(query) },
  ],
});

export const auditTrailListQuery = (query, page, fields, sort, size) => ({
  api: 'find',
  params: [
    { collection: 'log' },
    { size },
    { page },
    { project: JSON.stringify(fields) },
    { sort: JSON.stringify(sort) },
    { query: JSON.stringify(query) },
  ],
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
export const apiEntityQuery = (collection, action, body) => ({
  entity: collection,
  action,
  options: {
    method: 'POST',
    body,
  },
});


export const getGroupsQuery = collection => ({
  action: 'uniqueget',
  entity: collection,
  params: [
    { query: JSON.stringify({
      'include.groups': { $exists: true },
    }) },
    { project: JSON.stringify({
      name: 1,
      include: 1,
    }) },
    { page: 0 },
    { size: 9999 },
  ],
});

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

export const getDeleteLineQuery = id => ({
  action: 'delete',
  entity: 'lines',
  params: [
    { query: JSON.stringify({ _id: id }) },
  ],
});


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

export const getProductByKeyQuery = key => ({
  action: 'uniqueget',
  entity: 'rates',
  params: [
    { query: JSON.stringify({ key: { $regex: `^${key}$` } }) },
    { page: 0 },
    { size: 1 },
  ],
});

export const searchProductsByKeyQuery = (key, project = {}) => ({
  action: 'uniqueget',
  entity: 'rates',
  params: [
    { page: 0 },
    { size: 9999 },
    { project: JSON.stringify(project) },
    { sort: JSON.stringify(project) },
    { query: JSON.stringify({
      key: { $regex: key, $options: 'i' },
    }) },
    { states: JSON.stringify([0, 1]) },
  ],
});

export const searchPlansByKeyQuery = (name, project = {}) => ({
  action: 'uniqueget',
  entity: 'plans',
  params: [
    { page: 0 },
    { size: 9999 },
    { project: JSON.stringify(project) },
    { sort: JSON.stringify(project) },
    { query: JSON.stringify({
      name: { $regex: name, $options: 'i' },
    }) },
    { states: JSON.stringify([0]) },
  ],
});

export const getProductsByKeysQuery = (keys, project = {}) => ({
  action: 'uniqueget',
  entity: 'rates',
  params: [
    { page: 0 },
    { size: 9999 },
    { project: JSON.stringify(project) },
    { sort: JSON.stringify(project) },
    { query: JSON.stringify({
      key: { $in: keys },
    }) },
  ],
});

export const getEntityRevisionsQuery = (collection, revisionBy, value, size = 9999) => ({
  action: 'get',
  entity: collection,
  params: [
    { sort: JSON.stringify({ from: -1 }) },
    { query: JSON.stringify({
      [revisionBy]: {
        $regex: `^${value}$`,
      },
    }) },
    { project: JSON.stringify({ from: 1, to: 1, description: 1, [revisionBy]: 1 }) },
    { page: 0 },
    { size },
    { state: JSON.stringify([0, 1, 2]) },
  ],
});
