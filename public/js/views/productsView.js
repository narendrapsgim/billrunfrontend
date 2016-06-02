import moment from 'moment';
import * as Colors from 'material-ui/styles/colors';


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
      fields:
      [
        { dbkey: "brand", label: "Brand", size: 10 },
        { dbkey: "model", label: "Model", size: 10 },
        { dbkey: "key", label: "Key", size: 10 },
        { dbkey: "ax_code", label: "AX Code", size: 10 },
        { dbkey: "inventory_id", label: "Inventory ID", size: 10 },
        { dbkey: "type", label: "Type", size: 10 },
        { dbkey: "rates",  label: "Rates", size: 10, collapsible: false, fields:
          [
            { dbkey: "general", label : 'General' ,collapsible: true, collapsed: true, size : 12,
              fields:
              [
                  { dbkey: "price", label: "Price", type: "text"},
                  { dbkey: "price_level", label: "Price Level", type: "text"},
              ]
            },
            { dbkey: "subscription", collapsible: true, collapsed: true, size : 12,
              fields:
              [
                { dbkey: "*", size : 12, collapsible: false,
                  fields:
                  [
                    { dbkey: "price", label: "Price", type: "text"},
                    { dbkey: "price_level", label: "Price Level", type: "text"},
                  ]
                }
              ]
            }
          ]
        },
      ]
    }
  ]
};




const ProductsView = {
  rates_product_edit_view,
  rates_product_list_view,
}

export default ProductsView;
