import globalSetting from './globalSetting';
import {red500, blue500} from 'material-ui/styles/colors';

const dashboard_html = {
  title : "",
  view_type : "",
  sections : [ {
    html :  `<div class="jumbotron hero-unit">
          		<h1>BillRun!</h1>
          		<p>The powerful Billing system.</p>
          		<p><a href="http://billrun.net" target="_blank" class="btn btn-primary btn-large">Learn more »</a></p>
    	       </div>`
  } ]
}
const lines_list_view = {
  title : "",
  view_type : "",
  sections : [ {
    title : "",
    description: "",
    lists : [ {
      title : "Lines",
      url : globalSetting.serverUrl + '/api/query',
      fields : [
        {key : 'aid', label : 'AID', filter : { defaultValue : '5000000429,5000000986,5000000476'}}, // aid=5000000476
        {key : 'sid', label : 'SID', filter : {}},
        {key : 'service_name', label : 'Service Name'},
        {key : 'service_type', label : 'Service Type'},
        {key : 'plan', label : 'plan'},
        {key : 'type', label : 'Type'},
        {key : 'urt', label : 'URT',  type : 'urt', sortable : true},
      ],
      pagination : {
        itemsPerPage : 10,
      },
      defaults : {
        tableHeight : '500px',
      }
    } ]
  } ]
};

const lines_edit_view = {
  title: "Edit Line",
  view_type: "sections",
  sections: [
    {
      // title: "Test",
      display: "inline",
      fields: []
    }
  ]
};

const rates_list_view = {
  title: "Rates",
  view_type: "list",
  sections: [ {
    title: "",
    lists: [ {
      url: globalSetting.serverUrl + '/api/rates',
      fields: [
        {key: 'key', label: 'Key'},
        {key: '_id', label: 'ID'},
        {key: 'type', label: 'Type'},
        {key: 'zone', label: 'Zone'}
      ],
    } ]
  } ]
};

const rates_new_view = {
  title: "New Rate",
  view_type: "sections",
  sections: [
    {
      display: "inline",
      fields: [
        { dbkey: "key", label: "Key", size: 10, mandatory: true }
      ]
    }
  ]
};

const plans_list_view = {
  title : "",
  view_type : "list",
  sections : [ {
    title : "",
    lists : [ {
      title : "Plans",
      url : globalSetting.serverUrl + '/api/plans',
      fields : [
        {key : 'invoice_label', label : 'Label', filter : {filterType : 'query'}, sortable : true},
        {key : 'invoice_type', label : 'Type', sortable : true},
        {key : 'grouping', label : 'Grouping', filter : {filterType : 'query'}},
        {key : 'price', label : 'Price', type : 'price', sortable : true},
        {key : 'forceCommitment', label : 'Force Commitment', type : 'boolean'},
        {key : 'from', label : 'From',  type : 'urt', sortable : true, filter : {filterType : 'query'}},
      ],
      onItemClick : 'edit',
      controllers : {
        duplicate : { label: 'Duplicate',callback:'onClickCloneItem'},
        new : { label: 'New'},
        edit : { label: 'Edit'},
        delete : { label: 'Dalate', color: red500  },
      },
      defaults : {
        tableHeight : '500px',
      }
    } ]
  } ]
};

const plans_new_view = {
  title: "New Plan",
  view_type: "sections",
  sections: [
    {
      display: "inline",
      fields: [
        { dbkey: "name", label: "Name", size: 10, mandatory: true },
        /* { dbkey: "test", label: "Test", size: 10, type: "select", options: [
           { label: "Option 1", value: "option_1" },
           { label: "Option 2", value: "option_2" }
           ] } */
      ]
    }
  ]
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
        { dbkey: "invoice_label", label: "Invoice label", size: 10 },
        { dbkey: "name", label: "Name", size: 10, mandatory: true },
        { dbkey: "key", label: "Key", size: 10 },
        { dbkey: "price", label: "Price", size: 10 , type: "number" },
        { dbkey: "display_order", label: "Display Order", size: 10 },
        { dbkey: "invoice_type", label: "Invoice Type", size: 10 },
        { dbkey: "options", label: "Options", collapsible: true, collapsed: true, fields:
          [
            { dbkey: "*", collapsible: true, collapsed: false,
              fields:
              [
                { dbkey: "name", label: "Name", type: "text" },
                { dbkey: "price", label: "Price", type: "number" },
              ]
            }
          ]
        },
        { dbkey: "not_billable_options", label: "Options (not billable)", collapsible: true, collapsed: true, size: 18  ,  fields:
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

const plan_setup_tabs = [
  {
    title: "Plan Settings",
    sections: [
      {
        title: "Basic Settings",
        description: "Basic settings of the plan",
        fields: [
          { dbkey: "name",
            label: "Plan Name",
            mandatory: true,
            type: "text" },
          { dbkey: "description",
            label: "Plan Description",
            mandatory: false,
            type: "textarea" }
        ]
      },
      {
        title: "Trial",
        display: "inline",
        fields: [
          { label: "Transation",
            mandatory: true,
            type: "select",
            size: 3,
            options: [
              { label: "Every Month", value: "every_month"}
            ]},
          { label: "Cycle",
            type: "number",
            size: 2,
            dbkey: "trial-cycle" },
          { label: "Plan Fee",
            type: "number",
            size: 3 }
        ]
      },
      {
        title: "Plan Recurring",
        description: "Recurring charges of the plan",
        fields: [
          { label: "Priodical Rate",
            type: "number",
            size: 2 },
          { label: "Each",
            type: "number",
            size: 1 },
          { type: "select",
            options: [
              { label: "Every Month", value: "every_month"}
            ],
            size: 2,
            dbkey: "each_select" },
          { label: "Cycle",
            dbkey: "recurring-cycle",
            type: "number",
            size: 1 },
          { label: "Validity",
            type: "date",
            dbkey: "from",
            size: 3 },
          { type: "date",
            dbkey: "to",
            size: 3 }
        ]
      }
    ]
  },
  {
    title: "Add Item"
  },
  {
    title: "Whaddup!"
  }
];

const View = {
  pages: {
    dashboard: {
      menu_title: "Dashboard",
      view_type: "html",
      html : dashboard_html
    },
    rates: {
      menu_title: "Rates",
      route: "rates/rates/list",
      views: {
        list: rates_list_view,
        new: rates_new_view
      }
    },
    plans: {
      menu_title: "Plans",
      route: "plans/plans/list",
      views: {
        list: plans_list_view,
        new: plans_new_view,
        edit: plans_edit_view
      }
    },
    lines: {
      menu_title: "Lines",
      route: "lines/lines/list",
      views: {
        list: lines_list_view,
        edit: lines_edit_view
      }
    },
    // plan_setup: {
    //   title: "Plan Setup",
    //   menu_title: "Plan Setup",
    //   view_type: "tabs",
    //   tabs: plan_setup_tabs
    // }
  }
};

export default View;
