var globalSetting = {
  storageVersion: 'v0.1',
  //serverUrl : "http://10.162.20.191:1337", // Roman
  //serverUrl : "http://10.162.20.86", // Eran
  // serverUrl : "http://10.162.20.247", // Shani
  serverUrl: "http://billrun",
  //serverUrl: "",
  serverApiTimeOut: 300000,  // 5 minutes
  serverApiDebug: false,
  serverApiDebugQueryString: 'XDEBUG_SESSION_START=netbeans-xdebug',
  datetimeFormat: "DD/MM/YYYY HH:mm",
  dateFormat: "DD/MM/YYYY",
  timeFormat: "HH:mm",
  apiDateTimeFormat: "YYYY-MM-DD",
  currency: '$',
  list: {
    maxItems: 100,
    defaultItems: 10,
  },
  statusMessageDisplayTimeout: 5000,
  planCycleUnlimitedValue: 'UNLIMITED',
  serviceCycleUnlimitedValue: 'UNLIMITED',
  productUnlimitedValue: 'UNLIMITED',
  keyUppercaseRegex: /^[A-Z0-9_]*$/,
  defaultLogo: 'billRun-cloud-logo.png',
  billrunCloudLogo: 'billRun-cloud-logo.png',
  billrunLogo: 'billRun-logo.png',
  queue_calculators: ['customer', 'rate', 'pricing'],
  mail_support: 'cloud_support@billrun.com',
  logoMaxSize: 2,
  chargingBufferDays: 5,
  reports: {
    entities: ['lines', 'subscription', 'customer'],
    fields: {
      lines: [
// default settings { id: required, type: 'string', filter: true, display: true, groupBy: true }
        { id: 'final_charge', type: 'number', filter: true, display: false, groupBy: true },
        { id: 'source', filter: false, display: true },
        { id: 'type', filter: false, display: true },
        { id: 'realtime', type: 'boolean', filter: true, display: false },
        { id: 'usaget' },
        { id: 'urt', type: 'date', filter: true, display: true },
        { id: 'connection_type', filter: true, display: false, inputConfig: {
          inputType: 'select',
          options: ['postpaid', 'prepaid'],
        } },
      ],
    },
    operators: [
      { id: 'eq', title: '==', types: ['string', 'number', 'boolean', 'date'] }, // 'Equals'
      { id: 'ne', title: '!=', types: ['string', 'number', 'boolean', 'date'] }, // 'Not equals'
      { id: 'lt', title: '<', types: ['number', 'date'] }, // 'Less than'
      { id: 'lte', title: '<=', types: ['number', 'date'] }, // 'Less than or equals'
      { id: 'gt', title: '>', types: ['number', 'date'] }, // 'Greater than'
      { id: 'gte', title: '>=', types: ['number', 'date'] }, // 'Greater than or equals'
      { id: 'like', title: 'Contains', types: ['string', 'number'] },
      { id: 'starts_with', title: 'Starts with', types: ['string'] },
      { id: 'ends_with', title: 'Ends with', types: ['string'] },
      { id: 'exists', title: 'Exists', types: ['string', 'number', 'boolean', 'date'] },
      { id: 'in', title: 'In', types: ['string', 'number'] },
    ],
    groupByOperators: [
      { id: 'sum', title: 'Sum', types: ['number'] },
      { id: 'avg', title: 'Average', types: ['number'] },
      { id: 'first', title: 'First', types: ['string', 'number', 'boolean', 'date'] },
      { id: 'last', title: 'Last', types: ['string', 'number', 'boolean', 'date'] },
      { id: 'max', title: 'Max', types: ['number', 'date'] },
      { id: 'min', title: 'Min', types: ['number', 'date'] },
      { id: 'push', title: 'List', types: ['string', 'number', 'boolean', 'date'] },
      { id: 'addToSet', title: 'Unique List', types: ['string', 'number', 'boolean', 'date'] },
      { id: 'count', title: 'Count', types: ['string', 'number', 'boolean', 'date'] },
    ],
  },
  systemItems: {
    service: {
      collection: 'services',
      uniqueField: 'name',
      itemName: 'service',
      itemType: 'service',
      itemsType: 'services',
    },
    plan: {
      collection: 'plans',
      uniqueField: 'name',
      itemName: 'plan',
      itemType: 'plan',
      itemsType: 'plans',
    },
    charging_plan: {
      collection: 'prepaidgroups',
      uniqueField: 'name',
      itemName: 'buckets group',
      itemType: 'charging_plan',
      itemsType: 'charging_plans',
    },
    prepaid_plan: {
      collection: 'plans',
      uniqueField: 'name',
      itemName: 'prepaid plan',
      itemType: 'prepaid_plan',
      itemsType: 'prepaid_plans',
    },
    prepaid_include: {
      collection: 'prepaidincludes',
      uniqueField: 'name',
      itemName: 'prepaid bucket',
      itemType: 'prepaid_include',
      itemsType: 'prepaid_includes',
    },
    product: {
      collection: 'rates',
      uniqueField: 'key',
      itemName: 'product',
      itemType: 'product',
      itemsType: 'products',
    },
    discount: {
      collection: 'discounts',
      uniqueField: 'key',
      itemName: 'discount',
      itemType: 'discount',
      itemsType: 'discounts',
    },
    subscription: {
      collection: 'subscribers',
      uniqueField: 'sid',
      itemName: 'subscription',
      itemType: 'subscription',
      itemsType: 'subscriptions',
    },
    customer: {
      collection: 'subscribers',
      uniqueField: 'aid',
      itemName: 'customer',
      itemType: 'customer',
      itemsType: 'customers',
    },
    report: {
      collection: 'reports',
      uniqueField: 'key',
      itemName: 'report',
      itemType: 'report',
      itemsType: 'reports',
    },
  },
};
