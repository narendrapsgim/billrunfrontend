import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getProducts } from '../../actions/productsActions';

import {Table, TableBody, TableHeader, TableFooter, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import Pager from '../Pager';
import RaisedButton from 'material-ui/RaisedButton';
import Filter from '../Filter';
import Field from '../Field';

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
    this.props.dispatch(getProducts());
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
  
  render() {
    const { products } = this.props;
    const fields = [
      {id: "key", placeholder: "Name"},
    ];

    const table_header = fields.map((field, idx) => (
      <TableHeaderColumn tooltip={field.placeholder} key={idx}>{field.placeholder}</TableHeaderColumn>
    ));
    const rows = products.map((row, key) => (
      <TableRow key={key}>
        {fields.map((field, idx) => (
          <TableRowColumn key={idx}>
            <Field id={field.id} value={row.get(field.id)} coll="Product" editable={false} />
          </TableRowColumn>
        ))}
      </TableRow>
    ));

    return (
      <div className="ProductsList">
        <div className="row" style={{marginBottom: 10}}>
          <div className="col-md-5">
            <Filter onFilter={this.onFilter} fields={fields} />
          </div>
          <div className="col-md-5">
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
