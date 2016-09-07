import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import { PageHeader } from 'react-bootstrap';
import Pager from '../Pager';
import Filter from '../Filter';
import { DropdownButton, MenuItem } from "react-bootstrap";

/* ACTIONS */
import { getList } from '../../actions/listActions';



class ProductsList extends Component {
  constructor(props) {
    super(props);

    this.buildQuery = this.buildQuery.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);
    this.onNewProduct = this.onNewProduct.bind(this);
    this.onClickProduct = this.onClickProduct.bind(this);
    this.onFilter = this.onFilter.bind(this);

    this.state = {
      page: 0,
      size: 10,
      filter: {}
    };
  }

  buildQuery() {
    return {
      api: "find",
      params: [
        { collection: "rates" },
        { size: this.state.size },
        { page: this.state.page },
        { query: this.state.filter }
      ]
    };
  }
  
  onClickProduct(productId, e) {
    this.context.router.push({
      pathname: "product",
      query: {
        action: "update",
        productId
      }
    });
  }

  handlePageClick(page) {
    this.setState({page}, () => {
      this.props.dispatch(getList('products', this.buildQuery()))
    });
  }

  onNewProduct() {
    this.context.router.push({
      pathname: `product_setup`,
      query: {
        action: 'new'
      }
    });
  }

  onFilter(filter) {
    this.setState({filter}, () => {
      debugger;
      this.props.dispatch(getList('products', this.buildQuery()))
    });
  }

  getProductUnitType(product) {
    return Object.keys(product.get('rates').toJS())[0];
  }

  render() {
    const { products } = this.props;

    const fields = [
      {id: "key", placeholder: "Name"},
      {id: "to", display: false, type: "datetime"}
    ];

    const tableFields = [
      {id: 'key', title: 'Name'},
      {id: 'unit_type', title: "Unit Type"},
      {id: 'code', title: "Code"},
      {id: 'description', title: "Description"},
      {id: 'from', title: 'From'},
      {id: 'to', title: 'To'}
    ];

    const table_header =
    tableFields.map((tableHeader, key) => (
      <th key={key}>{ tableHeader.title }</th>
    ));

    const table_body = products.map((product, key) => (
      <tr key={key} onClick={this.onClickProduct.bind(this, product.get('aid'))}>
        { tableFields.map((field, field_key) => {
            if (field.id === "unit_type") {
              return (<td key={field_key}>{ this.getProductUnitType(product) }</td>);
            }
            return (<td key={field_key}>{ product.get(field.id) }</td>);
          }) }
      </tr>
    ));

    return (
      <div>
        <div className="row">
          <div className="col-lg-12">
            <div className="panel panel-default">
              <div className="panel-heading">
                <span>
                  List of all available products
                  <div className="pull-right">
                    <DropdownButton title="Actions" id="ActionsDropDown" bsSize="xs" pullRight>
                      <MenuItem eventKey="1" onClick={this.onNewProduct}>New</MenuItem>
                    </DropdownButton>
                  </div>
                </span>
              </div>
              <div className="panel-body">
                <div className="row">
                  <div className="col-lg-9">
                    <Filter fields={fields} onFilter={this.onFilter} base={{ to: {$gt: moment().toISOString()}}} />
                  </div>
                </div>
                <div className="table-responsive">
                  <table className="table table-striped table-hover">
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
                   count={products.size || 0} />  
          </div>
        </div>

      </div>
    );
  }
}

ProductsList.contextTypes = {
  router: React.PropTypes.object.isRequired
};

function mapStateToProps(state, props) {
  return { products: state.list.get('products') || [] };
}

export default connect(mapStateToProps)(ProductsList);