import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import { updateProductPropertiesField, addProductProperties, removeProductProperties, getProduct, saveProduct } from '../../actions/productActions';

import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Product from './Product';

class ProductSetup extends Component {
  constructor(props) {
    super(props);

    this.onAddProductProperties = this.onAddProductProperties.bind(this);
    this.onSave = this.onSave.bind(this);
    this.onCancel = this.onCancel.bind(this);
  }

  componentWillMount() {
    let { product_id } = this.props.params;
    if (product_id) {
      this.props.dispatch(getProduct(product_id));
    }
  }
  
  onChangeItemFieldValue(id, idx, e, val = e.target.value) {
    this.props.dispatch(updateProductPropertiesField(id, idx, val));
  }

  onChangeItemSelectFieldValue(id, idx, e, sidx, val) {
    this.props.dispatch(updateProductPropertiesField(id, idx, val));
  }

  onAddProductProperties() {
    this.props.dispatch(addProductProperties());
  }

  onRemoveProductProperties(idx) {
    this.props.dispatch(removeProductProperties(idx));
  }  

  onSave() {
    this.props.dispatch(saveProduct());
  }

  onCancel() {
    browserHistory.goBack();
  }

  render() {
    return (
      <div className="ProductSetup container">
        <h3>Product</h3>
        <div className="contents bordered-container">
          <Product onChangeItemSelectFieldValue={this.onChangeItemSelectFieldValue} onChangeItemFieldValue={this.onChangeItemFieldValue} onAddProductProperties={this.onAddProductProperties} onRemoveProductProperties={this.onRemoveProductProperties} />
        </div>
        <div style={{marginTop: 12, float: "right"}}>
          <FlatButton
              label="Cancel"
              onTouchTap={this.onCancel}
              style={{marginRight: 12}}
          />
          <RaisedButton
              label='Save'
              primary={true}
              onTouchTap={this.onSave}
          />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return state.product || {};
}
export default connect(mapStateToProps)(ProductSetup);
