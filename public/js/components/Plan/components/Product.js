import React, { Component, PropTypes } from 'react';
import Chip from 'material-ui/Chip';

export default class Product extends Component {

  static propTypes = {
    onRemoveProduct: PropTypes.func,
    product: PropTypes.string.isRequired,
    allowDelete: PropTypes.bool,
  }

  static defaultProps = {
    allowDelete: true,
  };

  shouldComponentUpdate(nextProps, nextState) { // eslint-disable-line no-unused-vars
    return this.props.product !== nextProps.product
      || this.props.allowDelete !== nextProps.allowDelete;
  }

  onRemoveProduct =() => {
    const { product } = this.props;
    this.props.onRemoveProduct(product);
  }

  render() {
    const { product, allowDelete } = this.props;
    const style = { margin: 4 };
    if (allowDelete) {
      return (
        <Chip style={style} onRequestDelete={this.onRemoveProduct}>
          {product}
        </Chip>
      );
    }
    return (<Chip style={style}>{product}</Chip>);
  }

}
