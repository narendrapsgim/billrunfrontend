import * as Colors from 'material-ui/styles/colors';

const logs_list_view = {
  title: "",
  view_type: "list",
  sections: [ {
    title: "",
    lists: [ {
      title: "Log",
      url: globalSetting.serverUrl + '/api/find?collection=log',
      fields: [
        { key: 'source', label: "Source" ,filter:{} ,sortable:true},
        { key: 'retrieved_from', label: "Retrieved from" ,sortable:true},
        { key: 'file_name', label: "Filename",filter:{} ,sortable:true },
        { key: 'received_time', label: "Date received" ,sortable:true},
        { key: 'start_process_time', label: "Start processing time", type:"urt" },
        { key: 'process_time', label: "Date processed" ,sortable:true},
      ],
      onItemClick: 'edit'
    } ]
  } ]
};

const logs_edit_view = {
  title: "Edit File",
  view_type: "sections",
  sections: [
    {
      fields: [
        { dbkey: 'source', label: "Source" },
        { dbkey: 'retrieved_from', label: "Retrieved from" },
        { dbkey: 'file_name', label: "Filename" },
        { dbkey: 'backed_to', label: "Backed to", type:"array" },
        { dbkey: 'received_time', label: "Date received" },
        { dbkey: 'process_time', label: "Date processed" },
        { dbkey: 'received_hostname', label: "Receiving host" },
        { dbkey: 'process_hostname', label: "Process host" },
        { dbkey: 'start_process_time', label: "Start processing time", type:"date" },
      ]
    }
  ]
};


let LogsView = {};
LogsView.logs_list_view = logs_list_view;
LogsView.logs_edit_view = logs_edit_view;

export default LogsView;
