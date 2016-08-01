import moment from 'moment';
import * as Colors from 'material-ui/styles/colors';

const params_fields = [
  { dbkey: "*", collapsible: true, collapsed: true, fields: [
    { dbkey: "*", collapsible: true, collapsed: true, fields: [
      { dbkey: "rules", label: "", collapsible: false, fields: [
        { row: [
          { dbkey: "alpha3", label: "Alpha3", size: 2 },
          { dbkey: "customer_segment", label: "Customer Segment", size: 3 },
          { dbkey: "category", label: "Category", size: 3 },
          { dbkey: "interco", label: "Interconnect", size: 2},
          { dbkey: "tax_exempt", label: "Tax Exempt", size: 2 },
        ]},
      ]}
    ]}
  ]}
];

const rates_fields = [
  { dbkey: "*", collapsible: true, collapsed: true, fields: [
    { row: [
      { dbkey: "base_account", label: "Base Account", size: 4},
      { dbkey: "fae_vat_account", label: "Fae VAT Account", size: 4},
      { dbkey: "vat_account", label: "VAT Account", size: 4},
    ]},
    { dbkey: "rate", label: "", collapsible: false, fields: [
      { row: [
        { dbkey: "percent", label: "Percent", size: 4},
        { dbkey: "interval", label: "Interval", size: 4},
        { dbkey: "to", label: "To", size: 4},
      ]},
    ]},
  ]}
];

const rates_vat_list_view = {
  title: "",
  view_type: "list",
  sections: [ {
    title: "",
    lists: [ {
      title: "VAT",
      url: globalSetting.serverUrl + '/api/find?collection=rates',
      fields: [
        {key: 'key', label: 'Key', filter : {}},
        {key: '_id', label: 'ID', type:"mongoid", hidden : true},
        {key: 'type', label: 'Type', filter :  {system:'vat'}},
        {key: 'date', label: 'Date', type:'urt' ,filter :  { defaultValue : (moment()), query:{'from' : {'$lte':1}, 'to' : {'$gt': 1} }  ,valuePath:{ 'from': {'$lte':null}, 'to' : {'$gt' : null} } } , hidden : true},
        // {key: 'rates', label: 'rates'}
      ],
      controllers : {
        duplicate : { label: 'Duplicate', callback:'onClickCloneItem'},
        closeAndNew : { label: 'Close and New'},
        // edit : { label: 'Edit' },
        delete : { label: 'Delete', color: Colors.red500  },
      },
      pagination : {
        itemsPerPage : 10,
      },
      onItemClick : 'edit',
    } ]
  } ]
};

const rates_vat_edit_view = {
  title: "Edit Rate",
  view_type: "sections",
  sections: [
    {
      display: "inline",
      fields: [
        { row: [
          { dbkey: "key", label: "Key", crud: '0100'},
          { dbkey: "_id[$id]", label: "ID", crud: '0100'},
          { dbkey: "type", label: "Type"},
        ]},
        { row: [
          { dbkey: "from", label: "From", type: 'date', crud: '0100', size: 6},
          { dbkey: "to", label: "To", type: 'date', size: 6},
        ]},
        { row: [
          { dbkey: "params", label: "Params", collapsible: true, collapsed: false, fields: params_fields},
        ]},
        { row: [
          { dbkey: "rates", label: "Rates", collapsible: true, collapsed: false, fields: rates_fields},
        ]},
      ]
    }
  ]
};

const rates_vat_close_and_new_view = {
  title: "Close and new Rate",
  view_type: "sections",
  sections: [
    {
      display: "inline",
      fields: [
        { row: [
          { dbkey: "key", label: "Key", crud: '0100'},
          { dbkey: "type", label: "Type"},
        ]},
        { row: [
          { dbkey: "from", label: "From", type: 'date', size: 6},
          { dbkey: "to", label: "To", type: 'date', size: 6},
        ]},
        { row: [
          { dbkey: "params", label: "Params", collapsible: true, collapsed: false, fields: params_fields},
        ]},
        { row: [
          { dbkey: "rates", label: "Rates", collapsible: true, collapsed: false, fields: rates_fields},
        ]},
      ]
    }
  ]
};

const rates_vat_duplicate_view = {
  title: "Duplicate Vat",
  view_type: "sections",
  sections: [
    {
      display: "inline",
      fields: [
        { row: [
          { dbkey: "key", label: "Key"},
          { dbkey: "type", label: "Type"},
        ]},
        { row: [
          { dbkey: "from", label: "From", type: 'date', size: 6},
          { dbkey: "to", label: "To", type: 'date', size: 6},
        ]},
        { row: [
          { dbkey: "params", label: "Params", collapsible: true, collapsed: false, fields: params_fields},
        ]},
        { row: [
          { dbkey: "rates", label: "Rates", collapsible: true, collapsed: false, fields: rates_fields},
        ]},
      ]
    }
  ]
};

const VatsView = {
  rates_vat_list_view,
  rates_vat_edit_view,
  rates_vat_close_and_new_view,
  rates_vat_duplicate_view
};

export default VatsView;
