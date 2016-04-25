const lines_list_view = {
  title : "Plans and Items",
  view_type : "list",
  sections : [ {
    title : "",
    lists : [ {
      url : 'http://billrunmt.local/api/query',
      fields : [
        {key : 'aid', label : 'AID', filter : true}, // aid=5000000476
        {key : 'sid', label : 'SID', filter : true},
        {key : 'service_name', label : 'Service Name'},
        {key : 'service_type', label : 'Service Type'},
        {key : 'plan', label : 'plan'},
        {key : 'type', label : 'Type'},
      ],
      pagination : {
        itemsPerPage : 5,
      },
      defaults : {
        tableHeight : '700px',
      }
    } ]
  } ]
};

const plans_list_view = {
  title : "Plans and Items",
  view_type : "list",
  sections : [ {
    title : "",
    lists : [ {
      url : 'http://billrun/api/plans',
      fields : [
        {key : 'invoice_label', label : 'Label', filter : true},
        {key : 'invoice_type', label : 'Type'},
        {key : 'grouping', label : 'Grouping'},
        {key : 'price', label : 'Price', type : 'price', filter : true},
        {key : 'forceCommitment', label : 'Force Commitment', type : 'boolean'},
        {key : 'key', label : 'Key'},
      ],
      pagination : {
        itemsPerPage : 5,
      },
      defaults : {
        tableHeight : '700px',
      }
    } ]
  } ]
};

const plan_edit_view = {
  title: "Edit Plan",
  view_type: "sections",
  sections: [
    {
      title: "Test",
      display: "inline",
      fields:
      [
         { dbkey: "name", label: "Name", size: 10 },
        // { dbkey: "technical_name", label: "Technical Name", size: 10 },
        // { dbkey: "params", label: "Params",
        //   fields:
        //   [
        //     { dbkey: "destination", label: "Destination", type: "array", size: 10 }
        //   ]
        // },
        // { dbkey: "options", label: "Options", fields:
        //   [
        //     { dbkey: "*", collapsible: true, collapsed: true,
        //       fields:
        //       [
        //         { dbkey: "name", label: "Name", type: "text" },
        //         { dbkey: "price", label: "Price", type: "number" }
        //       ]
        //     }
        //   ]
        // }
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
  pages : {
    dashboard : {title : "Dashboard"},
    plans : {
      title : "Plans and Items",
      views : {edit : plan_edit_view, list : plans_list_view}
    },
    plan_setup :
        {title : "Plan Setup", view_type : "tabs", tabs : plan_setup_tabs}
  }
};

export default View;
