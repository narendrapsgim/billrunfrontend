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

export const getUserLoginQuery = (username, password) => ({
  api: 'auth',
  params: [
    { username },
    { password },
  ],
});

export const getUserLogoutQuery = () => ({
  api: 'auth',
  params: [
    { action: 'logout' },
  ],
});

export const getUserCheckLoginQuery = () => ({
  api: 'auth',
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

export const getSubscriptionsByAidQuery = (aid, project = {}) => ({
  action: 'uniqueget',
  entity: 'subscribers',
  params: [
    { query: JSON.stringify({ aid }) },
    { page: 0 },
    { size: 9999 },
    { project: JSON.stringify(project) },
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
export const getPlansQuery = (project = { name: 1 }) => getEntitesQuery('plans', project);
export const getServicesQuery = (project = { name: 1 }) => getEntitesQuery('services', project);
export const getServicesKeysWithInfoQuery = () => getEntitesQuery('services', { name: 1, quantitative: 1 });
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
export const fetchDiscountByIdQuery = id => getEntityByIdQuery('discounts', id);
export const fetchPlanByIdQuery = id => getEntityByIdQuery('plans', id);
export const fetchPrepaidGroupByIdQuery = id => getEntityByIdQuery('prepaidgroups', id);
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

export const getEntitesByKeysQuery = (entity, keyField, keys, project = {}) => ({
  action: 'uniqueget',
  entity,
  params: [
    { page: 0 },
    { size: 9999 },
    { project: JSON.stringify(project) },
    { sort: JSON.stringify(project) },
    { query: JSON.stringify({
      [keyField]: { $in: keys },
    }) },
  ],
});
export const getServicesByKeysQuery = (keys, project = {}) => getEntitesByKeysQuery('services', 'name', keys, project);
export const getProductsByKeysQuery = (keys, project = {}) => getEntitesByKeysQuery('rates', 'key', keys, project);

export const getEntityRevisionsQuery = (collection, revisionBy, value, size = 9999) => {
  let query = {};
  switch (collection) {
    case 'subscribers':
      query = { [revisionBy]: value };
      break;
    default: query = { [revisionBy]: { $regex: `^${value}$` } };
  }
  return ({
    action: 'get',
    entity: collection,
    params: [
      { sort: JSON.stringify({ from: -1 }) },
      { query: JSON.stringify(query) },
      { project: JSON.stringify({
        from: 1,
        to: 1,
        description: 1,
        [revisionBy]: 1,
        revision_info: 1,
      }) },
      { page: 0 },
      { size },
      { state: JSON.stringify([0, 1, 2]) },
    ],
  });
};

export const getRebalanceAccountQuery = aid => ({
  api: 'resetlines',
  params: [
    { aid },
  ],
});

export const getCyclesQuery = () => ({
  api: 'billrun',
  action: 'cycles',
});

export const getCycleQuery = billrunKey => ({
  api: 'billrun',
  action: 'cycle',
  params: [
    { stamp: billrunKey },
  ],
});

export const getRunCycleQuery = (billrunKey, rerun) => ({
  api: 'billrun',
  action: 'completecycle',
  params: [
    { stamp: billrunKey },
    { rerun },
  ],
});

export const getConfirmCycleInvoiceQuery = (billrunKey, invoiceId) => ({
  api: 'billrun',
  action: 'confirmCycle',
  params: [
    { stamp: billrunKey },
    { invoices: invoiceId },
  ],
});

export const getConfirmCycleAllQuery = billrunKey => ({
  api: 'billrun',
  action: 'confirmCycle',
  params: [
    { stamp: billrunKey },
  ],
});

export const getChargeAllCycleQuery = () => ({
  api: 'billrun',
  action: 'chargeaccount',
});

export const getAllInvoicesQuery = billrunKey => ({
  action: 'get',
  entity: 'billrun',
  params: [
    { query: JSON.stringify({ billrun_key: billrunKey }) },
    { project: JSON.stringify({ _id: 1 }) },
  ],
});

export const getChargeStatusQuery = () => ({
  api: 'billrun',
  action: 'chargestatus',
});

export const getOperationsQuery = () => ({
  api: 'operations',
  params: [
    { action: 'charge_account' },
    { filtration: 'all' },
  ],
});

export const getCollectionDebtQuery = aid => ({
  api: 'bill',
  params: [
    { action: 'collection_debt' },
    { aids: JSON.stringify([aid]) },
  ],
});

export const getOfflinePaymentQuery = (method, aid, amount, payerName, chequeNo) => ({
  api: 'pay',
  params: [
    { method },
    { payments: JSON.stringify([{
      amount,
      aid,
      payer_name: payerName,
      dir: 'fc',
      deposit_slip: '',
      deposit_slip_bank: '',
      cheque_no: chequeNo,
      source: 'web',
    }]) },
  ],
});
