import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Table, TableHeader, TableRow, TableHeaderColumn, TableRowColumn, TableBody, TableFooter } from 'material-ui/Table';

import { getUsages } from '../../actions/usageActions';

class UsageList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      totalPages: 10
    };
  }

  componentWillMount() {
    this.props.dispatch(getUsages());
  }
  
  render() {
    let { usages } = this.props;    

    return (
      <div>
        <Table fixedHeader={true}
               fixedFooter={true}
               selectable={false}
               height={'500px'}>
          <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
            <TableRow>
              <TableHeaderColumn tooltip="Account">Account</TableHeaderColumn>
              <TableHeaderColumn tooltip="Subscription">Subscription</TableHeaderColumn>
              <TableHeaderColumn tooltip="Plan">Plan</TableHeaderColumn>
              <TableHeaderColumn tooltip="Charge">Charge</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false} stripedRows={true}>
            {usages.valueSeq().map((row, index) => (
               <TableRow key={index}>
                 <TableRowColumn>{row.get('aid')}</TableRowColumn>
                 <TableRowColumn>{row.get('sid')}</TableRowColumn>
                 <TableRowColumn>{row.get('plan')}</TableRowColumn>
                 <TableRowColumn>{row.get('aprice')}</TableRowColumn>
               </TableRow>
             ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableRowColumn style={{textAlign: 'center'}}>
                {/* <Pager /> */}
              </TableRowColumn>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return state;
}

export default connect(mapStateToProps)(UsageList);
