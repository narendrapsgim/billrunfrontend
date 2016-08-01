import moment from 'moment';
import * as Colors from 'material-ui/styles/colors';

const rates_field = [
  { dbkey: "*", collapsible: true, collapsed: true, fields: [
    { row: [
      { dbkey: "ceil", label: "Ceil", type: "checkbox", size: 2},
      { dbkey: "value", label: "Value", type: "number", size: 5},
      { dbkey: "units", label: "Interval", type: "Units", size: 5},
    ]},
    { row: [
      { dbkey: "unit", label: "Unit", size: 3 },
      { dbkey: "category", label: "Category", size: 3  },
      { dbkey: "access", label: "Sccess", type: "select", options: [
        { label: "Yes", value: 1},
        { label: "No", value: 0}
      ], size: 3},
      { dbkey: "pass_through", label: "Pass Through", size: 3  }
    ]},
    {dbkey: "rate", label: '', collapsible: false, fields: [
      { row: [
        { dbkey: "ceil", label: "Ceil", type: "checkbox", size: 3 },
        { dbkey: "price", label: "Price", type: "number", size: 3},
        { dbkey: "to", label: "To", type: "number", size: 3},
        { dbkey: "interval", label: "Interval", type: "number", size: 3},
      ]},
    ]},
  ]},
];
const params_fields = [
  { dbkey: "source_types", label: "Source Types" },
  { dbkey: "discount", label: "Discount", collapsible: true, collapsed: true, fields: [
    { dbkey: "reason", label: "Reason" },
    { dbkey: "engagement_end_date", label: "Engagement End Date" },
    { dbkey: "service_name", label: "Service Name", type: "array" },
    { dbkey: "services", label: "Services", collapsible: true, collapsed: true, fields: [
      { dbkey: 'next_plan', label: 'Next Plan', collapsible: true, collapsed: true, fields : [
        { dbkey: 'optional', label: 'Optional', type: 'array' },
        { dbkey: 'required', label: 'Required', type: 'array' },
      ]}
    ]},
  ]}
];

const domains_fields = [
  { dbkey: "optional", label: "Optional", type: "array" },
  { dbkey: "optional_with_commitment", label: "Optional With Commitment", type: "array" },
  { dbkey: "required", label: "Required", type: "array" },
];

const rates_discount_edit_view = {
  title: "Edit Discount",
  view_type: "sections",
  sections: [
    {
      display: "inline",
      fields:
      [
        { row: [
          { dbkey: "key", label: "Key", crud: '0100'},
          { dbkey: "_id[$id]", label: "ID", crud: '0100'},
          { dbkey: "name", label: "Name"},
          { dbkey: "vti_name", label: "VTI Name"},
          { dbkey: "tech_name", label: "Technical Name" },
          { dbkey: "reason", label: "Reason" },
          { dbkey: "erp_account", label: "ERP Account" },
        ]},
        { row: [
          { dbkey: "type", label: "Type", size: 4 },
          { dbkey: "vat_type", label: "VAT Type", size: 4 },
          { dbkey: "level", label: "level", size: 4 },
        ]},
        { row: [
          { dbkey: "from", label: "From", type: "date",crud: '0100', size: 4 },
          { dbkey: "to", label: "To", type: "date", size: 4 },
          { dbkey: "end_publication", label: "End Publication", type: "date", size: 4 },
        ]},
        { row: [
          { dbkey: "bill_exclude", label: "Bill Exclude", type:"array" },
        ]},
        { row: [
          { dbkey: "plan_exclude", label: "Plan Exclude", type:"array" },
        ]},
        { row: [
          { dbkey: "domains", label: "Domains", collapsible: true, collapsed: true, fields: domains_fields },
        ]},
        { row: [
          { dbkey: "params", label: "Params", collapsible: true, collapsed: true, fields: params_fields },
        ]},
        { row: [
          { dbkey: "rates", label: "Rates", collapsible: true, collapsed: true, fields: rates_field }
        ]},
      ]
    }
  ]
};

