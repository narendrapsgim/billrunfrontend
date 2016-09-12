import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import Pager from '../Pager';
import Filter from '../Filter';
import List from '../List';
import { DropdownButton, MenuItem } from "react-bootstrap";

/* ACTIONS */
import { getList, clearList } from '../../actions/listActions';
import { titlize } from '../../common/Util';

class CustomersList extends Component {
  constructor(props) {
    super(props);

    this.buildQuery = this.buildQuery.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);
    this.onNewCustomer = this.onNewCustomer.bind(this);
    this.onClickCustomer = this.onClickCustomer.bind(this);
    this.onFilter = this.onFilter.bind(this);

    this.state = {
      page: 0,
      size: 10
    };
  }

  componentWillUnmount() {
    this.props.dispatch(clearList('customers'));
  }

  buildQuery() {
    return {
      api: "find",
      params: [
        { collection: "subscribers" },
        { size: this.state.size },
        { page: this.state.page },
        { query: this.state.filter }
      ]
    };
  }

  handlePageClick(page) {
    this.setState({page}, () => {
      this.props.dispatch(getList("customers", this.buildQuery()))
    });
  }

  onNewCustomer() {
    this.context.router.push({
      pathname: "customer",
      query: { action: "new" }
    });
  }

  onClickCustomer(customer, e) {
    this.context.router.push({
      pathname: "customer",
      query: {
        action: "update",
        aid: customer.get('aid')
      }
    });
  }

  onFilter(filter) {
    this.setState({filter}, () => {
      this.props.dispatch(getList("customers", this.buildQuery()))
    });
  }

  render() {
    const { customers } = this.props;

    const fields = [
      { id: "aid", placeholder: "Customer ID", type: 'number' },
      { id: "firstname", placeholder: "First Name" },
      { id: "lastname", placeholder: "Last Name" },
      { id: "address", placeholder: "Address" },
      { id: "email", placeholder: "Email" },
      { id: "to", placeholder: "To", display: false, type: "datetime" }
    ];

    return (
      <div>

        <div className="row">
          <div className="col-lg-12">
            <div className="panel panel-default">
              <div className="panel-heading">
                <span>
                  List of all available customers
                </span>
                <div className="pull-right">
                  <DropdownButton title="Actions" id="ActionsDropDown" bsSize="xs" pullRight>
                    <MenuItem eventKey="1" onClick={this.onNewCustomer}>New</MenuItem>
                  </DropdownButton>
                </div>
              </div>
              <div className="panel-body">
                <Filter fields={fields} onFilter={this.onFilter} base={{type: "account", to: {$gt: moment().toISOString()}}} />
                <List items={customers} fields={fields} onClickRow={this.onClickCustomer} />
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-6">
            <div className="dataTables_info" role="status" aria-live="polite">Showing 1 to 10</div>
          </div>
          <div className="col-lg-6 dataTables_pagination">
            <Pager onClick={this.handlePageClick}
                   size={this.state.size}
                   count={customers.size || 0} />  
          </div>
        </div>

      </div>
    );
  }
}

CustomersList.contextTypes = {
  router: React.PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    customers: state.list.get('customers') || []
  };
}

export default connect(mapStateToProps)(CustomersList);
