import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Immutable from 'immutable';
import Pager from '../Pager';
import Filter from '../Filter';
import moment from 'moment';
import { Button } from "react-bootstrap";
import { capitalize } from 'lodash';

import { getList } from '../../actions/listActions';
import List from '../List';

class PrepaidPlansList extends Component {
  constructor(props) {
    super(props);

    this.onFilter = this.onFilter.bind(this);
    this.buildQuery = this.buildQuery.bind(this);
    this.onNewPlan = this.onNewPlan.bind(this);
    this.onClickPlan = this.onClickPlan.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);
    this.onSort = this.onSort.bind(this);

    this.state = {
      size: 10,
      page: 0,
      sort: '',
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
	{ sort: this.state.sort },
        { query: this.state.filter }
      ]
    };
  }


  handlePageClick(page) {
    this.setState({page}, () => {
      this.props.dispatch(getList('prepaid_plans', this.buildQuery()))
    });
  }

  onFilter(filter) {
    this.setState({filter, page: 0}, () => {
      this.props.dispatch(getList('prepaid_plans', this.buildQuery()))
    });
  }

  onClickPlan(plan) {
    this.props.router.push({
      pathname: "prepaid_plan",
      query: {
        action: "update",
        planId: plan.getIn(['_id', '$id'], '')
      }
    });
  }

  onNewPlan() {
    this.props.router.push({
      pathname: 'prepaid_plan',
      query: {
        action: 'new'
      }
    });
  }

  onSort(sort) {
    this.setState({sort}, () => {
      this.props.dispatch(getList('prepaid_plans', this.buildQuery()))
    });
  }

  getFilterFields = () => ([
    {id: "description", placeholder: "Title"},
    {id: "name", placeholder: "Key"},
    {id: "to", display: false, type: "datetime", showFilter: false},
    {id: "connection_type", display: false, showFilter: false},
    {id: "type", display: false, showFilter: false}
  ])

  getTableFields = () => ([
    {id: 'description', title: "Title", sort: true},
    {id: 'name', title: 'Key', sort: true},
    {id: 'code', title: 'Code', sort: true},
  ])

  render() {
    const { plans } = this.props;
    const filterFields = this.getFilterFields();
    const tableFields = this.getTableFields();

    return (
      <div>
        <div className="row">
          <div className="col-lg-12">
            <div className="panel panel-default">
              <div className="panel-heading">
                List of all available prepaid plans
                <div className="pull-right">
                  <Button bsSize="xsmall" className="btn-primary" onClick={this.onNewPlan}><i className="fa fa-plus"/>&nbsp;Add New</Button>
                </div>
              </div>
              <div className="panel-body">
                <Filter fields={ filterFields } onFilter={this.onFilter} base={{to: {"$gt": moment().toISOString()}, 'connection_type': 'prepaid', 'type': 'customer'}} />
                <List items={ plans } fields={ tableFields } onSort={ this.onSort } editField="description" edit={true} onClickEdit={ this.onClickPlan }/>
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

function mapStateToProps(state) {
  return {
    plans: state.list.get('prepaid_plans', Immutable.List())
  };
}

export default withRouter(connect(mapStateToProps)(PrepaidPlansList));
