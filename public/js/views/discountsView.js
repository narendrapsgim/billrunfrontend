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
        { dbkey: "vti_name", label: "VTI Name", size: 10 },
        { dbkey: "key", label: "Key", size: 10 },
        { dbkey: "type", label: "Type", size: 10 },
        { dbkey: "rates",  label: "Rates", size: 10, collapsible: true, collapsed: true  , fields:
          [
            { dbkey: "*", size : 12, collapsible: false,
              fields:
              [
                  { dbkey: "units", label: "Unit", type: "text", size: 3},
                  { dbkey: "value", label: "Value", type: "text", size: 3},
                  { dbkey: "ceil", label: "Ceil", type: "toggle", size: 3},
              ]
            },
          ]
        }
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
      fields: [
        {key: 'key', label: 'Key', filter : {}},
        {key: '_id', label: 'ID', type:"mongoid", hidden : true},
        {key: 'rate_type', label: 'Rate Type'},
        {key: 'type', label: 'Type', filter :  {system : 'discount'}},
        {key: 'zone', label: 'Zone'},
        {key: 'date', label: 'Date', type:'urt' ,filter :  { defaultValue : (moment()), query:{'from' : {'$lte':1}, 'to' : {'$gt': 1} }  ,valuePath:{ 'from': {'$lte':null}, 'to' : {'$gt' : null} } } , hidden : true},
        // {key: 'rates', label: 'rates'}
      ],
      onItemClick : 'edit',
    } ]
  } ]
};

const DiscountsView = {
  rates_discount_list_view,
  rates_discount_edit_view
}

export default DiscountsView;
