import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import { updateProductPropertiesField, addProductProperties, removeProductProperties, getProduct, clearPlan } from '../../actions';

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

  componentWillUnmount() {
    this.props.dispatch(clearPlan());
  }
  
  onChangeItemFieldValue(id, idx, e, val) {
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
    console.log("on save");
  }

  onCancel() {
    browserHistory.goBack();
  }

  render() {
    return (<Product onChangeItemSelectFieldValue={this.onChangeItemSelectFieldValue} onChangeItemFieldValue={this.onChangeItemFieldValue} onAddProductProperties={this.onAddProductProperties} onRemoveProductProperties={this.onRemoveProductProperties} />);
  }
}

function mapStateToProps(state, props) {
  return state.plan || {};
}
export default connect(mapStateToProps)(ProductSetup);
