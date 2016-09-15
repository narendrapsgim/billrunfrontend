import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import Immutable from 'immutable';

import { updateProductPropertiesField, updateProductPrefixes, addProductProperties, removeProductProperties, getProduct, saveProduct, clearProduct } from '../../actions/productActions';
import { getSettings } from '../../actions/settingsActions';
import { addUsagetMapping, getInputProcessors } from '../../actions/inputProcessorActions';
import { PageHeader, Tabs, Tab } from 'react-bootstrap';

import Product from './Product';

class ProductSetup extends Component {
  constructor(props) {
    super(props);

    this.onAddProductProperties = this.onAddProductProperties.bind(this);
    this.onSave = this.onSave.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onChangeItemFieldValue = this.onChangeItemFieldValue.bind(this);
    this.onChangeDateFieldValue = this.onChangeDateFieldValue.bind(this);
    this.onChangeItemSelectFieldValue = this.onChangeItemSelectFieldValue.bind(this);
    this.onRemoveProductProperties = this.onRemoveProductProperties.bind(this);
    this.onChangePrefix = this.onChangePrefix.bind(this);
    this.onSelectUnit = this.onSelectUnit.bind(this);
  }

  componentWillMount() {
    const { productId } = this.props.location.query;
    if (productId) {
      this.props.dispatch(getProduct(productId));
    }
    this.props.dispatch(getSettings("usage_types"));
  }

  componentWillUnmount() {
    this.props.dispatch(clearProduct());
  }
  
  onChangeItemFieldValue(id, idx, e) {
    const { value, type, checked } = e.target;
    const { dispatch } = this.props;
    type === "checkbox" ?
                         dispatch(updateProductPropertiesField(id, idx, checked)) :
                         dispatch(updateProductPropertiesField(id, idx, value));
  }

  onChangeDateFieldValue(id, val) {
    const { dispatch } = this.props;s
    dispatch(updateProductPropertiesField(id, -1, val));
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

  onChangePrefix(val) {
    this.props.dispatch((updateProductPrefixes(Immutable.fromJS(val))));
  }

  onSelectUnit(val) {
    const { usage_types } = this.props;
    const found = usage_types.find(usaget => {
      return usaget === val;
    });
    if (!found) {
      this.props.dispatch(addUsagetMapping(val));
    }
    this.props.dispatch(updateProductPropertiesField("unit", -1, val));
  }
  
  onSave() {
    const { action } = this.props.location.query;
    const cb = (err) => {
      if (!err) browserHistory.goBack();
    };
    this.props.dispatch(saveProduct(this.props.product, action, cb));
  }

  onCancel() {
    browserHistory.goBack();
  }

  render() {
    const { usage_types } = this.props;
    return (
      <div className="panel panel-default"> 
        <div className="panel-body">
          <Product onChangeItemSelectFieldValue={this.onChangeItemSelectFieldValue} onChangeItemFieldValue={this.onChangeItemFieldValue} onChangeDateFieldValue={this.onChangeDateFieldValue} onAddProductProperties={this.onAddProductProperties} onRemoveProductProperties={this.onRemoveProductProperties} onChangePrefix={this.onChangePrefix} product={this.props.product} onSelectUnit={this.onSelectUnit} usageTypes={usage_types} />
        <div style={{marginTop: 12, float: "left"}}>
        <button
              className="btn btn-primary"
              onClick={this.onSave}
              style={{ marginRight: "10px" }}
          >Save
        </button>  
        <button
              className="btn btn-default"
              onClick={this.onCancel}
          >Cancel
          </button>
          </div>
        </div>
     </div>
    );
  }
}

function mapStateToProps(state, props) {
  return { product: state.product  || Immutable.Map(),
    usage_types: state.settings.get('usage_types') };
}
export default connect(mapStateToProps)(ProductSetup);
