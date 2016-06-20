import moment from 'moment';
import * as Colors from 'material-ui/styles/colors';


const option_fields = [
  { dbkey: "name", label: "Name", type: "text"},
  { dbkey: "tech_name", label: "Technical Name", type: "text" },
  { dbkey: "vti_name", label: "VTI Name", type: "text" },
  { dbkey: "invoice_label", label: "Invoice Label" },
  { dbkey: "price", label: "Price", type: "number", size: "6" },
  { dbkey: "erp_account", label: "ERP Account" },
  { dbkey: "type", label: "Type", size: "4"},
  { dbkey: "vat_type", label: "VAT Type", size: "4" },
  { dbkey: "invoice_type", label: "Invoice type", type: "text", size: "4" },
  { dbkey: "grouping", label: "Grouping", size: "6" },
  { dbkey: "display_order", label: "Display Order", type: "number" , size: "6"},
  { dbkey: "included", label: "Included", type: "select", size: "6", options: [
    { label: "Yes", value: 1},
    { label: "No", value: 0}
  ]},
  { dbkey: "limited_access", label: "Limited Access", type: "select", size: "6", options: [
    { label: "Yes", value: 1},
    { label: "No", value: 0}
  ]},
  { dbkey: "excludes", label: "Excludes",  type: "array" },
  { dbkey: "depends", label: "Depends", type: "array" },
  { dbkey: "parameters", label: "Parameters", type: "array" },
  { dbkey: "display_in", label: "Display In", collapsible: false,  fields: [
    { dbkey: "all", label: "All", type: "array" }
  ]},
  { dbkey: "properties", label: "Properties", collapsible: false,fields: [
    { dbkey: "volume", label: "Volume", type: "number" }
  ]},
  { dbkey: "provisioning", label: "Provisioning", collapsible: true, collapsed: true, fields: [
    { dbkey: "POM_TAG", label: "POM Tag", size: "6"  },
    { dbkey: "GROUPING", label: "Grouping", size: "6" },
    { dbkey: "OBJECT_NAME", label: "Object Name", type: "array" },
    { dbkey: "ACTIONS", label: "Actions", type: "array" },
    { dbkey: "PARAMETERS", label: "Parameters", type: "array" },
  ]},
  { dbkey: "include", crud: '1111', label: "Include",  collapsible: true, collapsed: true, fields:
    [
      { dbkey: "call", label: "Call", type: "number", size: 4 },
      { dbkey: "incoming_call", label: "Incoming Call", type: "number", size: 4 },
      { dbkey: "forwarded_call", label: "Forwarded Call", type: "number", size: 4 },
      { dbkey: "video", label: "Incoming Video", type: "number", size: 4 },
      { dbkey: "incoming_video", label: "Incoming Video", type: "number", size: 4 },
      { dbkey: "forwarded_video", label: "Forwarded Video", type: "number", size: 4 },
      { dbkey: "sms", label: "sms", type: "number", size: 4 },
      { dbkey: "mms", label: "mms", type: "number", size: 4 },
    ]
  },
  { dbkey: "max_usage", crud: '1111', label: "Max Usage", collapsible: true, collapsed: true, fields:
    [
      { dbkey: "call", label: "Call", type: "number", size: 4 },
      { dbkey: "incoming_call", label: "Incoming Call", type: "number", size: 4 },
      { dbkey: "forwarded_call", label: "Forwarded Call", type: "number", size: 4 },
      { dbkey: "video", label: "Incoming Video", type: "number", size: 4 },
      { dbkey: "incoming_video", label: "Incoming Video", type: "number", size: 4 },
      { dbkey: "forwarded_video", label: "Forwarded Video", type: "number", size: 4 },
      { dbkey: "sms", label: "sms", type: "number", size: 4 },
      { dbkey: "mms", label: "mms", type: "number", size: 4 },
    ]
  },
];

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
      display: "inline",
      fields:
      [
        { dbkey: "_id[$id]", label: "ID", size: 10, crud: '0100' },
        { dbkey: "name", label: "Name", size: 10, mandatory: true, crud: '0100' },
        { dbkey: "technical_name", label: "Technical label", size: 10 },
        { dbkey: "key", label: "Key", size: 10 },
        { dbkey: "invoice_label", label: "Invoice Label" },
        { dbkey: "price", label: "Price", size: 10 , type: "number" },
        { dbkey: "provisioning", label: "Provisioning", type: "array" },
        { dbkey: "erp_account", label: "ERP Account", size: 10 },
        { dbkey: "display_order", label: "Display Order", type: 'number', size: 6 },
        { dbkey: "grouping", label: "Grouping", size: "3"  },
        { dbkey: "vat_type", label: "VAT Type", size: "3"  },
        { dbkey: "invoice_type", label: "Invoice Type", size: "3"  },
        { dbkey: "from", label: "From", type: "date", size: 5, crud: '0100' },
        { dbkey: "to", label: "To", type: "date", size: 5 },
        { dbkey: "forceCommitment", label: "Force Commitment", size: 10 , type: "checkbox"},
        { dbkey: "commitment", label: "Commitment", collapsible: true, collapsed: true, fields: [
          { dbkey: "price", label: "Price" },
          { dbkey: "duration", label: "Duration" },
          { dbkey: "interval", label: "Interval" }
        ]},
        { dbkey: "options", label: "Options", collapsible: true, collapsed: true, fields:
          [ { dbkey: "*", collapsible: true, collapsed: true, fields: option_fields } ]
        },
        { dbkey: "not_billable_options", label: "Options (not billable)", collapsible: true, collapsed: true, size: 10  ,  fields:
          [ { dbkey: "*", collapsible: true, collapsed: true, fields: option_fields } ]
        },
        { dbkey: "params",  label: "Params", size: 10, collapsible: true, collapsed: true ,fields:
          [
            { dbkey: "destination", label:" ", collapsible: false, size : 11,
              fields:
              [
                { dbkey: "region", label: "Region", type: "text"},
                { dbkey: "prefix", label: "Prefix", type: "array"},
              ]
            }
          ]
        }
      ]
    }
  ]
};

