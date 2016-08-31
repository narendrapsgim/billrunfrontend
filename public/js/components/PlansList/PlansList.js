import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Table, TableBody, TableHeader, TableFooter, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import RaisedButton from 'material-ui/RaisedButton';
import Filter from '../Filter';
import Field from '../Field';
import Pager from '../Pager';
import moment from 'moment';

import { permissions } from '../../permissions';
import { getPlans } from '../../actions/plansActions';

class PlansList extends Component {
  constructor(props) {
    super(props);

    this.onClickCell = this.onClickCell.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);
    this.onFilter = this.onFilter.bind(this);
    this.onNewPlan = this.onNewPlan.bind(this);
    this.onChangeSort = this.onChangeSort.bind(this);

    this.state = {
      page: 0,
      size: 10,
      filter: "",
      sort: ""
    };
  }
  
  onClickCell(cell_idx, col_idx, e) {
    let { plans } = this.props;
    let id = plans.valueSeq().get(cell_idx).getIn(['_id', '$id']);
    this.context.router.push({
      pathname: 'plan_setup',
      query: {
        plan_id: id,
        action: 'update'
      }
    });
  }

  buildQuery() {
    const { page, size, filter, sort } = this.state;
    return { page, size, filter, sort };
  }

  handlePageClick(page) {
    this.setState({page}, () => {
      this.props.dispatch(getPlans(this.buildQuery()))
    });
  }

  onFilter(filter) {
    this.setState({filter}, () => {
      this.props.dispatch(getPlans(this.buildQuery()))
    });
  }

  onNewPlan() {
    this.context.router.push({
      pathname: 'plan_setup',
      query: {
        action: 'new'
      }
    });
  }

  onChangeSort(e) {
    const { value } = e.target;
    this.setState({sort: value}, () => {
      this.props.dispatch(getPlans(this.buildQuery()))
    });
  }

  planTrial(plan) {
    if (plan.getIn(['price', 0, 'trial'])) {
      return plan.getIn(['price', 0, 'TrialCycle']) + " " + plan.getIn(['recurrence', 'periodicity']);
    }
    return '';
  }

  planCharges(plan) {
    let sub = plan.getIn(['price', 0, 'trial']) ? 1 : 0;
    let cycles = plan.get('price').size - sub;
    return cycles + ' cycles';
  }

  planBillingFrequency(plan) {
    return plan.getIn(['recurrence', 'unit']) + " " + plan.getIn(['recurrence', 'periodicity']);
  }

  planChargingMode(plan) {
    return plan.get('upfront') ? "Upfront" : "Arrears";
  }
  
  render() {
    let { plans } = this.props;

    const fields = [
      {id: "name", placeholder: "Name"},
      {id: "PlanCode", placeholder: "Code"},
      {id: "to", display: false, type: "datetime"}
    ];

    const table_header =
    ["Name", "Code", "Description", "Trial", "Recurring Charges", "Billing Frequency", "Charging Mode"].map((header, key) => (
      <TableHeaderColumn key={key}>{header}</TableHeaderColumn>
    ));

    const real_plans = plans.size > this.state.size ? plans.pop() : plans;
    const rows = real_plans.map((plan, plan_key) => (
      <TableRow key={plan_key}>
        <TableRowColumn>
          <Field value={plan.get('name')} coll="Plans" editable={false} />
        </TableRowColumn>
        <TableRowColumn>
          <Field value={plan.get('PlanCode')} coll="Plans" editable={false} />
        </TableRowColumn>
        <TableRowColumn>
          <Field value={plan.get('PlanDescription')} coll="Plans" editable={false} />
        </TableRowColumn>
        <TableRowColumn>
          <Field value={this.planTrial(plan)} coll="Plans" editable={false} />
        </TableRowColumn>
        <TableRowColumn>
          <Field value={this.planCharges(plan)} coll="Plans" editable={false} />
        </TableRowColumn>
        <TableRowColumn>
          <Field value={this.planBillingFrequency(plan)} coll="Plans" editable={false} />
        </TableRowColumn>
        <TableRowColumn>
          <Field value={this.planChargingMode(plan)} coll="Plans" editable={false} />
        </TableRowColumn>
      </TableRow>
    ));

    return (
      <div className="PlansList">
        <div className="row" style={{marginBottom: 10}}>
          <div className="col-xs-5">
            <Filter fields={fields} onFilter={this.onFilter} base={{"to": {"$gt": moment().toISOString()}}} />
            {/* <select className="form-control" onChange={this.onChangeSort} defaultValue="-1">
            { sort_fields }
            </select> */}
          </div>
          <div className="col-xs-5">
            <div style={{float: "right"}}>
              <RaisedButton primary={true} label="New" onMouseUp={this.onNewPlan} />
            </div>
          </div>
        </div>
        <Table onCellClick={this.onClickCell}>
          <TableHeader displaySelectAll={true} fixedHeader={true}>
            <TableRow>
              { table_header }
            </TableRow>
          </TableHeader>
          <TableBody>
            { rows }
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableRowColumn style={{textAlign: 'center'}}>
                <Pager onClick={this.handlePageClick}
                       size={this.state.size}
                       count={plans.size} />
              </TableRowColumn>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
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
