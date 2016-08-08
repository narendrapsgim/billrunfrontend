import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import { updateProductPropertiesField, updateProductPrefixes, addProductProperties, removeProductProperties, getProduct, saveProduct, clearProduct } from '../../actions/productActions';
import { getSettings } from '../../actions/settingsActions';
import { addUsagetMapping, getInputProcessors } from '../../actions/inputProcessorActions';

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
    this.onChangePrefix = this.onChangePrefix.bind(this);
    this.onSelectUnit = this.onSelectUnit.bind(this);
  }

  componentWillMount() {
    let { product_id } = this.props.location.query;
    if (product_id) {
      this.props.dispatch(getProduct(product_id));
    }
    this.props.dispatch(getSettings("unit_types"));
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
    this.props.dispatch((updateProductPrefixes(val)));
  }

  onSelectUnit(val) {
    const { unit_types } = this.props;
    const found = unit_types.find(obj => {
      return obj.get('usaget') === val;
    });
    if (!found) {
      this.props.dispatch(addUsagetMapping({
        usaget: val,
        pattern: `/${val}/`
      }));
    }
    this.props.dispatch(updateProductPropertiesField("unit", -1, val));
  }
  
  onSave() {
    const { action } = this.props.location.query;
    this.props.dispatch(saveProduct(this.props.product, action));
    browserHistory.goBack();
  }

  onCancel() {
    browserHistory.goBack();
  }

  render() {
    const { unit_types } = this.props;
    return (
      <div className="ProductSetup container">
        <h3>Product</h3>
        <div className="contents bordered-container">
          <Product onChangeItemSelectFieldValue={this.onChangeItemSelectFieldValue} onChangeItemFieldValue={this.onChangeItemFieldValue} onAddProductProperties={this.onAddProductProperties} onRemoveProductProperties={this.onRemoveProductProperties} onChangePrefix={this.onChangePrefix} product={this.props.product} onSelectUnit={this.onSelectUnit} unitTypes={unit_types} />
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
  return { product: state.product, unit_types: state.settings.get('unit_types') };
}
export default connect(mapStateToProps)(ProductSetup);
