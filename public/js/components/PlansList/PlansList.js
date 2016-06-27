import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

import { getPlans } from '../../actions/plansActions';

class PlansList extends Component {
  constructor(props) {
    super(props);

    this.onClickCell = this.onClickCell.bind(this);
  }

  componentWillMount() {
    this.props.dispatch(getPlans());
  }
  
  onClickCell(cell_idx, col_idx, e) {
    let { plans } = this.props;
    let id = plans.valueSeq().get(cell_idx).getIn(['_id', '$id']);;
    this.context.router.push({
      pathname: 'plan_setup',
      query: {plan_id: id}
    });
  }
  
  render() {
    let { plans } = this.props;

    let rows = plans.map((row, index) => (
      <TableRow key={index}>
        <TableRowColumn>{row.get('name')}</TableRowColumn>
        <TableRowColumn>{row.get('technical_name')}</TableRowColumn>
        <TableRowColumn>{row.get('invoice_label')}</TableRowColumn>
      </TableRow>
    ));
    
    return (
      <Table onCellClick={this.onClickCell}>
        <TableHeader displaySelectAll={true} fixedHeader={true}>
          <TableRow>
            <TableHeaderColumn tooltip="Name">Name</TableHeaderColumn>
            <TableHeaderColumn tooltip="Technical Name">Technical Name</TableHeaderColumn>
            <TableHeaderColumn tooltip="Invoice Label">Invoice Label</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody>
          { rows }
        </TableBody>
      </Table>
    );
  }
}

PlansList.contextTypes = {
  router: React.PropTypes.object.isRequired
};

function mapStateToProps(state, props) {
  return state;
}

export default connect(mapStateToProps)(PlansList);
