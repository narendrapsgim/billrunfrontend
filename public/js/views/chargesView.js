import moment from 'moment';
import * as Colors from 'material-ui/styles/colors';

const rates_charge_edit_view = {
  title: "Edit Charge",
  view_type: "sections",
  sections: [
    {
      display: "inline",
      fields: [
        { dbkey: "name", label: "Name", size: 10 },
        { dbkey: "tech_name", label: "Tech Name", size: 10 },
        { dbkey: "vti_name", label: "VTI Name", size: 10 },
        { dbkey: "reason", label: "Reason", size: 10 },
        { dbkey: "key", label: "Key", size: 10 },
        { dbkey: "type", label: "Type", size: 10 },

        { dbkey: "domains",  label: "Domains", size: 10, collapsible: true, collapsed: true  ,
          fields: [
            { dbkey: "optional", label: "Optional", type: "array", size: 10},
          ]
        },

        { dbkey: "params",  label: "Params", size: 10, collapsible: true, collapsed: true  , fields:
          [
            { dbkey: "*", size : 12, collapsible: false,
              fields:
              [
                  { dbkey: "service_name", label: "Service Name", type: "text", size: 10},
              ]
            },
          ]
        },


        { dbkey: "rates",  label: "Rates", size: 10, collapsible: true, collapsed: true  , fields:
          [
            { dbkey: "*", size : 12, collapsible: false,
              fields:
              [
                { dbkey: "rate", label: 'Rate', size : 12, collapsible: true,
                  fields:
                  [
                    { dbkey: "price", label: "Price", type: "text", size: 3},
                    { dbkey: "interval", label: "Interval", type: "text", size: 3},
                    { dbkey: "to", label: "To", type: "text", size: 3},
                    { dbkey: "ceil", label: "Ceil", type: "toggle", size: 3},
                  ]
                },
                { dbkey: "unit", label: "Unit", size: 10 },
              ]
            }
          ]
        }
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
}

export default ChargesView;
