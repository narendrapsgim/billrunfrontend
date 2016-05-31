import moment from 'moment';
import * as Colors from 'material-ui/styles/colors';


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
      // title: "Test",
      display: "inline",
      fields:
      [
        { dbkey: "key", label: "Key", size: 10 },
        { dbkey: "type", label: "Type", size: 10 },
        { dbkey: "country", label: "Country", type:'array' },
        { dbkey: "alpha3", label: "Alpha3", type:'array' },
        { dbkey: "zone", label: "zone"},
        { dbkey: "zone_grouping", label: "Zone Grouping" },
        { dbkey: "from", label: "From", type:'date'},
        { dbkey: "to", label: "To", type:'date'},
        { dbkey: "rates", crud: '1110', label: "Types", collapsible: true, collapsed: false ,  fields:
          [
            { dbkey: "*", collapsible: true, collapsed: true,
              fields:
              [
                { dbkey: "access", label: "Access", type: "text"},
                { dbkey: "currency", label: "Currency", type: "text"},
                { dbkey: "unit", label: "Unit", type: "text"},
                { dbkey: "erp_account", label: "ERP Account", type: "text"},
                { dbkey: "rate", crud: '1110', fieldType: "array", label: "Rates", collapsible: true, collapsed: true ,  fields:
                  [
                        { dbkey: "interval", label: "Interval", type: "text"},
                        { dbkey: "to", label: "To", type: "text"},
                        { dbkey: "price", label: "Price ", type: "text"},
                  ]
                },
              ]
            }
          ]
        },
        { dbkey: "params",  label: "Params", size: 10, collapsible: true, collapsed: true ,fields:
          [
            { dbkey: "customer_segment", label : 'Customer Segment', type: 'array'},
            { dbkey: "source_types", label : 'Source Types', type: 'array'},
            { dbkey: "destination", label:" ", collapsible: false, size : 11,
              fields:
              [
                { dbkey: "region", label: "Region", type: "text"},
                { dbkey: "prefix", label: "Prefix", type: "array"},
              ]
            }
          ]
        },
      ]
    }
  ]
};

const rates_new_view = Object.assign({}, rates_edit_view, {title: "New Rate"});

const rates_clone_view = Object.assign({}, rates_edit_view, {title: "Clone Rate"});

const rates_close_and_new_view = Object.assign({}, rates_edit_view, {title: "Close and Create New Rate"});


const RatesView = {
  rates_list_view,
  rates_new_view,
  rates_clone_view,
  rates_close_and_new_view
}
export default RatesView;
