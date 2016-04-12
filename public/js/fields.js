const Fields = {
  pages: {
    dashboard: {
      title: "Dashboard",
      route: "/dashboard",
    },
    plan_setup: {
      title: "Plan Setup",
      route: "/plan-setup",
      view_type: "tabs",
      sections: [
        {
          title: "Basic Settings",
          fields: [
            {
              label: "Plan Name",
              mandatory: true,
              type: "text",
            },
          ],
          sections: [
            {
              title: "Hi!"
            }
          ]
        }
      ]
    }
  }
}

export default Fields
