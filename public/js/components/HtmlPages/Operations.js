import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';

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

export default class OperationsPage extends Component {
  constructor(props) {
    super(props);
    this.onOpenResetSubscription = this.onOpenResetSubscription.bind(this);
    this.onCloseResetSubscription = this.onCloseResetSubscription.bind(this);
    this.onOpenRecreateInvoices = this.onOpenRecreateInvoices.bind(this);
    this.onCloseRecreateInvoices = this.onCloseRecreateInvoices.bind(this);
    this.onResetSubscriptions = this.onResetSubscriptions.bind(this);
    this.onRecreateInvoices = this.onRecreateInvoices.bind(this);
    this.onSelectFile = this.onSelectFile.bind(this);
    this.onChangeSID = this.onChangeSID.bind(this);
    this.onChangeAccountIds = this.onChangeAccountIds.bind(this);

    this.state = {
      reset_sub_open: false,
      recreate_open: false
    };
  }

  onOpenResetSubscription() {
    this.setState({reset_sub_open: true});
  }
  onCloseResetSubscription() {
    this.setState({reset_sub_open: false, files: null});
  }

  onOpenRecreateInvoices() {
    this.setState({recreate_open: true});
  }
  onCloseRecreateInvoices() {
    this.setState({recreate_open: false, files: null});
  }  

  onResetSubscriptions() {
    let data = new FormData();
    if(this.state.files){
      $.each(this.state.files, (key, value) => {
        data.append(key, value);
      });
    } else {
      data.append('sid', this.state.sid);
    }
    $.ajax({
      url: `${globalSetting.serverUrl}/api/resetlines`,
      type: "POST",
      data: data,
      dataType: 'json',
      processData: false, // Don't process the files
      contentType: false // Set content type to false as jQuery will tell the server its a query string request
    }).done(resp => {
      if (resp.status) {
        // Success!
      }
    });
  }

  onRecreateInvoices() {
    let data = new FormData();
    if(this.state.files){
      $.each(this.state.files, (key, value) => {
        data.append('account_id', value);
      });
    } else {
      data.append('account_id', this.state.account_id);
    }
    $.ajax({
      url: `${globalSetting.serverUrl}/api/recreateinvoices`,
      type: "POST",
      data: data,
      dataType: 'json',
      processData: false, // Don't process the files
      contentType: false // Set content type to false as jQuery will tell the server its a query string request
    }).done(resp => {
      if (resp.status) {
        // Success!
      }
    });
  }
  
  onSelectFile(e) {
    this.setState({files: e.target.files});
  }

  onChangeSID(e, value) {
    this.setState({sid: value});
  }

  onChangeAccountIds(e, value) {
    this.setState({account_id: value});
  }

  render() {
    const resetSubscriptionActions = [
      <FlatButton
          label="Cancel"
          secondary={true}
          onClick={this.onCloseResetSubscription}
      />,      
      <FlatButton
          label="Reset"
          primary={true}
          onClick={this.onResetSubscriptions}
      />
    ];
    const recreateInvoiceActions = [
      <FlatButton
          label="Cancel"
          secondary={true}
          onClick={this.onCloseRecreateInvoices}
      />,
      <FlatButton
          label="Recreate"
          primary={true}
          onClick={this.onRecreateInvoices}
      />
    ];

    return (
      <div className="jumbotron hero-unit">
        <Dialog
            title="Reset lines for current billrun"
            actions={resetSubscriptionActions}
            open={this.state.reset_sub_open}
            onRequestClose={this.onCloseResetSubscription}
            modal={false} >
          <div>
            <TextField
                hintText="Enter SID"
                floatingLabelText="Enter SID"
                onChange={this.onChangeSID}
            />
            <RaisedButton
                label="Or select file"
                primary={true}
            >
              <input onChange={this.onSelectFile} type="file" style={styles.exampleImageInput} />
            </RaisedButton>
          </div>
        </Dialog>

        <Dialog
            title="Recreate invoices for last billrun"
            actions={recreateInvoiceActions}
            open={this.state.recreate_open}
            onRequestClose={this.onCloseRecreateInvoices}
            modal={false} >
          <div>
            <TextField
                hintText="Enter account ids"
                floatingLabelText="Enter account ids"
                onChange={this.onChangeAccountIds}
            />
            <RaisedButton
                label="Or select file"
                primary={true}
            >
              <input onChange={this.onSelectFile} type="file" style={styles.exampleImageInput} />
            </RaisedButton>
          </div>
        </Dialog>

        <Paper zDepth={1} style={styles.content}>
          <RaisedButton
              label="Reset Subscriptions"
              primary={true}
              style={styles.button}
              onClick={this.onOpenResetSubscription}
          />
          <RaisedButton
              label="Recreate Invoices"
              style={styles.button}
              primary={true}
              onClick={this.onOpenRecreateInvoices}
          />
        </Paper>
      </div>
    );
  }
}
