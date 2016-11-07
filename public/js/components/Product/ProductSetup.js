import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';
import Immutable from 'immutable';
import { Row, Col, Panel, Button } from 'react-bootstrap';

import {
  onRateAdd,
  onRateRemove,
  onFieldUpdate,
  onUsagetUpdate,
  getProduct,
  saveProduct,
  clearProduct } from '../../actions/productActions';
import { getSettings } from '../../actions/settingsActions';
import { addUsagetMapping } from '../../actions/inputProcessorActions';
import { setPageTitle } from '../../actions/guiStateActions/pageActions';

import Product from './Product';

class ProductSetup extends Component {

  static propTypes = {
    router: React.PropTypes.shape({
      push: React.PropTypes.func.isRequired
    }).isRequired
  }

  componentWillMount() {
    const { productId } = this.props.location.query;
    if (productId) {
      this.props.getProduct(productId);
    }
    this.props.getSettings("usage_types");
  }

  componentDidMount() {
    const { action } = this.props.location.query;
    if (action !== 'update') {
      this.props.setPageTitle('Create New Product');
    }
  }

  componentWillReceiveProps(nextProps) {
    const { action } = this.props.location.query;
    const { product } = nextProps;
    const { product: oldItem } = this.props;
    if (action === 'update' && oldItem.get('key') !== product.get('key')) {
      this.props.setPageTitle(`Edit product - ${product.get('key')}`);
    }
  }

  componentWillUnmount() {
    this.props.clearProduct();
  }

  onFieldUpdate = (path, value) => {
    this.props.onFieldUpdate(path, value)
  }

  onUsagetUpdate = (path, oldUsaget, newUsaget) => {
    const { usage_types } = this.props;
    if(newUsaget.length > 0 && !usage_types.includes(newUsaget)){
      this.props.addUsagetMapping(newUsaget);
    }
    this.props.onUsagetUpdate(path, oldUsaget, newUsaget);
  }


  onProductRateAdd = (productPath) => {
    this.props.onRateAdd(productPath)
  }

  onProductRateRemove = (productPath, index) => {
    this.props.onRateRemove(productPath, index)
  }

  handleBack = () => {
    this.props.router.push('/products');
  }

  handleSave = () => {
    const { product } = this.props;
    const { action } = this.props.location.query;
    this.props.saveProduct(product, action, this.afterSave);
  }

  afterSave = (data) => {
    if(typeof data.error !== 'undefined' && data.error.length){
      console.log("error on save : ", data);
    } else {
      this.props.router.push('/products');
    }
  }

  render() {
    const { usage_types, product } = this.props;
    const { action } = this.props.location.query;

    //in update mode wait for product before render edit screen
    if(action === 'update' && typeof product.getIn(['_id', '$id']) === 'undefined'){
      return <div>Loading...</div>
    }

    const usaget = (product.get('rates', Immutable.Map() ).keySeq().first()) ? product.get('rates').keySeq().first() : '';

    return (
      <Col lg={12}>
        <Panel>
          <Product product={product} mode={action} planName="BASE"
              usaget={usaget}
              usageTypes={usage_types}
              onFieldUpdate={this.onFieldUpdate}
              onUsagetUpdate={this.onUsagetUpdate}
              onProductRateAdd={this.onProductRateAdd}
              onProductRateRemove={this.onProductRateRemove}
          />
        </Panel>
        <div style={{marginTop: 12}}>
          <Button onClick={this.handleSave} bsStyle="primary" style={{marginRight: 10}} >Save</Button>
          <Button onClick={this.handleBack} bsStyle="default" >Cancel</Button>
        </div>
     </Col>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    setPageTitle,
    getSettings,
    addUsagetMapping,
    onFieldUpdate,
    onRateAdd,
    onRateRemove,
    onUsagetUpdate,
    getProduct,
    saveProduct,
    clearProduct }, dispatch);
}
function mapStateToProps(state, props) {
  return {
    product: state.product,
    usage_types: state.settings.get('usage_types') || Immutable.List() };
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProductSetup));
