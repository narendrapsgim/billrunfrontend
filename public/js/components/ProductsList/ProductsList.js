import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getProducts } from '../../actions/productsActions';

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

class ProductsList extends Component {
  constructor(props) {
    super(props);

    this.onClickCell = this.onClickCell.bind(this);
  }

  componentWillMount() {
    this.props.dispatch(getProducts());
  }
  
  onClickCell(cell_idx, col_idx, e) {
    let { products } = this.props;
    let id = products.valueSeq().get(cell_idx).getIn(['_id', '$id']);;
    this.context.router.push(`product_setup/${id}`);
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
