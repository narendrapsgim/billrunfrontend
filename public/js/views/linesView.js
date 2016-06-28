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
        {key : 'usaget', label : 'Usage', type:'select', filter : {
          options: [
            { value: "Flat", key: "flat"},
            { value: "Conditional Discount", key: "conditional_discount"},
            { value: "Option", key: "option"},
            { value: "Credit", key: "credit"},
            { value: "Call", key: "call"},
            { value: "Incoming Call", key: "incoming_call"},
            { value: "SMS", key: "sms"},
            { value: "MMS", key: "sms"},
            { value: "Data", key: "data"},
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
           {key : 'urt2', label : 'From',  type : 'urt', sortable : true ,filter :  { defaultValue : (moment().subtract(2, 'months')), query:{'urt':{'$gt':1}} ,valuePath:{'urt':{'$gt': null}}  }, hidden : true},
           {key : 'urt3', label : 'To',  type : 'urt', sortable : true ,filter :  { defaultValue : (moment().add(1, 'months')), query:{'urt':{'$lte':1}} ,valuePath:{'urt':{'$lte':null}}  }, hidden : true},
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
          //options: ['Call', 'Data',] -> User for select list with options
        }, {
          key: 'calling_number',
          value: "Calling Number",
          operators: [ ops.in, ops.regex, ops.ne, ops.lt, ops.lte, ops.gt, ops.gte ],
        }, {
          key: 'aprice',
          value: "Charge",
          operators: [ops.in, ops.regex, ops.ne, ops.lt, ops.lte, ops.gt, ops.gte]
        }, {
          key: 'credit_type',
          value: "Credit type",
          operators: [ops.in, ops.regex, ops.ne, ops.lt, ops.lte, ops.gt, ops.gte]
        }, {
          key: 'File',
          value: "file",
          operators: [ops.in, ops.regex, ops.ne, ops.lt, ops.lte, ops.gt, ops.gte]
        }, {
          key: 'Imsi',
          value: "imsi",
          operators: [ops.in, ops.regex, ops.ne, ops.lt, ops.lte, ops.gt, ops.gte]
        }, {
          key: 'in_circuit_group',
          value: "In Circuit Group",
          operators: [ops.in, ops.regex, ops.ne, ops.lt, ops.lte, ops.gt, ops.gte]
        }, {
          key: 'out_circuit_group',
          value: "Out Circuit Group",
          operators: [ops.in, ops.regex, ops.ne, ops.lt, ops.lte, ops.gt, ops.gte]
        }, {
          key: 'out_plan',
          value: "Out Plan",
          operators: [ops.in, ops.regex, ops.ne, ops.lt, ops.lte, ops.gt, ops.gte]
        }, {
          key: 'over_plan',
          value: "Over Plan",
          operators: [ops.in, ops.regex, ops.ne, ops.lt, ops.lte, ops.gt, ops.gte]
        }, {
          key: 'plan',
          value: "Plan",
          operators: [ops.in, ops.regex, ops.ne, ops.lt, ops.lte, ops.gt, ops.gte]
        }, {
          key: 'process_time',
          value: "Process Time",
          operators: [ops.in, ops.regex, ops.ne, ops.lt, ops.lte, ops.gt, ops.gte]
        }, {
          key: 'arate',
          value: "Rate",
          operators: [ops.in, ops.regex, ops.ne, ops.lt, ops.lte, ops.gt, ops.gte]
        }, {
          key: 'record_type',
          value: "Record Type",
          operators: [ops.in, ops.regex, ops.ne, ops.lt, ops.lte, ops.gt, ops.gte]
        }, {
          key: 'service_name',
          value: "Service Name",
          operators: [ops.in, ops.regex, ops.ne, ops.lt, ops.lte, ops.gt, ops.gte]
        }, {
          key: 'serving_network',
          value: "Serving Network",
          operators: [ops.in, ops.regex, ops.ne, ops.lt, ops.lte, ops.gt, ops.gte]
        }, {
          key: 'stamp',
          value: "Stamp",
          operators: [ops.in, ops.regex, ops.ne, ops.lt, ops.lte, ops.gt, ops.gte]
        }, {
          key: 'type',
          value: "Type",
          operators: [ops.in, ops.regex, ops.ne, ops.lt, ops.lte, ops.gt, ops.gte]
        }, {
          key: 'usagev',
          value: "Usage volume",
          operators: [ops.in, ops.regex, ops.ne, ops.lt, ops.lte, ops.gt, ops.gte]
        }, {
          key: 'arategroup',
          value: "Rate Group",
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