const plans_clone_view = {
  title: "Duplicate Plan",
  view_type: "sections",
  sections: [
    {
      display: "inline",
      fields:
      [
        { dbkey: "name", label: "Name", size: 10, mandatory: true},
        { dbkey: "technical_name", label: "Technical label", size: 10 },
        { dbkey: "key", label: "Key", size: 10 },
        { dbkey: "invoice_label", label: "Invoice Label" },
        { dbkey: "price", label: "Price", size: 10 , type: "number" },
        { dbkey: "provisioning", label: "Provisioning", type: "array" },
        { dbkey: "erp_account", label: "ERP Account", size: 10 },
        { dbkey: "display_order", label: "Display Order", type: 'number', size: 6 },
        { dbkey: "grouping", label: "Grouping", size: "3"  },
        { dbkey: "vat_type", label: "VAT Type", size: "3"  },
        { dbkey: "invoice_type", label: "Invoice Type", size: "3"  },
        { dbkey: "from", label: "From", type: "date", size: 5},
        { dbkey: "to", label: "To", type: "date", size: 5 },
        { dbkey: "forceCommitment", label: "Force Commitment", size: 10 , type: "checkbox"},
        { dbkey: "commitment", label: "Commitment", collapsible: true, collapsed: true, fields: [
          { dbkey: "price", label: "Price" },
          { dbkey: "duration", label: "Duration" },
          { dbkey: "interval", label: "Interval" }
        ]},
        { dbkey: "options", label: "Options", collapsible: true, collapsed: true, fields:
          [ { dbkey: "*", collapsible: true, collapsed: true, fields: option_fields } ]
        },
        { dbkey: "not_billable_options", label: "Options (not billable)", collapsible: true, collapsed: true, size: 10  ,  fields:
          [ { dbkey: "*", collapsible: true, collapsed: true, fields: option_fields } ]
        },
        { dbkey: "params",  label: "Params", size: 10, collapsible: true, collapsed: true ,fields:
          [
            { dbkey: "destination", label:" ", collapsible: false, size : 11,
              fields:
              [
                { dbkey: "region", label: "Region", type: "text"},
                { dbkey: "prefix", label: "Prefix", type: "array"},
              ]
            }
          ]
        }
      ]
    }
  ]
};

const plans_close_and_new_view = {
  title: "Close And New Plan",
  view_type: "sections",
  sections: [
    {
      display: "inline",
      fields:
      [
        { dbkey: "name", label: "Name", size: 10, mandatory: true, crud: '0100' },
        { dbkey: "technical_name", label: "Technical label", size: 10 },
        { dbkey: "key", label: "Key", size: 10 },
        { dbkey: "invoice_label", label: "Invoice Label" },
        { dbkey: "price", label: "Price", size: 10 , type: "number" },
        { dbkey: "provisioning", label: "Provisioning", type: "array" },
        { dbkey: "erp_account", label: "ERP Account", size: 10 },
        { dbkey: "display_order", label: "Display Order", type: 'number', size: 6 },
        { dbkey: "grouping", label: "Grouping", size: "3"  },
        { dbkey: "vat_type", label: "VAT Type", size: "3"  },
        { dbkey: "invoice_type", label: "Invoice Type", size: "3"  },
        { dbkey: "from", label: "From", type: "date", size: 5},
        { dbkey: "to", label: "To", type: "date", size: 5 },
        { dbkey: "forceCommitment", label: "Force Commitment", size: 10 , type: "checkbox"},
        { dbkey: "commitment", label: "Commitment", collapsible: true, collapsed: true, fields: [
          { dbkey: "price", label: "Price" },
          { dbkey: "duration", label: "Duration" },
          { dbkey: "interval", label: "Interval" }
        ]},
        { dbkey: "options", label: "Options", collapsible: true, collapsed: true, fields:
          [ { dbkey: "*", collapsible: true, collapsed: true, fields: option_fields } ]
        },
        { dbkey: "not_billable_options", label: "Options (not billable)", collapsible: true, collapsed: true, size: 10  ,  fields:
          [ { dbkey: "*", collapsible: true, collapsed: true, fields: option_fields } ]
        },
        { dbkey: "params",  label: "Params", size: 10, collapsible: true, collapsed: true ,fields:
          [
            { dbkey: "destination", label:" ", collapsible: false, size : 11,
              fields:
              [
                { dbkey: "region", label: "Region", type: "text"},
                { dbkey: "prefix", label: "Prefix", type: "array"},
              ]
            }
          ]
        }
      ]
    }
  ]
};


const PlansView = {
  plans_list_view,
  plans_edit_view,
  plans_clone_view,
  plans_close_and_new_view
};

export default PlansView;
