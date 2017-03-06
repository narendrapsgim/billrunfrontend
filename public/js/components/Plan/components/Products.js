import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import Product from './Product';

export default class Products extends Component {

  static propTypes = {
    onRemoveProduct: PropTypes.func,
    products: PropTypes.instanceOf(Immutable.List),
    editable: PropTypes.bool,
  }

  static defaultProps = {
    products: Immutable.List(),
    editable: true,
    onRemoveProduct: () => {},
  }

  shouldComponentUpdate(nextProps, nextState) { // eslint-disable-line no-unused-vars
    return !Immutable.is(this.props.products, nextProps.products)
      || this.props.editable !== nextProps.editable;
  }

  render() {
    const { products, editable } = this.props;
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        { products.map((product, i) =>
          <Product
            key={i}
            onRemoveProduct={this.props.onRemoveProduct}
            product={product}
            allowDelete={editable}
          />
        )}
      </div>
    );
  }

}
