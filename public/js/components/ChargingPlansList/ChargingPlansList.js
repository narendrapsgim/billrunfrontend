import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Immutable from 'immutable';
import moment from 'moment';

import { getList } from '../../actions/listActions';

import Pager from '../Pager';
import Filter from '../Filter';
import { Button } from "react-bootstrap";
import List from '../List';

class ChargingPlansList extends Component {
  static defaultProps = {
    plans: Immutable.List()
  }

  static propTypes = {
    items: React.PropTypes.instanceOf(Immutable.List),
    router: React.PropTypes.shape({
      push: React.PropTypes.func.isRequired,
    }).isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      size: 10,
      page: 0,
      sort: '',
      filter: {}
    }
  }

  buildQuery = () => {
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


  handlePageClick = (page) => {
    this.setState({page}, () => {
      this.props.dispatch(getList('charging_plans', this.buildQuery()))
    });
  }

  onFilter = (filter) => {
    this.setState({filter, page: 0}, () => {
      this.props.dispatch(getList('charging_plans', this.buildQuery()))
    });
  }

  onClickPlan = (plan) => {
    this.props.router.push({
      pathname: "charging_plan",
      query: {
        action: "update",
        planId: plan.getIn(['_id', '$id'], '')
      }
    });
  }

  onNewPlan = () => {
    this.props.router.push({
      pathname: 'charging_plan',
      query: {
        action: 'new'
      }
    });
  }

  onSort = (sort) => {
    this.setState({sort}, () => {
      this.props.dispatch(getList('charging_plans', this.buildQuery()))
    });
  }


  render() {
    const { plans } = this.props;

    const fields = [
      {id: "name", placeholder: "Name"},
      {id: "code", placeholder: "Code"},
      {id: "to", display: false, type: "datetime", showFilter: false}
    ];

    const tableFields = [
      {id: 'name', title: 'Name', sort: true},
      {id: 'code', title: 'Code', sort: true},
      {id: 'description', title: "Description", sort: true},
    ];

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
                <Filter fields={ fields } onFilter={this.onFilter} base={{to: {"$gt": moment().toISOString()}, 'charging_type': 'prepaid'}} />
                <List items={ plans } fields={ tableFields } onSort={ this.onSort } editField="name" edit={true} onClickEdit={ this.onClickPlan }/>
              </div>
            </div>
            <Pager
                onClick={this.handlePageClick}
                size={this.state.size}
                count={plans.size || 0}
            />
          </div>
        </div>

      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    plans: state.list.get('charging_plans', Immutable.List())
  };
}

export default withRouter(connect(mapStateToProps)(ChargingPlansList));
