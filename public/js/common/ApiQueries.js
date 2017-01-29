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
    { size: '1' },
    { page: '0' },
    { query: JSON.stringify({
      key,
      to: { $gte: moment() },
      from: { $lte: moment() },
    }) },
  ],
});

export const getProductsByKeysQuery = (keys, project = {}) => ({
  api: 'find',
  params: [
    { collection: 'rates' },
    { size: 1000 },
    { project: JSON.stringify(project) },
    { page: 0 },
    { query: JSON.stringify({
      key: { $in: keys },
      to: { $gte: moment() },
      from: { $lte: moment() },
    }) },
  ],
});

export const getActiveProductsKeysQuery = () => ({
  api: 'find',
  params: [
    { collection: 'rates' },
    { size: 1000 },
    { page: 0 },
    { query: JSON.stringify({ to: { $gt: moment() } }) },
    { project: JSON.stringify({ key: 1 }) },
  ],
});

export const fetchPlanByIdQuery = id => ({
  api: 'find',
  params: [
    { collection: 'plans' },
    { size: 1 },
    { page: 0 },
    { query: JSON.stringify({ _id: id }) },
  ],
});

export const fetchPrepaidIncludeByIdQuery = id => ({
  api: 'find',
  params: [
    { collection: 'prepaidincludes' },
    { size: 1 },
    { page: 0 },
    { query: JSON.stringify({ _id: id }) },
  ],
});

export const saveQuery = body => ({
  api: 'save',
  options: {
    method: 'POST',
    body,
  },
});


export const getPPIncludesQuery = () => ({
  api: 'find',
  params: [
    { collection: 'prepaidincludes' },
    { query: JSON.stringify(
      { to: { $gt: moment() } }
    ) },
  ],
});


export const getPlansGroupsQuery = () => {
  const toadyApiString = moment();
  const projectString = JSON.stringify({
    name: 1,
    include: 1,
  });
  const queryString = JSON.stringify({
    'include.groups': { $exists: true },
    to: { $gte: toadyApiString },
    from: { $lte: toadyApiString },
  });
  return {
    api: 'find',
    params: [
      { collection: 'plans' },
      { query: queryString },
      { project: projectString },
    ],
  };
};

export const getServicesGroupsQuery = () => {
  const toadyApiString = moment();
  const projectString = JSON.stringify({
    name: 1,
    include: 1,
  });
  const queryString = JSON.stringify({
    'include.groups': { $exists: true },
    to: { $gte: toadyApiString },
    from: { $lte: toadyApiString },
  });
  return {
    api: 'find',
    params: [
      { collection: 'services' },
      { query: queryString },
      { project: projectString },
    ],
  };
};

export const getAllGroupsQuery = () => ([
  getPlansGroupsQuery(),
  getServicesGroupsQuery(),
]);

export const getPrepaidIncludesQuery = () => ({
  api: 'find',
  params: [
    { collection: 'prepaidincludes' },
    { query: JSON.stringify({}) },
  ],
});
