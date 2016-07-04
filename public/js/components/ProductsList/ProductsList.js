import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getProducts } from '../../actions/productsActions';

import {Table, TableBody, TableHeader, TableFooter, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import ReactPaginate from 'react-paginate';

class ProductsList extends Component {
  constructor(props) {
    super(props);

    this.onClickCell = this.onClickCell.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);

    this.state = {
      page: 1,
      size: 10
    };
  }

  componentWillMount() {
    this.props.dispatch(getProducts());
  }
  
  onClickCell(cell_idx, col_idx, e) {
    let { products } = this.props;
    let id = products.valueSeq().get(cell_idx).getIn(['_id', '$id']);;
    this.context.router.push(`product_setup/${id}`);
  }

  buildQuery() {
    return {
      page: this.state.page,
      size: this.state.size
    };
  }  
  
  handlePageClick(data) {
    let page = data.selected + 1;
    this.setState({page}, () => {
      this.props.dispatch(getProducts(this.buildQuery()))
    });
  }
  
  render() {
    let { products } = this.props;

    return (
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
