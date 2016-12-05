const MenuItems = [
  {
    id:'dashboard',
    title:'Dashboard',
    icon:'fa-dashboard',
    route:'dashboard',
    show:true,
  },
  {
    id:'products',
    title:'Products',
    icon:'fa-book',
    route:'products',
    show:true,
  },
  {
    id:'prepaid',
    title:'Prepaid',
    icon:'fa-cubes',
    route:'',
    show:true,
    subMenus:[
      {
        id:'prepaid',
        title:'Plans',
        icon:'',
        route:'prepaid_plans',
        show:true,
      },
      {
	id: 'charging',
	title: 'Charging',
	icon: '',
	route: 'charging_plans',
	show: true
      },
      {
	id: 'prepaid_includes',
	title: 'Buckets',
	icon: '',
	route: 'prepaid_includes',
	show: true
      }
    ]
  },
  {
    id:'postpaid',
    title:'Postpaid',
    icon:'fa-puzzle-piece',
    route:'',
    show:true,
    subMenus:[
      {
        id:'postpaid',
        title:'Plans',
        icon:'',
        route:'plans',
        show:true,
      },
      {
        id:'services',
        title:'Services',
        icon:'',
        route:'services',
        show:true,
      }      
    ]
  },
  {
    id:'customers',
    title:'Customers',
    icon:'fa-users',
    route:'customers',
    show:true,
  },
  {
    id:'usage',
    title:'Usage',
    icon:'fa-list',
    route:'usage',
    show:true,
  },
  {
    id:'invoices',
    title:'Invoices',
    icon:'fa-file-text-o',
    route:'invoices',
    show:true,
  },
  {
    id:'users',
    title:'User Management',
    icon:'fa-user',
    route:'users',
    show:true,
  },
  {
    id:'audit-trail',
    title:'Audit Trail',
    icon:'fa-history',
    route:'audit-trail',
    show:true,
  },
  {
    id:'settings',
    title:'Settings',
    icon:'fa-cog',
    route:'',
    show:true,
    subMenus:[
      {
        id:'generalSettings',
        title:'General Settings',
        icon:'',
        route:'settings',
        show:true,
      },
      {
        id:'input_processors',
        title:'Input Processors',
        icon:'',
        route:'input_processors',
        show:true,
      },
      {
        id:'export_generators',
        title:'Export Generators',
        icon:'',
        route:'export_generators',
        show:true,
      },
      {
        id:'payment_gateways',
        title:'Payment Gateways',
        icon:'',
        route:'payment_gateways',
        show:true,
      },
      {
        id:'collections',
        title:'Collections',
        icon:'',
        route:'collections',
        show:true,
      },
      {
        id:'invoice-template',
        title:'Invoice Template',
        icon:'',
        route:'invoice-template',
        show:true,
      },
      {
        id: 'custom_fields',
        title: "Custom Fields",
        icon: '',
        route: 'custom_fields',
        show: true
      }
    ]
  },

];

export default MenuItems;
