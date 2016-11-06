import moment from 'moment';
import * as Colors from 'material-ui/styles/colors';
import ops from '../components/AdvancedFilter/filterOperations';

const billrun_dates = Array.from(Array(12), (x, z) => {
  let d = new Date();
  d.setMonth(d.getMonth() - z);
  let m = (("0" + (d.getMonth() + 1)).slice(-2));
  let y =  d.getFullYear();
  return {key: y + m, value: y + "/" + m};
});

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
        {key : 'stamp', label : '', type: 'subrow'},
        {key : 'aid', label : 'AID', type:'number', filter : { defaultValue : ''}},
        {key : 'sid', label : 'SID', type:'number', filter : {}},
        //{key : 'arate', label : 'Rate', type:'rate_ref'},
        {key : 'plan', label : 'plan'},
        {key : 'type', label : 'Type'},
        {key : 'urt', label : 'Usage time', type : 'urt', sortable : true},
        {key : 'usaget', label : 'Usage', type:'select', filter : {
          options: [
            { value: "-", key: ""},
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
        {key : 'aprice', label : 'Charge', type:'number'},
        {key : 'billrun', label : 'Billrun', type:'multiselect', filter : { options: billrun_dates, query:{'billrun':{'$in':1}} ,valuePath:{'billrun':{'$in': null}}}, hidden : true},
        {key : 'urt2', label : 'From',  type : 'urt', sortable : true ,filter :  { defaultValue : (moment().subtract(2, 'months')), query:{'urt':{'$gt':1}} ,valuePath:{'urt':{'$gt': null}}  }, hidden : true},
        {key : 'urt3', label : 'To',  type : 'urt', sortable : true ,filter :  { defaultValue : (moment().add(1, 'months')), query:{'urt':{'$lte':1}} ,valuePath:{'urt':{'$lte':null}}  }, hidden : true},
      ],
      defaults : {
        tableHeight : '750px',
      },
      onItemClick : 'edit',
      controllers : {
        export : { label: 'Export', callback:'onClickExport'},
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
          key: 'file',
          value: "File",
          operators: [ops.in, ops.regex, ops.ne, ops.lt, ops.lte, ops.gt, ops.gte]
        }, {
          key: 'imsi',
          value: "IMSI",
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

const lines_edit_view = {
  title: "Edit line",
  view_type: "sections",
  sections: [
    {
      display: "inline",
      fields: [
        { row: [
          { dbkey: "_id[$id]", label: "ID", crud: '0100', size:3},
          { dbkey: "type", label: "Type", size:3},
          { dbkey: "usaget", label: "Usage Type" , size:3},
        ]},
        { row: [
          {dbkey : 'aid', label : 'AID', type:'number', size:3},
          {dbkey : 'sid', label : 'SID', type:'number', size:3},
        ]},
        { row: [
          { dbkey: "imsi", label: "IMSI"},

          { dbkey: "country", label: "Origin Country", size:3},
          { dbkey: "destination", label: "Destination", size:3},
          { dbkey: "plan", label: "Plan"},
          { dbkey: "calling_number", label: "Calling number", size:3},
          { dbkey: "called_number", label: "called number", size:3},
        ]},
        { row: [
          { dbkey: "usagev", label: "Volume" , size:3},
          { dbkey: "urt", label: "Usage time" , type:'date', size:3},
          { dbkey: "process_time", label: "Process time", size:3},
          { dbkey : 'aprice', label : 'Charge', type:'number'},
        ]},
        { row: [
          { dbkey: "cdr_id", label: "CDR ID", size:4},
          { dbkey: "subscriber_num", label: "Susbscriber number", size:4},
          { dbkey: "cra_type", label: "CRA Type", size:4},
          { dbkey: "date", label: "Raw date", size:4},
          { dbkey: "start_time", label: "Raw date", size:4},
          { dbkey: "number_type", label: "Identification Number type", size:4},
          { dbkey: "number", label: "Identification Number", size:4},
          { dbkey: "service_type", label: "Service type", size:4},
          { dbkey: "network_source", label: "network source", size:4},
          { dbkey: "bts_origin", label: "BTS origin", size:4},
          { dbkey: "sp_value", label: "SP value", size:4},

        ]},

      ]
    }
  ]
};

const LinesView = {
  lines_list_view,
  lines_edit_view,
};

export default LinesView;
