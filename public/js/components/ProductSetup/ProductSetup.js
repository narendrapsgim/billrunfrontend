import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import { updateProductPropertiesField, addProductProperties, removeProductProperties, getProduct, saveProduct } from '../../actions/productActions';
import { getInputProcessors } from '../../actions/inputProcessorActions';

import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Product from './Product';

class ProductSetup extends Component {
  constructor(props) {
    super(props);

    this.onAddProductProperties = this.onAddProductProperties.bind(this);
    this.onSave = this.onSave.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onChangeItemFieldValue = this.onChangeItemFieldValue.bind(this);
    this.onChangeItemSelectFieldValue = this.onChangeItemSelectFieldValue.bind(this);
    this.onRemoveProductProperties = this.onRemoveProductProperties.bind(this);
  }

  componentWillMount() {
    let { product_id } = this.props.location.query;
    if (product_id) {
      this.props.dispatch(getProduct(product_id));
    }
    this.props.dispatch(getInputProcessors());
  }
  
  onChangeItemFieldValue(id, idx, e, val = e.target.value) {
    this.props.dispatch(updateProductPropertiesField(id, idx, val));
  }

  onChangeItemSelectFieldValue(id, idx, e) {
    this.props.dispatch(updateProductPropertiesField(id, idx, e.target.value));
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
          <Product onChangeItemSelectFieldValue={this.onChangeItemSelectFieldValue} onChangeItemFieldValue={this.onChangeItemFieldValue} onAddProductProperties={this.onAddProductProperties} onRemoveProductProperties={this.onRemoveProductProperties} productSettings={this.props.product} processors={this.props.inputProcessors} />
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
  return { product: state.product, inputProcessors: state.inputProcessors };
}
export default connect(mapStateToProps)(ProductSetup);
