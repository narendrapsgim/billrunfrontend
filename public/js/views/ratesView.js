import moment from 'moment';
import * as Colors from 'material-ui/styles/colors';

const ratess_field = [
  { dbkey: "*", collapsible: true, collapsed: true, fields: [
      { row: [
        { dbkey: "access", label: "Access", type: "text", size: 4},
        { dbkey: "currency", label: "Currency", type: "text", size: 4},
        { dbkey: "unit", label: "Unit", type: "text", size: 4},
      ]},
      { row: [
        { dbkey: "erp_account", label: "ERP Account", type: "text"},
      ]},
      { row: [
        { dbkey: "rate", crud: '1110', fieldType: "array", label: "", collapsible: false, fields: [
          { row: [
            { dbkey: "price", label: "Price ", type: "text", size: 4},
            { dbkey: "interval", label: "Interval", type: "text", size: 4},
            { dbkey: "to", label: "To", type: "text", size: 4},
          ], label: ""},
        ]},
      ]},
  ]}
];

const params_field = [
  { row: [
    { dbkey: "customer_segment", label : 'Customer Segment', type: 'array'},
    { dbkey: "source_networks", label : 'Source Networks', type: 'array'},
    { dbkey: "source_prefixes", label : 'Source Prefixes', type: 'array'},
    { dbkey: "source_types", label : 'Source Types', type: 'array'},
  ]},
  { dbkey: "destination", label:"", collapsible: false, fields: [
    { row: [
      { dbkey: "region", label: "Region", type: "text", size: 3},
      { dbkey: "prefix", label: "Prefix", type: "array", size: 6},
    ]},
  ]}
];

const params_field_bulk_edit = [
  { row: [
    { dbkey: "customer_segment", label : 'Customer Segment', type: 'array'},
    { dbkey: "source_networks", label : 'Source Networks', type: 'array'},
    { dbkey: "source_prefixes", label : 'Source Prefixes', type: 'array'},
    { dbkey: "source_types", label : 'Source Types', type: 'array'},
  ]},
  { dbkey: "destination", label:"Prefix", collapsible: false, type:'prefix', key:'region', fields: [
    { row: [
      { dbkey: "region", label: "Region", type: "text", size: 3},
      { dbkey: "prefix", label: "Prefix", type: "array", size: 6},
    ]},
  ]}
];

const rates_list_view = {
  title: "",
  view_type: "list",
  sections: [ {
    title: "",
    lists: [ {
      title: "Rates",
      url: globalSetting.serverUrl + '/api/find?collection=rates',
      fields: [
        {key: 'type', label: 'Type', filter :  {system:'regular'}, hidden : true},
        {key: 'params.destination.prefix', label: 'Prefix', filter :  {}, hidden : true},
        {key: 'params.destination.region', label: 'Region', filter :  {}, hidden : true},
        {key: 'key', label: 'Key', filter : {}, sortable : true},
        {key: 'country', label: 'Country', filter :  {}, hidden: true},
        {key: 'params.source_types', label: 'Source Types', filter:  {}, hidden: true},
        {key: 'params.source_networks', label: 'Source Networks', filter:  {}, hidden: true},
        {key: 'rates.*.erp_account', label: 'ERP Account', filter: { wildcard: [
            'call', 'video', 'forwarded_call', 'forwarded_video', 'incoming_call', 'incoming_video', 'sms', 'sms_acte', 'sms_premium', 'data', 'mms', 'vod'
          ]}, hidden: true},
        {key: 'rates.*.groups', label: 'Groups', filter: { wildcard: [
            'call', 'video', 'forwarded_call', 'forwarded_video', 'incoming_call', 'incoming_video', 'sms', 'sms_acte', 'sms_premium', 'data', 'mms', 'vod'
          ]}, hidden: true},
        {key: 'usaget', label: 'Type', sortable : true},
        {key: 'rate[0].price', label: 'Price'},
        {key: 'rate[0].interval', label: 'Interval', type:'interval'},
        {key: 'access', label: 'Access'},
        {key: 'date', label: 'Date', type:'urt' ,filter :  { defaultValue : (moment()), query:{'from' : {'$lte':1}, 'to' : {'$gt': 1} }  ,valuePath:{ 'from': {'$lte':null}, 'to' : {'$gt' : null} } } , hidden : true},
        {key: 'from', label: 'From', type:"urt", sortable : true, },
        {key: 'to', label: 'To', type:"urt", sortable : true, },
        {key: '_id', label: 'ID', type:"mongoid", sortable : true},
      ],
      project: [ 'key', '_id', 'type', 'rates','from' ,'to'],
      controllers : {
        duplicate : { label: 'Duplicate', callback:'onClickCloneItem'},
        closeAndNew : { label: 'Close and New'},
        edit : { label: 'Edit' },
        delete : { label: 'Delete', color: Colors.red500  },
      },
      pagination : {
        itemsPerPage : 20,
      },
      onItemClick : 'edit',
      defaults : {tableHeight : '450px'}
    } ]
  } ]
};

