/**
 * Create Api query object to get users names
 * @type {Object} = { size , page, sort, project, query }
 */
import moment from 'moment';

export const userNamesQuery = (
  {
    size = 1000,
    page = 0,
    sort = { username: 1 },
    project = { username: 1 },
    query = {},
  } = {}
) => ({
  api: 'find',
  params: [
    { collection: 'users' },
    { query: JSON.stringify(query) },
    { project: JSON.stringify(project) },
    { sort: JSON.stringify(sort) },
    { size },
    { page },
  ],
});

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

  const querie = {
    api: 'aggregate',
    params: [
      { collection: 'log' },
      { pipelines: JSON.stringify(revenueQuery) },
    ],
  };

  return querie;
};


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

export const getGroupsNamesQuery = (collection) => {
  const queryString = JSON.stringify({
    'include.groups': { $exists: true },
    to: { $gte: moment().toISOString() },
    from: { $lte: moment().toISOString() },
  });
  const projectString = JSON.stringify({
    name: 1,
    include: 1,
  });
  return {
    api: 'find',
    params: [
      { collection },
      { query: queryString },
      { project: projectString },
    ],
  };
};

export const getAllGroupsQuery = () => ([
  getGroupsNamesQuery('plans'),
  getGroupsNamesQuery('services'),
]);

export const getSubscribersByAidQuery = aid => ({
  action: 'uniqueget',
  entity: 'subscribers',
  params: [
    { query: JSON.stringify({ aid }) },
    { page: 0 },
    { size: 9999 },
  ],
});

export const getPaymentGatewaysQuery = () => ({
  api: 'paymentgateways',
  action: 'list',
});

export const getEntityByIdQuery = (collection, id) => ({
  // api: 'find',
  // params: [
  //   { collection },
  //   { size: 1 },
  //   { page: 0 },
  //   { query: JSON.stringify({ _id: id }) },
  // ],
  action: 'get',
  entity: collection,
  params: [
    { query: JSON.stringify({ _id: id }) },
    { page: 0 },
    { size: 1 },
  ],
});
export const fetchProductByIdQuery = id => getEntityByIdQuery('rates', id);
export const fetchPrepaidIncludeByIdQuery = id => getEntityByIdQuery('prepaidincludes', id);
export const fetchPlanByIdQuery = id => getEntityByIdQuery('plans', id);
export const fetchUserByIdQuery = id => ({
  api: 'users',
  params: [
    { userId: id },
    { action: 'read' },
  ],
});

export const getEntitesQuery = (collection, project = {}) => ({
  // api: 'find',
  // params: [
  //   { collection },
  //   { size: 9999 },
  //   { page: 0 },
  //   { query: JSON.stringify({
  //     to: { $gt: moment().toISOString() },
  //   }) },
  //   { project: JSON.stringify(project) },
  // ],
  action: 'uniqueget',
  entity: collection,
  params: [
    { page: 0 },
    { size: 9999 },
    { project: JSON.stringify(project) },
  ],
});

export const getPrepaidIncludesQuery = () => getEntitesQuery('prepaidincludes');
export const getProductsKeysQuery = () => getEntitesQuery('rates', { key: 1 });
export const getServicesKeysQuery = () => getEntitesQuery('services', { name: 1 });
export const getPlansKeysQuery = () => getEntitesQuery('plans', { name: 1 });
