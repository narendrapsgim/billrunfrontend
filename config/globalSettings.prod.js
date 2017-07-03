var globalSetting = {
  storageVersion: 'v0.1',
  serverUrl: "",
  serverApiTimeOut: 300000, // 5 minutes
  serverApiDebug: false,
  serverApiDebugQueryString: 'XDEBUG_SESSION_START=netbeans-xdebug',
  datetimeFormat: "DD/MM/YYYY HH:mm",
  dateFormat: "DD/MM/YYYY",
  timeFormat: "HH:mm",
  apiDateFormat: "YYYY-MM-DD",
  apiDateTimeFormat: "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]",
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
  keyRegex: /^[A-Za-z0-9_]*$/,
  defaultLogo: 'billRun-cloud-logo.png',
  billrunCloudLogo: 'billRun-cloud-logo.png',
  billrunLogo: 'billRun-logo.png',
  queue_calculators: ['customer', 'rate', 'pricing'],
  mail_support: 'cloud_support@billrun.com',
  logoMaxSize: 2,
  importMaxSize: 8,
  chargingBufferDays: 5,
  reports: {
    entities: ['usage', 'subscription', 'customer'],
    fields: {
      usage: [
        // Default settings \ Example
        // { id: [REQUIRED], type: 'string', searchable: true, aggregatable: true, inputConfig: {
        //    inputType: 'select',
        //    options: ['option1', 'option2'] | [{value: 'val', label: 'Label'}, ...] /* array of values or objects */
        //    callback: 'getExampleOptions', /* callback function + should be implementation */
        // } },
        { id: 'urt', type: 'date' },
        { id: 'lastname' },
        { id: 'firstname' },
        { id: 'stamp' },
        { id: 'in_group', type: 'number' },
        { id: 'aprice', type: 'number' },
        { id: 'final_charge', type: 'number' },
        { id: 'file' },
        { id: 'billsec', type: 'number' },
        { id: 'sid', type: 'number' },
        { id: 'over_group', type: 'number' },
        { id: 'usagev', type: 'number' },
        { id: 'aid', type: 'number' },
        { id: 'process_time', type: 'string' },
        { id: 'usagesb', type: 'number' },
        { id: 'session_id', type: 'string' },
        { id: 'billrun_pretend', type: 'boolean' },
        { id: 'billrun_status',
          title: 'Billing cycle status',
          aggregatable: false,
          inputConfig: {
            inputType: 'select',
            options: [
              { value: 'current', label: 'Current' },
              { value: 'first_unconfirmed', label: 'First Unconfirmed' },
              { value: 'last_confirmed', label: 'Last Confirmed' },
              { value: 'confirmed', label: 'Confirmed' },
            ],
          },
        },
        { id: 'arate_key', inputConfig: { inputType: 'select', callback: 'getProductsOptions' } },
        { id: 'arategroup', inputConfig: { inputType: 'select', callback: 'getGroupsOptions' } },
        { id: 'billrun', inputConfig: { inputType: 'select', callback: 'getCyclesOptions' } },
        { id: 'plan', inputConfig: { inputType: 'select', callback: 'getPlansOptions' } },
        { id: 'usaget', inputConfig: { inputType: 'select', callback: 'getUsageTypesOptions' } },
      ],
      subscribers: [],
      account: [],
    },
    conditionsOperators: [
      { id: 'eq', title: 'Equals', types: ['date', 'boolean', 'fieldid:billrun_status'] }, // 'Equals'
      { id: 'in', title: 'Equals', types: ['string', 'number'], exclude: ['fieldid:billrun_status'] },
      { id: 'ne', title: 'Does Not equal', types: ['boolean'] }, // 'Not equals'
      { id: 'nin', title: 'Does Not equal', types: ['string', 'number'], exclude: ['fieldid:billrun_status'] },
      { id: 'lt', title: '<', types: ['number', 'date', 'fieldid:billrun'] }, // 'Less than'
      { id: 'lte', title: '<=', types: ['number', 'date', 'fieldid:billrun'] }, // 'Less than or equals'
      { id: 'gt', title: '>', types: ['number', 'date', 'fieldid:billrun'] }, // 'Greater than'
      { id: 'gte', title: '>=', types: ['number', 'date', 'fieldid:billrun'] }, // 'Greater than or equals'
      { id: 'like',
        title: 'Contains',
        types: ['string', 'number'],
        exclude: [
          'fieldid:billrun_status',
          'fieldid:billrun',
          'fieldid:arate_key',
          'fieldid:arategroup',
          'fieldid:plan',
          'fieldid:usaget',
        ],
      },
      { id: 'starts_with',
        title: 'Starts with',
        types: ['string'],
        exclude: [
          'fieldid:billrun_status',
          'fieldid:billrun',
          'fieldid:arate_key',
          'fieldid:arategroup',
          'fieldid:plan',
          'fieldid:usaget',
        ],
      },
      { id: 'ends_with',
        title: 'Ends with',
        types: ['string'],
        exclude: [
          'fieldid:billrun_status',
          'fieldid:billrun',
          'fieldid:arate_key',
          'fieldid:arategroup',
          'fieldid:plan',
          'fieldid:usaget',
        ],
      },
      { id: 'exists',
        title: 'Exists',
        types: ['string', 'number', 'boolean', 'date'],
        exclude: [
          'fieldid:billrun_status',
        ],
        options: ['yes', 'no'],
      },
    ],
    aggregateOperators: [
      { id: 'group', title: 'Group', types: ['string', 'number', 'boolean', 'date'], exclude: ['fieldid:count_group'] },
      { id: 'sum', title: 'Sum', types: ['number'], exclude: ['fieldid:count_group'] },
      { id: 'avg', title: 'Average', types: ['number'], exclude: ['fieldid:count_group'] },
      { id: 'first', title: 'First', types: ['string', 'number', 'boolean', 'date'], exclude: ['fieldid:count_group'] },
      { id: 'last', title: 'Last', types: ['string', 'number', 'boolean', 'date'], exclude: ['fieldid:count_group'] },
      { id: 'max', title: 'Max', types: ['number', 'date'], exclude: ['fieldid:count_group'] },
      { id: 'min', title: 'Min', types: ['number', 'date'], exclude: ['fieldid:count_group'] },
      { id: 'push', title: 'List', types: ['string', 'number', 'boolean', 'date'], exclude: ['fieldid:count_group'] },
      { id: 'addToSet', title: 'Unique List', types: ['string', 'number', 'boolean', 'date'], exclude: ['fieldid:count_group'] },
      { id: 'count', title: 'Count', types: ['fieldid:count_group'] },
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
      settingsKey: 'rates',
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
      settingsKey: 'subscribers.subscriber',
    },
    customer: {
      collection: 'accounts',
      uniqueField: 'aid',
      itemName: 'customer',
      itemType: 'customer',
      itemsType: 'customers',
      settingsKey: 'subscribers.account',
    },
    report: {
      collection: 'reports',
      uniqueField: 'key',
      itemName: 'report',
      itemType: 'report',
      itemsType: 'reports',
    },
    usage: {
      collection: 'lines',
      uniqueField: 'stamp',
      itemName: 'usage',
      itemType: 'usage',
      itemsType: 'usages',
    },
  },
};
