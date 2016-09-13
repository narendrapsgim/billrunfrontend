import React, { Component } from 'react';
import { connect } from 'react-redux';
import { PageHeader} from 'react-bootstrap';
import Pager from '../Pager';
import Filter from '../Filter';
import moment from 'moment';
import { DropdownButton, MenuItem } from "react-bootstrap";

import { getList } from '../../actions/listActions';
import List from '../List';

class PlansList extends Component {
  constructor(props) {
    super(props);

    this.onFilter = this.onFilter.bind(this);
    this.buildQuery = this.buildQuery.bind(this);
    this.onNewPlan = this.onNewPlan.bind(this);
    this.onClickPlan = this.onClickPlan.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);

    this.state = {
      size: 10,
      page: 0,
      filter: {}
    }
  }

  buildQuery() {
    return {
      api: "find",
      params: [
        { collection: "plans" },
        { size: this.state.size },
        { page: this.state.page },
        { query: this.state.filter }
      ]
    };
  }


  handlePageClick(page) {
    this.setState({page}, () => {
      this.props.dispatch(getList('plans', this.buildQuery()))
    });
  }

  onFilter(filter) {
    this.setState({filter, page: 1}, () => {
      this.props.dispatch(getList('plans', this.buildQuery()))
    });
  }

  onClickPlan(plan) {
    this.context.router.push({
      pathname: "plan",
      query: {
        action: "update",
        planId: plan.get('id')
      }
    });
  }
  
  onNewPlan() {
    this.context.router.push({
      pathname: `plan_setup`,
      query: {
        action: 'new'
      }
    });
  }

  render() {
    const { plans } = this.props;

    const fields = [
      {id: "name", placeholder: "Name"},
      {id: "PlanCode", placeholder: "Code"},
      {id: "to", display: false, type: "datetime"}
    ];

    const trial_parser = (plan) => {
      if (plan.getIn(['price', 0, 'trial'])) {
        return plan.getIn(['price', 0, 'TrialCycle']) + " " + plan.getIn(['recurrence', 'periodicity']);
      }
      return '';
    };
    
    const recuring_charges_parser = (plan) => {
      let sub = plan.getIn(['price', 0, 'trial']) ? 1 : 0;
      let cycles = plan.get('price').size - sub;
      return cycles + ' cycles';
    }

    const billing_frequency_parser = (plan) => {
      return plan.getIn(['recurrence', 'unit']) + " " + plan.getIn(['recurrence', 'periodicity']);
    }

    const charging_mode_parser = (plan) => {
      return plan.get('upfront') ? "Upfront" : "Arrears";
    }

    const tableFields = [
      {id: 'name', title: 'Name'},
      {id: 'PlanCode', title: 'Code'},
      {id: 'description', title: "Description"},
      {title: 'Trial', parser: trial_parser},
      {id: 'recurrence_charges', title: 'Recurring Charges', parser: recuring_charges_parser},
      {id: 'recurrence_frequency', title: 'Billing Frequency', parser: billing_frequency_parser},
      {id: 'charging_mode', title: 'Charging Mode', parser: charging_mode_parser}
    ];

    return (
      <div>
        <div className="row">
          <div className="col-lg-12">
            <div className="panel panel-default">
              <div className="panel-heading">
                All available plans
                 <div className="pull-right">
                    <DropdownButton title="Actions" id="ActionsDropDown" bsSize="xs" pullRight>
                      <MenuItem eventKey="1" onClick={this.onNewPlan}>New</MenuItem>
                    </DropdownButton>
                  </div>
              </div>
              <div className="panel-body">
                <Filter fields={ fields } onFilter={this.onFilter} base={{to: {"$gt": moment().toISOString()}}} />
                <List items={ plans } fields={ tableFields } />
              </div>
            </div>
            <Pager onClick={this.handlePageClick}
                   size={this.state.size}
                   count={plans.size || 0} />  
          </div>
        </div>

      </div>
    );
  }
}

PlansList.contextTypes = {
  router: React.PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    plans: state.list.get('plans') || []
  };
}

export default connect(mapStateToProps)(PlansList);
