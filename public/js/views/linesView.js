import moment from 'moment';
import * as Colors from 'material-ui/styles/colors';
import ops from '../components/AdvancedFilter/filterOperations';


const lines_list_view = {
  title : "",
  view_type : "",
  sections : [ {
    title : "",
    description: "",
    lists : [ {
      title : "Lines",
      url : globalSetting.serverUrl + '/api/find?collection=lines',
      aggregate: {
        groupBy : [
                  {label : "SID" , key : "sid"},
                  {label : "AID" , key : "aid"},
                  {label : "Called Number" , key : "called_number"},
                	{label : "Calling Number" , key : "calling_number"},
                  ],
         fields : [
                    {label : "Usage" , key : "usagev"},
                    {label : "price" , key : "aprice"},
                    {label : "Market price" , key : "apr"},
                  ],
        methods : [
                    {label : "Sum" , key : "$sum"},
                    {label : "Minimum" , key : "$min"},
                    {label : "Maximum" , key : "$max"},
                    {label : "Avarege" , key : "$avg"},
                  ]
      },
      fields : [
        {key : 'aid', label : 'AID', type:'number', filter : { defaultValue : ''}},
        {key : 'sid', label : 'SID', type:'number', filter : {}},
        {key : 'service_name', label : 'Service Name'},
        {key : 'service_type', label : 'Service Type'},
        {key : 'plan', label : 'plan'},
        {key : 'type', label : 'Type'},
        {key : 'urt', label : 'URT',  type : 'urt', sortable : true},
        {key : 'urt2', label : 'From',  type : 'urt', sortable : true ,filter :  { defaultValue : (moment().subtract(2, 'months')), query:{'urt':{'$gt':1}} ,valuePath:{'urt':{'$gt': null}}  }, hidden : true},
        {key : 'urt3', label : 'To',  type : 'urt', sortable : true ,filter :  { defaultValue : (moment().add(1, 'months')), query:{'urt':{'$lte':1}} ,valuePath:{'urt':{'$lte':null}}  }, hidden : true},
        {key : 'usaget', label : 'Usage', type:'select', filter : {
          options: [
            { value: "Flat", key: "flat"},
            { value: "Conditional Discount", key: "conditional_discount"},
            { value: "Option", key: "option"},
            { value: "Credit", key: "credit"}
          ]}, hidden : true},
        {key : 'billrun', label : 'Billrun', type:'multiselect', filter : {
          options:
            Array.from(Array(12), (x, z) => {
              let d = new Date();
              d.setMonth(d.getMonth() - z);
              let m = (("0" + (d.getMonth() + 1)).slice(-2));
              let y =  d.getFullYear();
              return {key: y + m, value: y + "/" + m};
            }),
           query:{'billrun':{'$in':1}} ,valuePath:{'billrun':{'$in': null}}}, hidden : true},
      ],
      pagination : {
        itemsPerPage : 10,
      },
      defaults : {
        tableHeight : '500px',
      },
      advancedFilter : [
        {
          key: 'called_number',
          value: "Called number",
          operators: [ ops.in, ops.regex, ops.ne, ops.lt, ops.lte, ops.gt, ops.gte ],
        }, {
          key: 'aprice',
          value: "Charge",
          operators: [ops.regex],
          options: ['Call', 'Data',]
        }, {
          key: 'credit_type',
          value: "Credit type",
          operators: [ops.in]
        }, {
          key: 'plan',
          value: "Plan",
          operators: [ops.in, ops.regex, ops.ne, ops.lt, ops.lte, ops.gt, ops.gte]
        },
      ],
    } ]
  } ]
};

const LinesView = {
  lines_list_view,
};

export default LinesView;
