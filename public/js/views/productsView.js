import moment from 'moment';
import * as Colors from 'material-ui/styles/colors';

const rates_field = [
  { dbkey: "general", label : 'General' ,collapsible: true, collapsed: true, fields: [
    { row: [
      { dbkey: "price", label: "Price", type: "text", size: 6 },
      { dbkey: "price_level", label: "Price Level", type: "text", size: 6 },
    ]},
  ]},
  { dbkey: "subscription", collapsible: true, collapsed: true, fields: [
    { dbkey: "*", collapsible: false, fields: [
      { row: [
        { dbkey: "price", label: "Price", size: 6 },
        { dbkey: "price_level", label: "Price Level", size: 6 },
      ]}
    ]}
  ]}
];

const rates_product_list_view = {
  title: "",
  view_type: "list",
  sections: [ {
    title: "",
    lists: [ {
      title: "Products",
      url: globalSetting.serverUrl + '/api/find?collection=rates',
      fields: [
        {key: '_id', label: 'ID', type:"mongoid", hidden : true},
        {key: 'type', label: 'Type', filter :  {system : 'product'}, hidden : true},
        {key: 'key', label: 'Key', filter : {}},
        {key: 'brand', label: 'Brand', filter : {}},
        {key: 'model', label: 'Model', filter : {}},
        {key: 'date', label: 'Date', type:'urt' ,filter :  { defaultValue : (moment()), query:{'from' : {'$lte':1}, 'to' : {'$gt': 1} }  ,valuePath:{ 'from': {'$lte':null}, 'to' : {'$gt' : null} } } , hidden : true},
        // {key: 'rates', label: 'rates'}
      ],
      onItemClick : 'edit',
    } ]
  } ]
};

const rates_product_edit_view = {
  title: "Edit Product",
  view_type: "sections",
  sections: [
    {
      display: "inline",
      fields: [
        { row: [
          { dbkey: "_id[$id]", label: "ID", crud: '0100', size: 6 },
          { dbkey: "type", label: "Type",crud: '0100', size: 6 },
        ]},
        { row: [
          { dbkey: "key", label: "Key", crud: '0100'},
        ]},
        { row: [
          { dbkey: "brand", label: "Brand", size: 6 },
          { dbkey: "model", label: "Model", size: 6 },
        ]},
        { row: [
          { dbkey: "ax_code", label: "AX Code", size: 6 },
          { dbkey: "inventory_id", label: "Inventory ID", size: 6 },
        ]},
        { row: [
          { dbkey: "from", label: "From", type: 'date', size: 6},
          { dbkey: "to", label: "To", type: 'date', size: 6},
        ]},
        { row: [
          { dbkey: "rates",  label: "Rates", collapsible: false, fields: rates_field },
        ]},
      ]}
  ]
};




const ProductsView = {
  rates_product_edit_view,
  rates_product_list_view,
};

export default ProductsView;
