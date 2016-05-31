import moment from 'moment';
import * as Colors from 'material-ui/styles/colors';

const plans_list_view = {
  title : "",
  view_type : "list",
  sections : [ {
    title : "",
    lists : [ {
      title : "Plans",
      url : globalSetting.serverUrl + '/api/find?collection=plans',
      fields : [
        {key : '_id', label : 'ID', type : 'mongoid', hidden : true}, // aid=5000000476
        {key : 'technical_name', label : 'Label', filter : {}, sortable : true},
        {key : 'invoice_type', label : 'Type', sortable : true},
        {key : 'grouping', label : 'Grouping', filter : {}},
        {key : 'price', label : 'Price', type : 'price', filter : {}, sortable : true},
        {key : 'forceCommitment', label : 'Force Commitment', type : 'boolean'},
        {key : 'from', label : 'From',  type : 'urt', sortable : true },
        {key: 'date', label: 'Date', type:'urt' ,filter :  { defaultValue : (moment()), query:{'from' : {'$lte':1}, 'to' : {'$gt': 1} }  ,valuePath:{ 'from': {'$lte':null}, 'to' : {'$gt' : null} } } , hidden : true},
      ],
      onItemClick : 'edit',
      controllers : {
        duplicate : { label: 'Duplicate', callback:'onClickCloneItem'},
        // new : { label: 'New'},
        closeAndNew : { label: 'Close and New'},
        // edit : { label: 'Edit'},
        // delete : { label: 'Delete', color: red500  },
      },
      defaults : {
        tableHeight : '500px',
      }
    } ]
  } ]
};

const plans_edit_view = {
  title: "Edit Plan",
  view_type: "sections",
  sections: [
    {
      // title: "Test",
      display: "inline",
      fields:
      [
        { dbkey: "technical_name", label: "Technical label", size: 10 },
        { dbkey: "name", label: "Name", size: 10, mandatory: true },
        { dbkey: "key", label: "Key", size: 10 },
        { dbkey: "price", label: "Price", size: 10 , type: "number" },
        { dbkey: "display_order", label: "Display Order", size: 10 },
        { dbkey: "invoice_type", label: "Invoice Type", size: 10 },
        { dbkey: "from", label: "From", type: "date", size: 5 },
        { dbkey: "to", label: "To", type: "date", size: 5 },
        { dbkey: "options", label: "Options", collapsible: true, collapsed: true, fields:
          [
            { dbkey: "*", collapsible: true, collapsed: true,
              fields:
              [
                { dbkey: "name", label: "Name", type: "text" },
                { dbkey: "price", label: "Price", type: "number" },
              ]
            }
          ]
        },
        { dbkey: "not_billable_options", label: "Options (not billable)", collapsible: true, collapsed: true, size: 10  ,  fields:
          [
            { dbkey: "*", collapsible: true, collapsed: true,
              fields:
              [
                { dbkey: "name", label: "Name", type: "text"},
                { dbkey: "display_order", label: "Display Order", type: "number"},
              ]
            }
          ]
        },
        { dbkey: "forceCommitment", label: "Force Commitment", size: 10 , type: "checkbox"},
      ]
    }
  ]
};

const plans_new_view = Object.assign({}, plans_edit_view, {title: "New Plan"});

const plans_clone_view = Object.assign({}, plans_edit_view, {title: "Clone Plan"});

const plans_close_and_new_view = Object.assign({}, plans_edit_view, {title: "Close And New Plan"});

const PlansView = {
  plans_list_view,
  plans_edit_view,
  plans_new_view,
  plans_clone_view,
  plans_close_and_new_view
}

export default PlansView;
