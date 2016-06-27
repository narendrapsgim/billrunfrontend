import moment from 'moment';
import * as Colors from 'material-ui/styles/colors';

const rates_charge_edit_view = {
  title: "Edit Charge",
  view_type: "sections",
  sections: [
    {
      display: "inline",
      fields: [
        { row: [
          { dbkey: "key", label: "Key", crud: '0100'},
          { dbkey: "_id[$id]", label: "ID", crud: '0100'},
          { dbkey: "name", label: "Name"},
          { dbkey: "tech_name", label: "Tech Name"},
          { dbkey: "vti_name", label: "VTI Name"},
          { dbkey: "reason", label: "Reason"},
          { dbkey: "erp_account", label: "ERP Account"},
        ]},
        { row: [
          { dbkey: "type", label: "Type", size: 4},
          { dbkey: "vat_type", label: "VAT Type", size: 4},
          { dbkey: "level", label: "Level", size: 4},
        ]},
        { row: [
          { dbkey: "end_publication", label: "End Publication", type: "date", size: 4},
          { dbkey: "from", label: "From", type: "date", size: 4},
          { dbkey: "to", label: "To", type: "date", size: 4},
        ]},
        { row: [
          { dbkey: "domains",  label: "Domains", collapsible: true, collapsed: true, fields: [
            { dbkey: "optional", label: "Optional", type: "array"},
          ]},
        ]},
        { row: [
          { dbkey: "params",  label: "Params", collapsible: true, collapsed: true  , fields: [
            { dbkey: "*", collapsible: false, fields: [
              { dbkey: "service_name", label: "Service Name"},
            ]},
          ]},
        ]},
        { row: [
          { dbkey: "rates",  label: "Rates", collapsible: true, collapsed: true  , fields: [
            { dbkey: "*", collapsible: false, fields: [
              { row: [
                { dbkey: "unit", label: "Unit" },
              ]},
              { row: [
                { dbkey: "rate", label: 'Rate', collapsible: true, fields: [
                  { dbkey: "ceil", label: "Ceil", type: "checkbox", size: 3},
                  { dbkey: "price", label: "Price", type: "text", size: 3},
                  { dbkey: "interval", label: "Interval", type: "text", size: 3},
                  { dbkey: "to", label: "To", type: "text", size: 3},
                ]},
              ]},
            ]}
          ]}
        ]},
      ]
    }
  ]
};

const rates_charge_list_view = {
  title: "",
  view_type: "list",
  sections: [ {
    title: "",
    lists: [ {
      title: "Charge",
      url: globalSetting.serverUrl + '/api/find?collection=rates',
      fields: [
        {key: 'tech_name', label: 'Name'},
        {key: 'key', label: 'Key', filter : {}},
        {key: '_id', label: 'ID', type:"mongoid", hidden : true},
        // {key: 'rate_type', label: 'Rate Type'},
        // {key: 'end_publication', label: 'End Publication'},
        {key: 'type', label: 'Type', filter :  {system : 'charge'}},
        {key: 'date', label: 'Date', type:'urt' ,filter :  { defaultValue : (moment()), query:{'from' : {'$lte':1}, 'to' : {'$gt': 1} }  ,valuePath:{ 'from': {'$lte':null}, 'to' : {'$gt' : null} } } , hidden : true},
      ],
      onItemClick : 'edit',
    } ]
  } ]
};

const ChargesView = {
  rates_charge_edit_view,
  rates_charge_list_view
};

export default ChargesView;
