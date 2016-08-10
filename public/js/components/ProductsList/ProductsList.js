import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getProducts } from '../../actions/productsActions';

import {Table, TableBody, TableHeader, TableFooter, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import Pager from '../Pager';
import RaisedButton from 'material-ui/RaisedButton';
import Filter from '../Filter';
import Field from '../Field';

import moment from 'moment';

class ProductsList extends Component {
  constructor(props) {
    super(props);

    this.onClickCell = this.onClickCell.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);
    this.onNewProduct = this.onNewProduct.bind(this);
    this.onFilter = this.onFilter.bind(this);

    this.state = {
      page: 0,
      size: 10,
      filter: ""
    };
  }

  componentWillMount() {
    //this.props.dispatch(getProducts());
  }
  
  onClickCell(cell_idx, col_idx, e) {
    let { products } = this.props;
    let id = products.valueSeq().get(cell_idx).getIn(['_id', '$id']);;
    this.context.router.push({
      pathname: 'product_setup',
      query: {
        product_id: id,
        action: 'update'
      }
    });
  }

  buildQuery() {
    const { page, size, filter } = this.state;
    return { page, size, filter };
  }  
  
  handlePageClick(page) {
    this.setState({page}, () => {
      this.props.dispatch(getProducts(this.buildQuery()))
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
      this.props.dispatch(getProducts(this.buildQuery()))
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

    const table_header = [
      (<TableHeaderColumn>Name</TableHeaderColumn>),
      (<TableHeaderColumn>Code</TableHeaderColumn>),
      (<TableHeaderColumn>Description</TableHeaderColumn>),
      (<TableHeaderColumn>Unit Type</TableHeaderColumn>),
      (<TableHeaderColumn>From</TableHeaderColumn>),
      (<TableHeaderColumn>To</TableHeaderColumn>)
    ];

    const rows = products.map((row, key) => (
      <TableRow key={key}>
        <TableRowColumn>
          <Field value={row.get("key")} coll="Product" editable={false} />
        </TableRowColumn>
        <TableRowColumn>
          <Field value={row.get("code")} coll="Product" editable={false} />
        </TableRowColumn>
        <TableRowColumn>
          <Field value={row.get("description")} coll="Product" editable={false} />
        </TableRowColumn>
        <TableRowColumn>
          <Field value={this.getProductUnitType(row)} coll="Product" editable={false} />
        </TableRowColumn>
        <TableRowColumn>
          <Field value={moment(parseInt(row.getIn(["from", "sec"]), 10) * 1000).format()} coll="Product" editable={false} />
        </TableRowColumn>
        <TableRowColumn>
          <Field value={moment(parseInt(row.getIn(["to", "sec"]), 10) * 1000).format()} coll="Product" editable={false} />
        </TableRowColumn>
      </TableRow>
    ));

    return (
      <div className="ProductsList">
        <div className="row" style={{marginBottom: 10}}>
          <div className="col-xs-5">
            <Filter onFilter={this.onFilter} fields={fields} base={{"to": {"$gt": moment().toISOString()}}} />
          </div>
          <div className="col-xs-5">
            <div style={{float: "right"}}>
              <RaisedButton primary={true} label="New" onMouseUp={this.onNewProduct} />
            </div>
          </div>
        </div>
        <Table onCellClick={this.onClickCell}>
          <TableHeader displaySelectAll={true}>
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
                <Pager onClick={this.handlePageClick} />
              </TableRowColumn>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    );
  }
}

ProductsList.contextTypes = {
  router: React.PropTypes.object.isRequired
};

function mapStateToProps(state, props) {
  return state;
}

export default connect(mapStateToProps)(ProductsList);
