import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getProducts } from '../../actions/productsActions';

import {Table, TableBody, TableHeader, TableFooter, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import ReactPaginate from 'react-paginate';
import RaisedButton from 'material-ui/RaisedButton';
import Filter from '../Filter';

class ProductsList extends Component {
  constructor(props) {
    super(props);

    this.onClickCell = this.onClickCell.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);
    this.onNewProduct = this.onNewProduct.bind(this);
    this.onFilter = this.onFilter.bind(this);

    this.state = {
      page: 1,
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
      query: {product_id: id}
    });
  }

  buildQuery() {
    const { page, size, filter } = this.state;
    return { page, size, filter };
  }  
  
  handlePageClick(data) {
    let page = data.selected + 1;
    this.setState({page}, () => {
      this.props.dispatch(getProducts(this.buildQuery()))
    });
  }

  onNewProduct() {
    this.context.router.push(`product_setup`);
  }

  onFilter(filter) {
    this.setState({filter}, () => {
      this.props.dispatch(getProducts(this.buildQuery()))
    });
  }
  
  render() {
    let { products } = this.props;
    const fields = [
      {id: "key", placeholder: "Name"}
    ];

    return (
      <div className="ProductsList">
        <div className="row">
          <div style={{float: "left"}}>
            <h4>Products</h4>
          </div>
          <div style={{float: "right"}}>
            <RaisedButton primary={true} label="New" onMouseUp={this.onNewProduct} />
          </div>
        </div>
        <Filter onFilter={this.onFilter} fields={fields} />
        <Table onCellClick={this.onClickCell}>
          <TableHeader displaySelectAll={true}>
            <TableRow>
              <TableHeaderColumn tooltip="Key">Key</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((row, index) => (
               <TableRow key={index}>
                 <TableRowColumn>{row.get('key')}</TableRowColumn>
               </TableRow>
             ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableRowColumn style={{textAlign: 'center'}}>
                <ReactPaginate previousLabel={"previous"}
                               nextLabel={"next"}
                               breakLabel={<a>...</a>}
                               pageNum={this.state.page + 5}
                               marginPagesDisplayed={2}
                               pageRangeDisplayed={5}
                               clickCallback={this.handlePageClick}
                               containerClassName={"pagination"}
                               subContainerClassName={"pages pagination"}
                               activeClassName={"active"} />
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
