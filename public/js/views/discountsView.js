import moment from 'moment';
import * as Colors from 'material-ui/styles/colors';


const rates_discount_edit_view = {
  title: "Edit Discount",
  view_type: "sections",
  sections: [
    {
      display: "inline",
      fields:
      [
        { dbkey: "key", label: "Key", crud: '0100',  size: 10 },
        { dbkey: "_id[$id]", label: "ID", crud: '0100',  size: 10 },
        { dbkey: "name", label: "Name", size: 10 },
        { dbkey: "vti_name", label: "VTI Name", size: 10 },
        { dbkey: "tech_name", label: "Technical Name" },
        { dbkey: "reason", label: "Reason" },
        { dbkey: "type", label: "Type", size: 5 },
        { dbkey: "vat_type", label: "VAT Type", size: 5 },
        { dbkey: "level", label: "level" },
        { dbkey: "erp_account", label: "ERP Account" },
        { dbkey: "end_publication", label: "End Publication", type: "date", size: 4 },
        { dbkey: "from", label: "From", type: "date",crud: '0100', size: 4 },
        { dbkey: "to", label: "To", type: "date", size: 4 },
        { dbkey: "name", label: "Name" },
        { dbkey: "domains", label: "Domains", collapsible: true, collapsed: true, fields: [
          { dbkey: "optional", label: "Optional", type: "array" }
        ]},
        { dbkey: "params", label: "Params", collapsible: true, collapsed: true, fields: [
          { dbkey: "discount", label: "Discount", collapsible: true, fields: [
            { dbkey: "service_name", label: "Service Name", type: "array" }
          ]}
        ]},
        { dbkey: "rates",  label: "Rates", fields:
          [
            { dbkey: "*", size : 12, collapsible: false,
              fields:
              [
                {dbkey: "rate", label: '', collapsible: false, fields: [
                  { dbkey: "to", label: "To", type: "number", size: 3},
                  { dbkey: "price", label: "Price", type: "number", size: 3},
                  { dbkey: "interval", label: "Interval", type: "number", size: 3},
                  { dbkey: "ceil", label: "Ceil", type: "toggle", size: 3},
                ]},
                { dbkey: "unit", label: "Unit" }
              ]}
          ]}
      ]}
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
        edit : { label: 'Edit' },
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
      fields:
      [
        { dbkey: "key", label: "Key", crud: '0100',  size: 10 },
        { dbkey: "_id[$id]", label: "ID", crud: '0100',  size: 10 },
        { dbkey: "name", label: "Name", size: 10 },
        { dbkey: "vti_name", label: "VTI Name", size: 10 },
        { dbkey: "tech_name", label: "Technical Name" },
        { dbkey: "reason", label: "Reason" },
        { dbkey: "type", label: "Type", size: 5 },
        { dbkey: "vat_type", label: "VAT Type", size: 5 },
        { dbkey: "level", label: "level" },
        { dbkey: "erp_account", label: "ERP Account" },
        { dbkey: "end_publication", label: "End Publication", type: "date", size: 4 },
        { dbkey: "from", label: "From", type: "date", size: 4 },
        { dbkey: "to", label: "To", type: "date", size: 4 },
        { dbkey: "name", label: "Name" },
        { dbkey: "domains", label: "Domains", collapsible: true, collapsed: true, fields: [
          { dbkey: "optional", label: "Optional", type: "array" }
        ]},
        { dbkey: "params", label: "Params", collapsible: true, collapsed: true, fields: [
          { dbkey: "discount", label: "Discount", collapsible: true, fields: [
            { dbkey: "service_name", label: "Service Name", type: "array" }
          ]}
        ]},
        { dbkey: "rates",  label: "Rates", fields:
          [
            { dbkey: "*", size : 12, collapsible: false,
              fields:
              [
                {dbkey: "rate", label: '', collapsible: false, fields: [
                  { dbkey: "to", label: "To", type: "number", size: 3},
                  { dbkey: "price", label: "Price", type: "number", size: 3},
                  { dbkey: "interval", label: "Interval", type: "number", size: 3},
                  { dbkey: "ceil", label: "Ceil", type: "toggle", size: 3},
                ]},
                { dbkey: "unit", label: "Unit" }
              ]}
          ]}
      ]}
  ]
};

const rates_discount_clone_view = {
  title: "Duplicate",
  view_type: "sections",
  sections: [
    {
      display: "inline",
      fields:
      [
        { dbkey: "key", label: "Key", size: 10 },
        { dbkey: "name", label: "Name", size: 10 },
        { dbkey: "vti_name", label: "VTI Name", size: 10 },
        { dbkey: "tech_name", label: "Technical Name" },
        { dbkey: "reason", label: "Reason" },
        { dbkey: "type", label: "Type", size: 5 },
        { dbkey: "vat_type", label: "VAT Type", size: 5 },
        { dbkey: "level", label: "level" },
        { dbkey: "erp_account", label: "ERP Account" },
        { dbkey: "end_publication", label: "End Publication", type: "date", size: 4 },
        { dbkey: "from", label: "From", type: "date", size: 4 },
        { dbkey: "to", label: "To", type: "date", size: 4 },
        { dbkey: "name", label: "Name" },
        { dbkey: "domains", label: "Domains", collapsible: true, collapsed: true, fields: [
          { dbkey: "optional", label: "Optional", type: "array" }
        ]},
        { dbkey: "params", label: "Params", collapsible: true, collapsed: true, fields: [
          { dbkey: "discount", label: "Discount", collapsible: true, fields: [
            { dbkey: "service_name", label: "Service Name", type: "array" }
          ]}
        ]},
        { dbkey: "rates",  label: "Rates", fields:
          [
            { dbkey: "*", size : 12, collapsible: false,
              fields:
              [
                {dbkey: "rate", label: '', collapsible: false, fields: [
                  { dbkey: "to", label: "To", type: "number", size: 3},
                  { dbkey: "price", label: "Price", type: "number", size: 3},
                  { dbkey: "interval", label: "Interval", type: "number", size: 3},
                  { dbkey: "ceil", label: "Ceil", type: "toggle", size: 3},
                ]},
                { dbkey: "unit", label: "Unit" }
              ]}
          ]}
      ]}
  ]
};

const DiscountsView = {
  rates_discount_list_view,
  rates_discount_edit_view,
  rates_discount_close_and_new_view,
  rates_discount_clone_view
}

export default DiscountsView;
