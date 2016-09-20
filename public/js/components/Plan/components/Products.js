import React, { Component } from 'react';
import { FormGroup, Col, ControlLabel } from 'react-bootstrap';
import Chip from 'material-ui/Chip';

export default class PlanIncludeGroupProducts extends Component {

  constructor(props) {
    super(props);
    this.removeProduct = this.removeProduct.bind(this);
  }

  removeProduct(productKey){
    if(productKey){
      this.props.onRemoveProduct(productKey);
    }
  }

  render() {
    const { products } = this.props;

    return (
          <div style={{ display: 'flex', flexWrap: 'wrap'}}>
            { products.map( (product, i) => {
              return (
                <Chip
                  key={i}
                  onRequestDelete={this.removeProduct.bind(null, product)}
                  style={{ margin: 4 }}
                >
                  {product}
                </Chip>
              )}
            )}
        </div>
    );
  }

}
