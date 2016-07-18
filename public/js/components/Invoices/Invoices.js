import React, { Component } from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';
import { getInvoices } from '../../actions/invoicesActions';
import moment from 'moment';

import { Table, TableHeader, TableRow, TableHeaderColumn, TableRowColumn, TableBody } from 'material-ui/Table';
import FileDownload from 'material-ui/svg-icons/file/file-download';


class Invoices extends Component {
  constructor(props) {
    super(props);

    this.downloadInvoice = this.downloadInvoice.bind(this);
  }

  componentWillMount() {
    this.props.dispatch(getInvoices());
  }

  downloadInvoice(aid, billrun_key, invoice_id) {
    let url = `${globalSetting.serverUrl}/api/accountinvoices?action=download&aid=${aid}&billrun_key=${billrun_key}&iid=${invoice_id}`;
    var form = $('<form></form>').attr('action', url).attr('method', 'post');
    form.append($("<input></input>").attr('type', 'hidden').attr('name', 'a').attr('value', 'a'));
    form.appendTo('body').submit().remove();
  }
  
  render() {
    let { invoices } = this.props;
    let settings = {

    };

    return (
      <Table onCellClick={this.onClickCell}>
        <TableHeader displaySelectAll={true}>
          <TableRow>
            <TableHeaderColumn>Invoice ID</TableHeaderColumn>
            <TableHeaderColumn>Date</TableHeaderColumn>
            <TableHeaderColumn>Due Date</TableHeaderColumn>
            <TableHeaderColumn>Amount</TableHeaderColumn>
            <TableHeaderColumn>Status</TableHeaderColumn>
            <TableHeaderColumn>Customer ID</TableHeaderColumn>
            <TableHeaderColumn>Download</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((row, index) => (
             <TableRow key={index}>
               <TableRowColumn>{row.get('invoice_id')}</TableRowColumn>
               <TableRowColumn>{row.get('invoice_date')}</TableRowColumn>
               <TableRowColumn>{row.get('due_date')}</TableRowColumn>
               <TableRowColumn>{row.get('amount')}</TableRowColumn>
               <TableRowColumn>
                 {(() => {
                    if (row.get('paid_by'))
                      return (<span style={{color: "green"}}>Paid</span>);
                    else if (moment(row.get('due_date')).isAfter(moment()))
                      return (<span style={{color: "yellow"}}>Due</span>);
                    return (<span style={{color: "red"}}>Not Paid</span>);
                  })()}
               </TableRowColumn>
               <TableRowColumn>
                 {row.get('aid')}
               </TableRowColumn>
               <TableRowColumn>
                 <a onClick={this.downloadInvoice.bind(this, row.get('aid'), row.get('billrun_key'), row.get('invoice_id'))} className="clickable">
                   <FileDownload />
                 </a>
               </TableRowColumn>
             </TableRow>
           ))}
        </TableBody>
      </Table>
    );
  }
}

function mapStateToProps(state, props) {
  return state;
}

export default connect(mapStateToProps)(Invoices);