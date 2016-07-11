import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Table, TableHeader, TableRow, TableHeaderColumn, TableRowColumn, TableBody } from 'material-ui/Table';

import { getCustomers } from '../../actions/customerActions';

class SubscribersList extends Component {
  constructor(props) {
    super(props);

    this.onClickCell = this.onClickCell.bind(this);
  }

  componentWillMount() {
    this.props.dispatch(getCustomers());
  }
  
  onClickCell(cell_idx, col_idx, e) {
    let { subscriber } = this.props;
    let aid = subscriber.valueSeq().get(cell_idx).get('aid');
    this.context.router.push({
      pathname: 'subscriber',
      query: {aid}
    });
  }
  
  render() {
    const { subscriber } = this.props;
    const rows = subscriber.map((row, index) => (
      <TableRow key={index}>
        <TableRowColumn>{row.get('first_name')}</TableRowColumn>
        <TableRowColumn>{row.get('last_name')}</TableRowColumn>
        <TableRowColumn>{row.get('plan')}</TableRowColumn>
      </TableRow>
    ));

    return (
      <Table onCellClick={this.onClickCell}>
        <TableHeader displaySelectAll={true} fixedHeader={true}>
          <TableRow>
            <TableHeaderColumn tooltip="First Name">First Name</TableHeaderColumn>
            <TableHeaderColumn tooltip="Last Name">Last Name</TableHeaderColumn>
            <TableHeaderColumn tooltip="Plan">Plan</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody>
          { rows }
        </TableBody>
      </Table>
    );
  }
}

SubscribersList.contextTypes = {
  router: React.PropTypes.object.isRequired
};

function mapStateToProps(state, props) {
  return {subscriber: state.subscriber};
}

export default connect(mapStateToProps)(SubscribersList);
