const Fields = {
  pages: {
    dashboard: {
      title: "Dashboard",
      route: "/dashboard"
    },
    plan_setup: {
      title: "Plan Setup",
      route: "/plan-setup",
      view_type: "tabs",
      sections: [
        {
          title: "Basic Settings",
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
          fields: [
            { label: "Transation",
              mandatory: true,
              type: "select",
              options: [
                { label: "Every Month", value: "every_month"}
              ]},
            { label: "Cycle",
              type: "number" },
            { label: "Plan Fee",
              type: "number" }
          ]
        },
        {
          title: "Plan Recurring",
          fields: [
          ]
        }
      ]
    }
  }
};

export default Fields;
