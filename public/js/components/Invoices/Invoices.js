import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getInvoices } from '../../actions/invoicesActions';

import { Table, TableHeader, TableRow, TableHeaderColumn, TableRowColumn, TableBody } from 'material-ui/Table';

class Invoices extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.dispatch(getInvoices());
  }
  
  render() {
    let { invoices } = this.props;
    let settings = {

    };

    return (
      <Table onCellClick={this.onClickCell}>
        <TableHeader displaySelectAll={true} fixedHeader={true}>
          <TableRow>
            <TableHeaderColumn tooltip="Invoice ID">Invoice ID</TableHeaderColumn>
            <TableHeaderColumn tooltip="Date">Date</TableHeaderColumn>
            <TableHeaderColumn tooltip="Due Date">Due Date</TableHeaderColumn>
            <TableHeaderColumn tooltip="Amount">Amount</TableHeaderColumn>
            <TableHeaderColumn tooltip="Status">Status</TableHeaderColumn>
            <TableHeaderColumn tooltip="Account ID">Account ID</TableHeaderColumn>
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
                    return (<span style={{color: "red"}}>Not Paid</span>);
                  })()}
               </TableRowColumn>
               <TableRowColumn>
                 {row.get('aid')}
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
