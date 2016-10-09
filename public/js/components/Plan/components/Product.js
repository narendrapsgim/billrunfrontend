import React, { Component } from 'react';
import Chip from 'material-ui/Chip';

export default class Product extends Component {

  static propTypes = {
    onRemoveProduct: React.PropTypes.func.isRequired,
    product: React.PropTypes.string.isRequired
  }

  shouldComponentUpdate(nextProps, nextState){
    return this.props.product != nextProps.product;
  }

  onRemoveProduct =() => {
    const { product } = this.props;
    this.props.onRemoveProduct(product);
  }

  render() {
    const { product } = this.props;
    return (
      <Chip style={{ margin: 4 }} onRequestDelete={this.onRemoveProduct}>
        {product}
      </Chip>
    );
  }

}
