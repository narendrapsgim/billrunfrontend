const View = {
  pages: {
    dashboard: {
      title: "Dashboard",
      route: "/dashboard"
    },
    plan_setup: {
      title: "Plan Setup",
      route: "/plan-setup",
      view_type: "tabs",
      tabs: [
        {
          title: "Plan Settings",
          sections: [
            {
              title: "Basic Settings",
              description: "Basic settings of the plan",
              fields: [
                { label: "Plan Name",
                  mandatory: true,
                  type: "text" },
                { label: "Plan Description",
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
                  size: 2 },
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
                  dbkey: "cycle",
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
          title: "Yo people!"
        },
        {
          title: "Whaddup!"
        }
      ]
    }
  }
};

export default View;
