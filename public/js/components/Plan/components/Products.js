import React, { Component } from 'react';
import { FormGroup, Col, ControlLabel } from 'react-bootstrap';
import Product from './Product';
import Immutable from 'immutable';

export default class Products extends Component {

  static defaultProps = {
    products: Immutable.List(),
  }

  static propTypes = {
    onRemoveProduct: React.PropTypes.func.isRequired,
    products: React.PropTypes.instanceOf(Immutable.List)
  }

  render() {
    const { products } = this.props;

    return (
      <div style={{ display: 'flex', flexWrap: 'wrap'}}>
        { products.map( (product, i) => <Product key={i} onRemoveProduct={this.props.onRemoveProduct} product={product} /> )}
      </div>
    );
  }

}
