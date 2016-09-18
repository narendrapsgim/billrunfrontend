import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import { PageHeader } from 'react-bootstrap';
import Pager from '../Pager';
import Filter from '../Filter';
import { DropdownButton, MenuItem } from "react-bootstrap";

/* ACTIONS */
import { getList } from '../../actions/listActions';
import List from '../List';


class ProductsList extends Component {
  constructor(props) {
    super(props);

    this.buildQuery = this.buildQuery.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);
    this.onNewProduct = this.onNewProduct.bind(this);
    this.onClickProduct = this.onClickProduct.bind(this);

    this.onSort = this.onSort.bind(this);
    this.onFilter = this.onFilter.bind(this);

    this.state = {
      page: 0,
      size: 10,
      sort: '',
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
	{ sort: this.state.sort },
        { query: this.state.filter }
      ]
    };
  }
  
  onClickProduct(product) {
    this.context.router.push({
      pathname: "product_setup",
      query: {
        action: "update",
        productId: product.getIn(['_id', '$id'])
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
    this.setState({filter, page: 0}, () => {
      this.props.dispatch(getList('products', this.buildQuery()))
    });
  }

  onSort(sort) {
    this.setState({sort}, () => {
      this.props.dispatch(getList('products', this.buildQuery()))
    });
  }

  render() {
    const { products } = this.props;

    const unit_type_by_parser = (product) => {
      return Object.keys(product.get('rates').toJS())[0];
    };

    const fields = [
      {id: "key", placeholder: "Name"},
      {id: "to", display: false, type: "datetime"}
    ];

    const tableFields = [
      {id: 'key', title: 'Name', sort: true},
      {id: 'unit_type', title: 'Unit Type', parser: unit_type_by_parser},
      {id: 'code', title: "Code"},
      {id: 'description', title: "Description"},
      {id: 'from', title: 'From', type: "datetime"},
      {id: 'to', title: 'To', type: "datetime"}
    ];

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
                <Filter fields={fields} onFilter={this.onFilter} base={{ to: {$gt: moment().toISOString()}}} />
                <List items={ products } fields={ tableFields } edit={ true } onClickEdit={ this.onClickProduct } onSort={ this.onSort } />
              </div>
            </div>
          </div>
        </div>

        <Pager onClick={this.handlePageClick}
               size={this.state.size}
               count={products.size || 0} />  
      </div>
    );
  }
}

ProductsList.contextTypes = {
  router: React.PropTypes.object.isRequired
};

function mapStateToProps(state, props) {
  return { products: state.list.get('products') || [] };
};

export default connect(mapStateToProps)(ProductsList);
