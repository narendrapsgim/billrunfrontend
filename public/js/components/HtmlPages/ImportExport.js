import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import DownloadIcon from 'material-ui/svg-icons/file/cloud-download';
import UploadIcon from 'material-ui/svg-icons/file/cloud-upload';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import Dialog from 'material-ui/Dialog';
import DatePicker from 'material-ui/DatePicker';
import moment from 'moment';

import aja from 'aja';
import $ from 'jquery';

const styles = {
  button: {
    margin: 12,
  },
  content:{
    textAlign: 'center',
  },
  exampleImageInput: {
    cursor: 'pointer',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    width: '100%',
    opacity: 0,
  },
};


export default class ImportExport extends Component {
  constructor(props) {
    super(props);
    this.onImportClick = this.onImportClick.bind(this);
    this.onExportClick = this.onExportClick.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.onChangeFilterDate = this.onChangeFilterDate.bind(this);

    this.state = {import_modal_open: false, modal_message: "",processing:false};
  }

  onImportClick(e){
    let debugParam = globalSetting.serverApiDebug ? '?'+globalSetting.serverApiDebugQueryString : '';
    let form = this.refs['importForm'];
    this.setState({processing:true});
    if(e.target.files.length){
      var data = new FormData();
      $.each(e.target.files, (key, value) => {
        data.append(key, value);
      });
      $.ajax({
	url: `${globalSetting.serverUrl}/api/importpriceslist${debugParam}`,
	type: "POST",
	data: data,
	dataType: 'json',
	processData: false, // Don't process the files
	contentType: false // Set content type to false as jQuery will tell the server its a query string request
      }).done(resp => {
        if (resp.status == "1") {
	  let reasons = {	"updated": "Updated",
		         "new": "Newly created rates",
		         "future": "Rates that were not imported due to an existing future rate",
		         "missing_category": "Rates that were not updated because they miss category",
		         "not_changed" : "Rates that were not updated because they allready the same in the DB",
		         "old": "Inactive rates not imported",
		         "updated_and_closed" : "Updated, But closed before the configured end date due to existing future rate",
		         "irregular" : "Irregular rates that weren't imported"};
	  let output = "";
	  $.each(resp.keys, (key, value) => {
	    if (value.length) {
	      output += "<div class='imported-reason imported-reason"+key+"'><span class='imported-reason-title'>" + reasons[key] + "</span>: <span class='imported-keys'>" + value.join(", ") + "</span></div>";
	    }
	  });
          this.setState({modal_message: output,import_modal_open: true});
        }
      }).fail(errresp => {
                  this.setState({
                                  modal_message: "Network error when importing rates.",
                                  import_modal_open: true,
                                });
     }).always(balh => {  this.setState({ processing:false });  });
    }
  }

  onExportClick(e){
    let debugParam = globalSetting.serverApiDebug ? '&'+globalSetting.serverApiDebugQueryString : '';
    let { serverUrl } = globalSetting;
    let activeDate = moment(this.exportDate).format("YYYY/MM/DD HH:mm:ss");
    document.getElementById('my_iframe').src = `${globalSetting.serverUrl}/admin/exportplans?export_time=${activeDate}${debugParam}`;
  }

  onChangeFilterDate(key ,nullEvent, value) {
    this.exportDate = value;
  }

  forma7tDate(date){
    return (moment(date).format(globalSetting.dateFormat)) ;
  }


  handleOpen() {
    this.setState({import_modal_open: true});
  };

  handleClose() {
    this.setState({import_modal_open: false});
  };

  render() {
    const modal_actions = [
      <FlatButton
        label="Okay"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleClose}
      />,
    ];

    return (
      <div className="jumbotron hero-unit">
        <h3>Import / Export</h3>
        <iframe id="my_iframe" style={{display: "none"}}></iframe>
        <Paper zDepth={1} style={styles.content}>
          <RaisedButton
            label="Import"
            labelPosition="before"
            primary={true}
            style={styles.button}
            icon={<UploadIcon />}
            disabled={this.state.processing}
          >
          <form ref="importForm" encType="multipart/form-data" action={globalSetting.serverUrl} method="POST">
            <input type="file" style={styles.exampleImageInput} onChange={this.onImportClick} multiple="multiple" disabled={this.state.processing} />
          </form>
          </RaisedButton>

           <Divider />
           <DatePicker hintText={"Enter active date"} container="inline" mode="landscape"
                               floatingLabelText={"Select active export date"} key="Select active export date" name="export_active_date"  defaultDate={new Date()}
                               onChange={this.onChangeFilterDate.bind(null, "export_active_date")} autoOk={true}
                               formatDate={this.formatDate} />
          <RaisedButton
            label="Export"
            labelPosition="before"
            primary={true}
            icon={<DownloadIcon />}
            style={styles.button}
            onClick={this.onExportClick}
            disabled={this.state.processing}
          />
        </Paper>
        <Dialog
            title="Import Successful!"
            actions={modal_actions}
            modal={false}
            open={this.state.import_modal_open}
            onRequestClose={this.handleClose}
            autoScrollBodyContent={true}
        >
          <div dangerouslySetInnerHTML={{__html: this.state.modal_message}}></div>
        </Dialog>
     </div>
    );
  }
}


/*

*/
