import moment from 'moment';
import * as Colors from 'material-ui/styles/colors';
import ops from '../components/AdvancedFilter/filterOperations';
import LinesView from './linesView';

function onLineClicked(e) {
  console.log(e);
}

const queue_list_view = {
  title : "",
  view_type : "",
  sections : [ {
    title : "",
    description: "",
    lists : [ {
      title : "Queue",
      url : globalSetting.serverUrl + '/api/find?collection=queue',
      fields : [
        {key : 'aid', label : 'AID', type:'number', filter : { defaultValue : ''}},
        {key : 'sid', label : 'SID', type:'number', filter : {}},
        {key : 'calc_name', label : 'Next Stage' , filter: {} },
        //{key : 'calc_time', label : 'Last processed'},
        {key : 'stamp', label : 'Associated line' },
        {key : 'urt', label : 'URT',  type : 'urt', sortable : true},
        {key : 'urt2', label : 'From',  type : 'urt', sortable : true , filter :  { defaultValue : (moment().subtract(2, 'months')), query:{'urt':{'$gt':1}} ,valuePath:{'urt':{'$gt': null}}  }, hidden : true},
        {key : 'urt3', label : 'To',  type : 'urt', sortable : true , filter :  { defaultValue : (moment().add(1, 'months')), query:{'urt':{'$lte':1}} ,valuePath:{'urt':{'$lte':null}}  }, hidden : true},
      ],
      defaults : {
        tableHeight : '500px',
      },
      onItemClick : 'related',
      itemIdField : 'stamp',
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
        },
        {
          key: 'stamp',
          value: "Stamp",
          operators: [ops.in, ops.regex, ops.ne, ops.lt, ops.lte, ops.gt, ops.gte]
        }, {
          key: 'type',
          value: "Type",
          operators: [ops.in, ops.regex, ops.ne, ops.lt, ops.lte, ops.gt, ops.gte]
        },
      ],
    } ]
  } ]
};

const queue_view_view = {
  title: "View queue line",
  view_type: "sections",
  sections: [
    {
      display: "inline",
      fields: [
        { row: [
          { dbkey: "_id[$id]", label: "ID", crud: '0100'},
          { dbkey: "type", label: "Type", crud: '0100'},
        ]},
        { row: [
          { dbkey: "stamp", label: "Associated Line" ,type:'line_stamp', crud: '0100', collapsible: true, collapsed: true, fields: LinesView.lines_edit_view.fields},
        ]},
        { row: [
          {dbkey : 'aid', label : 'AID', type:'number', crud: '0100'},
          {dbkey : 'sid', label : 'SID', type:'number', crud: '0100'},
        ]},
        { row: [
          {dbkey : 'calc_name', label : 'Next Stage' , crud: '0100' },
        ]},
      ]
    }
  ]
};

const QueueView = {
  queue_list_view,
  queue_view_view,
};

export default QueueView;
