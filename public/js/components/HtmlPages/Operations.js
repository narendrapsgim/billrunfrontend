import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';

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
    this.onOpenRecreateInvoices = this.onCloseResetSubscription.bind(this);
    this.onCloseRecreateInvoices = this.onCloseRecreateInvoices.bind(this);

    this.state = {
      reset_sub_open: false,
      recreate_open: false
    };
  }

  onOpenResetSubscription() {
    this.setState({reset_sub_open: true});
  }
  onCloseResetSubscription() {
    this.setState({reset_sub_open: false});
  }

  onOpenRecreateInvoices() {
    console.log('test');
    this.setState({recreate_open: true});
  }
  onCloseRecreateInvoices() {
    this.setState({recreate_open: false});
  }  

  render() {
    const resetSubscriptionActions = [
      <FlatButton
          label="Reset"
          primary={true}
          onClick={this.onResetSubscriptions}
      />,
      <FlatButton
          label="Cancel"
          secondary={true}
          onClick={this.onCloseResetSubscription}
      />,      
    ];
    const recreateInvoiceActions = [
      <FlatButton
          label="Recreate"
          primary={true}
          onClick={this.onRecreateInvoices}
      />,
      <FlatButton
          label="Cancel"
          secondary={true}
          onClick={this.onCloseRecreateInvoices}
      />,
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
            Test
          </div>
        </Dialog>

        <Dialog
            title="Recreate invoices for last billrun"
            actions={recreateInvoiceActions}
            open={this.state.recreate_open}
            onRequestClose={this.onCloseRecreateInvoices}
            modal={false} >
          <div>
            Tesgt
          </div>
        </Dialog>

        <Paper zDepth={1} style={styles.content}>
          <RaisedButton
              label="Reset Subscriptions"
              primary={true}
              onClick={this.onOpenResetSubscription}
          />
          <br/>
          <RaisedButton
              label="Recreate Invoices"
              primary={true}
              onClick={this.onOpenRecreateInvoices}
          />
        </Paper>
      </div>
    );
  }
}
