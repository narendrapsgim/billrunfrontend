import React, { Component } from 'react';
import { FormGroup, Col, ControlLabel } from 'react-bootstrap';
import Chip from 'material-ui/Chip';

export default class PlanIncludeGroupProducts extends Component {

  static propTypes = {
    onRemoveProduct: React.PropTypes.func.isRequired
  }

  static defaultProps = {
    products: []
  }

  render() {
    const { products } = this.props;

    return (
      <div style={{ display: 'flex', flexWrap: 'wrap'}}>
        { products.map( (product, i) =>
          <Chip key={i} style={{ margin: 4 }} onRequestDelete={ () => {this.props.onRemoveProduct(product)} } >
            {product}
          </Chip>
        )}
      </div>
    );
  }

}
