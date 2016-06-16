import moment from 'moment';
import * as Colors from 'material-ui/styles/colors';


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
        {key : 'plan', label : 'plan',  filter : {}},
        {key : 'type', label : 'Type',  filter : {}},
        {key : 'urt', label : 'URT',  type : 'urt', sortable : true},
        {key : 'urt2', label : 'From',  type : 'urt', sortable : true ,filter :  { defaultValue : (moment().subtract(2, 'months')), query:{'urt':{'$gt':1}} ,valuePath:{'urt':{'$gt': null}}  }, hidden : true},
        {key : 'urt3', label : 'To',  type : 'urt', sortable : true ,filter :  { defaultValue : (moment().add(1, 'months')), query:{'urt':{'$lte':1}} ,valuePath:{'urt':{'$lte':null}}  }, hidden : true},
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

const LinesView = {
  lines_list_view,
}

export default LinesView;
