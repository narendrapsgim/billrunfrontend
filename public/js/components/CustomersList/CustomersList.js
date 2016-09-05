import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import { PageHeader } from 'react-bootstrap';
import Pager from '../Pager';
import Filter from '../Filter';
import { DropdownButton, MenuItem } from "react-bootstrap";

/* ACTIONS */
import { getList } from '../../actions/listActions';

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

  componentDidMount() {
    this.props.dispatch(getList("customers", this.buildQuery()));
  }

  buildQuery() {
    return {
      api: "find",
      collection: "subscribers",
      size: this.state.size,
      page: this.state.page,
      query: this.state.filter
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

  onClickCustomer(aid, e) {
    this.context.router.push({
      pathname: "customer",
      query: {
        action: "update",
        aid
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
      { id: "aid", placeholder: "Account ID" },
      { id: "firstname", placeholder: "First Name" },
      { id: "lastname", placeholder: "Last Name" },
      { id: "address", placeholder: "Address" },
      { id: "email", placeholder: "Email" },
      { id: "to", placeholder: "To", display: false, type: "datetime" }
    ];

    const table_header = fields.map((field, key) => (
      <th key={key}>{ field.placeholder }</th>
    ));

    const table_body = customers.map((customer, key) => (
      <tr key={key} onClick={this.onClickCustomer.bind(this, customer.get('aid'))}>
        { fields.map((field, field_key) => (
            <td key={field_key}>{ customer.get(field.id) }</td>
          )) }
      </tr>
    ));

    return (
      <div>

        <div className="row">
          <div className="col-lg-12">
            <div className="panel panel-default">
              <div className="panel-heading">
                <span>
                  List of all available customers
                  <div className="pull-right">
                    <DropdownButton title="Actions" id="ActionsDropDown" bsSize="xs" pullRight>
                      <MenuItem eventKey="1" onClick={this.onNewCustomer}>New</MenuItem>
                    </DropdownButton>
                  </div>
                </span>
              </div>
              <div className="panel-body">
                <div className="row">
                  <div className="col-lg-9">
                    <Filter fields={fields} onFilter={this.onFilter} base={{type: "account", to: {$gt: moment().toISOString()}}} />
                  </div>
                </div>
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>{ table_header }</tr>
                    </thead>
                    <tbody>
                      { table_body }
                    </tbody>
                  </table>
                </div>
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