const rates_edit_view = {
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
          { dbkey: "country", label: "Country", type:'array' },
          { dbkey: "alpha3", label: "Alpha3", type:'array' },
        ]},
        { row: [
          { dbkey: "zone", label: "zone", size: 6},
          { dbkey: "zone_grouping", label: "Zone Grouping", size: 6 },
        ]},
        { row: [
          { dbkey: "from", label: "From", type:'date', size: 6 , crud: '0100'},
          { dbkey: "to", label: "To", type:'date', size: 6},
        ]},
        { row: [
          { dbkey: "rates", crud: '1111', label: "Types", collapsible: true, collapsed: false ,  fields: ratess_field },
        ]},
        { row: [
          { dbkey: "params",  label: "Params", collapsible: true, collapsed: true ,fields: params_field },
        ]},
      ]
    }
  ]
};

const rates_edit_multiple_view = {
  title: "Edit Rates",
  view_type: "sections",
  sections: [
    {
      display: "inline",
      fields: [
        { row: [
          { dbkey: "type", label: "Type"},
          { dbkey: "country", label: "Country", type:'array' },
          { dbkey: "alpha3", label: "Alpha3", type:'array' },
        ]},
        { row: [
          { dbkey: "zone", label: "zone", size: 6},
          { dbkey: "zone_grouping", label: "Zone Grouping", size: 6 },
        ]},
        { row: [
          { dbkey: "from", label: "From", type:'date', size: 6 , crud: '0100'},
          { dbkey: "to", label: "To", type:'date', size: 6},
        ]},
        { row: [
          { dbkey: "rates", crud: '1111', label: "Types", collapsible: true, collapsed: false ,  fields: ratess_field },
        ]},
        { row: [
          { dbkey: "params",  label: "Params", collapsible: true, collapsed: true ,fields: params_field_bulk_edit },
        ]},
      ]
    }
  ]
};
const rates_clone_view = {
  title: "Clone Rate",
  view_type: "sections",
  sections: [
    {
      display: "inline",
      fields: [
        { row: [
          { dbkey: "key", label: "Key"},
          { dbkey: "type", label: "Type"},
          { dbkey: "country", label: "Country", type:'array' },
          { dbkey: "alpha3", label: "Alpha3", type:'array' },
        ]},
        { row: [
          { dbkey: "zone", label: "zone", size: 6},
          { dbkey: "zone_grouping", label: "Zone Grouping", size: 6 },
        ]},
        { row: [
          { dbkey: "from", label: "From", type:'date', size: 6},
        { dbkey: "to", label: "To", type:'date', size: 6},
        ]},
        { row: [
          { dbkey: "rates", crud: '1111', label: "Types", collapsible: true, collapsed: false, fields: ratess_field },
        ]},
        { row: [
          { dbkey: "params",  label: "Params", collapsible: true, collapsed: true, fields: params_field },
        ]},
      ]
    }
  ]
};

const rates_close_and_new_view = {
  title: "Close and Create New Rate",
  view_type: "sections",
  sections: [
    {
      display: "inline",
      fields: [
        { row: [
          { dbkey: "key", label: "Key", crud: '0100'},
          { dbkey: "type", label: "Type"},
          { dbkey: "country", label: "Country", type:'array' },
          { dbkey: "alpha3", label: "Alpha3", type:'array' },
        ]},
        { row: [
          { dbkey: "zone", label: "zone", size: 6},
          { dbkey: "zone_grouping", label: "Zone Grouping", size: 6 },
        ]},
        { row: [
          { dbkey: "from", label: "From", type:'date', size: 6},
        { dbkey: "to", label: "To", type:'date', size: 6},
        ]},
        { row: [
          { dbkey: "rates", crud: '1111', label: "Types", collapsible: true, collapsed: false, fields: ratess_field },
        ]},
        { row: [
          { dbkey: "params", crud: '1111', label: "Params", collapsible: true, collapsed: true, fields: params_field },
        ]},
      ]
    }
  ]
};

const RatesView = {
  rates_edit_view,
  rates_edit_multiple_view,
  rates_list_view,
  rates_clone_view,
  rates_close_and_new_view
};

export default RatesView;
