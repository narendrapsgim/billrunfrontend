import moment from 'moment';
import * as Colors from 'material-ui/styles/colors';

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
        edit : { label: 'Edit' },
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
      // title: "Test",
      display: "inline",
      fields:
      [
        { dbkey: "key", label: "Key", size: 10 },
        { dbkey: "type", label: "Type", size: 10 },
        { dbkey: "params", label: "Params", collapsible: true, collapsed: false, fields:
          [
            { dbkey: "*", collapsible: true, collapsed: true,
              fields:
              [
                { dbkey: "*", collapsible: true, collapsed: true,
                  fields:
                  [
                    { dbkey: "rules", label: "Rules", fields:
                      [
                        { dbkey: "alpha3", label: "Alpha3" },
                        { dbkey: "interco", label: "Interconnect" },
                        { dbkey: "category", label: "Category" },
                        { dbkey: "customer_segment", label: "Customer Segment" }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },
        { dbkey: "rates", label: "Types", collapsible: true, collapsed: false ,  fields:
          [
            { dbkey: "*", collapsible: true, collapsed: true,
              fields:
              [
                { dbkey: "base_account", label: "Base Account", type: "text"},
                { dbkey: "fae_vat_account", label: "Fae VAT Account", type: "text"},
                { dbkey: "vat_account", label: "VAT Account", type: "text"},
                { dbkey: "rate", label: "Rates", collapsible: true, collapsed: true ,  fields:
                  [
                        { dbkey: "interval", label: "Interval", type: "text"},
                        { dbkey: "percent", label: "Percent", type: "text"},
                        { dbkey: "to", label: "To", type: "text"},
                  ]
                },
              ]
            }
          ]
        },
      ]
    }
  ]
};


const rates_vat_close_and_new_view = {
  title: "Close and new Rate",
  view_type: "sections",
  sections: [
    {
      // title: "Test",
      display: "inline",
      fields:
      [
        { dbkey: "key", label: "Key", crud: "0010", size: 10 },
        { dbkey: "type", label: "Type", size: 10 },
        { dbkey: "params", label: "Params", collapsible: true, collapsed: false, fields:
          [
            { dbkey: "*", collapsible: true, collapsed: true,
              fields:
              [
                { dbkey: "*", collapsible: true, collapsed: true,
                  fields:
                  [
                    { dbkey: "rules", label: "Rules", fields:
                      [
                        { dbkey: "alpha3", label: "Alpha3" },
                        { dbkey: "interco", label: "Interconnect" },
                        { dbkey: "category", label: "Category" },
                        { dbkey: "customer_segment", label: "Customer Segment" }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },
        { dbkey: "rates", label: "Types", collapsible: true, collapsed: false ,  fields:
          [
            { dbkey: "*", collapsible: true, collapsed: true,
              fields:
              [
                { dbkey: "base_account", label: "Base Account", type: "text"},
                { dbkey: "fae_vat_account", label: "Fae VAT Account", type: "text"},
                { dbkey: "vat_account", label: "VAT Account", type: "text"},
                { dbkey: "rate", label: "Rates", collapsible: true, collapsed: true ,  fields:
                  [
                        { dbkey: "interval", label: "Interval", type: "text"},
                        { dbkey: "percent", label: "Percent", type: "text"},
                        { dbkey: "to", label: "To", type: "text"},
                  ]
                },
              ]
            }
          ]
        },
      ]
    }
  ]
};

const rates_vat_duplicate_view = Object.assign({}, rates_vat_edit_view, {title: "Duplicate"});

const VatsView = {
  rates_vat_list_view,
  rates_vat_edit_view,
  rates_vat_close_and_new_view,
  rates_vat_duplicate_view
}

export default VatsView;