const rates_discount_list_view = {
  title: "",
  view_type: "list",
  sections: [ {
    title: "",
    lists: [ {
      title: "Discounts",
      url: globalSetting.serverUrl + '/api/find?collection=rates',
      controllers : {
        duplicate : { label: 'Duplicate', callback:'onClickCloneItem'},
        closeAndNew : { label: 'Close and New'},
        // edit : { label: 'Edit' },
        delete : { label: 'Delete', color: Colors.red500  },
      },
      fields: [
        {key: 'key', label: 'Key', filter : {}},
        {key: '_id', label: 'ID', type:"mongoid", hidden : true},
        {key: 'type', label: 'Type', filter :  {system : 'discount'}},
        {key: 'date', label: 'Date', type:'urt' ,filter :  { defaultValue : (moment()), query:{'from' : {'$lte':1}, 'to' : {'$gt': 1} }  ,valuePath:{ 'from': {'$lte':null}, 'to' : {'$gt' : null} } } , hidden : true},
        // {key: 'rates', label: 'rates'}
      ],
      onItemClick : 'edit',
    } ]
  } ]
};

const rates_discount_close_and_new_view = {
  title: "Close and new Discount",
  view_type: "sections",
  sections: [
    {
      display: "inline",
      fields: [
        { row: [
          { dbkey: "key", label: "Key", crud: '0100'},
          { dbkey: "name", label: "Name"},
          { dbkey: "vti_name", label: "VTI Name"},
          { dbkey: "tech_name", label: "Technical Name" },
          { dbkey: "reason", label: "Reason" },
          { dbkey: "erp_account", label: "ERP Account" },
        ]},
        { row: [
          { dbkey: "type", label: "Type", size: 4 },
          { dbkey: "vat_type", label: "VAT Type", size: 4 },
          { dbkey: "level", label: "level", size: 4 },
        ]},
        { row: [
          { dbkey: "from", label: "From", type: "date", size: 4 },
          { dbkey: "to", label: "To", type: "date", size: 4 },
          { dbkey: "end_publication", label: "End Publication", type: "date", size: 4 },
        ]},
        { row: [
          { dbkey: "bill_exclude", label: "Bill Exclude", type:"array" },
        ]},
        { row: [
          { dbkey: "plan_exclude", label: "Plan Exclude", type:"array" },
        ]},
        { row: [
          { dbkey: "domains", label: "Domains", collapsible: true, collapsed: true, fields: domains_fields },
        ]},
        { row: [
          { dbkey: "params", label: "Params", collapsible: true, collapsed: true, fields: params_fields },
        ]},
        { row: [
          { dbkey: "rates", label: "Rates", collapsible: true, collapsed: true, fields: rates_field }
        ]},
      ]
    }
  ]
};

const rates_discount_clone_view = {
  title: "Duplicate",
  view_type: "sections",
  sections: [
    {
      display: "inline",
      fields: [
        { row: [
          { dbkey: "key", label: "Key"},
          { dbkey: "name", label: "Name"},
          { dbkey: "vti_name", label: "VTI Name"},
          { dbkey: "tech_name", label: "Technical Name" },
          { dbkey: "reason", label: "Reason" },
          { dbkey: "erp_account", label: "ERP Account" },
        ]},
        { row: [
          { dbkey: "type", label: "Type", size: 4 },
          { dbkey: "vat_type", label: "VAT Type", size: 4 },
          { dbkey: "level", label: "level", size: 4 },
        ]},
        { row: [
          { dbkey: "from", label: "From", type: "date", size: 4 },
          { dbkey: "to", label: "To", type: "date", size: 4 },
          { dbkey: "end_publication", label: "End Publication", type: "date", size: 4 },
        ]},
        { row: [
          { dbkey: "bill_exclude", label: "Bill Exclude", type:"array" },
        ]},
        { row: [
          { dbkey: "plan_exclude", label: "Plan Exclude", type:"array" },
        ]},
        { row: [
          { dbkey: "domains", label: "Domains", collapsible: true, collapsed: true, fields: domains_fields },
        ]},
        { row: [
          { dbkey: "params", label: "Params", collapsible: true, collapsed: true, fields: params_fields },
        ]},
        { row: [
          { dbkey: "rates", label: "Rates", collapsible: true, collapsed: true, fields: rates_field }
        ]},
      ]
    }
  ]
};

const DiscountsView = {
  rates_discount_list_view,
  rates_discount_edit_view,
  rates_discount_close_and_new_view,
  rates_discount_clone_view
};

export default DiscountsView;
