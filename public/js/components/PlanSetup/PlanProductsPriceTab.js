import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Help from '../Help';
import { PlanDescription } from '../../FieldDescriptions';
import PlanProductsPriceList from './components/PlanProductsPriceList';
import ProductSearch from './components/ProductSearch';
import {
  getProductByKey,
  getExistPlanProducts,
  removePlanProduct,
  restorePlanProduct,
  undoRemovePlanProduct,
  planProductsRateRemove,
  planProductsRateAdd,
  planProductsRateUpdate,
  planProductsRateInit,
  planProductsClear } from '../../actions/planProductsActions';
import { showSuccess, showWarning, showDanger, showInfo } from '../../actions/alertsActions';


class PlanProductsPriceTab extends Component {

  constructor(props) {
    super(props);
    this.onSelectProduct = this.onSelectProduct.bind(this);
    this.onProductRemove = this.onProductRemove.bind(this);
    this.onProductRestore = this.onProductRestore.bind(this);
    this.onNewProductRestore = this.onNewProductRestore.bind(this);
    this.onProductUndoRemove = this.onProductUndoRemove.bind(this);
    this.onProductRemoveRate = this.onProductRemoveRate.bind(this);
    this.onProductEditRate = this.onProductEditRate.bind(this);
    this.onProductAddRate = this.onProductAddRate.bind(this);
    this.onProductInitRate = this.onProductInitRate.bind(this);
    this.state = {planName: props.planName};
  }

  componentWillMount() {
    const { planName } = this.state;
    if(planName){
      this.props.getExistPlanProducts(planName);
    }
  }

  componentWillUnmount() {
    this.props.planProductsClear();
  }

  onSelectProduct (key) {
    const { productPlanPrice } = this.props;
    const { planName } = this.state;
    if(!productPlanPrice.some( (prod) => prod === key)){
      this.props.getProductByKey(key, planName);
    } else {
      this.props.showWarning(`Price of product ${key} already overridden for plan ${planName}`);
    }
  }

  onNewProductRestore(key, ratePath) {
    this.onProductInitRate(key, ratePath);
    this.props.showInfo(`Product ${key} prices for this plan restored to BASE state`);
  }

  onProductRestore(key, ratePath){
    this.props.restorePlanProduct(key, ratePath);
    this.props.showInfo(`Product ${key} prices for this plan restored to original state`);
  }
  onProductRemove(key, ratePath){
    this.props.removePlanProduct(key, ratePath);
    this.props.showInfo(`Product ${key} prices for this plan will be removed after save`);
  }
  onProductUndoRemove(key, ratePath){
    this.props.undoRemovePlanProduct(key, ratePath);
    this.props.showSuccess(`Product ${key} prices restored`);
  }
  onProductRemoveRate(key, path, idx){
    this.props.planProductsRateRemove(key, path, idx);
  }
  onProductEditRate(key, path, value) {
    this.props.planProductsRateUpdate(key, path, value);
  }
  onProductAddRate(key, path) {
    this.props.planProductsRateAdd(key, path);
  }
  onProductInitRate(key, path) {
    this.props.planProductsRateInit(key, path);
  }

  render() {
    const { planProducts, productPlanPrice } = this.props;
    const { planName } = this.state;

    if(typeof planName === 'undefined' || planName === null || planName.length === 0){
      return (<p>Override Product Price available only in edit mode</p>);
    }

    return (
      <form className="form-horizontal basic-products-settings">
        <div className="add-products">
          <div key="select-product">
            <h4>Select Products <Help contents={PlanDescription.add_product} /></h4>
            <ProductSearch onSelectProduct={this.onSelectProduct}/>
          </div>
          <PlanProductsPriceList
            planName={planName}
            planProducts={planProducts}
            productPlanPrice={productPlanPrice}
            onProductRemove={this.onProductRemove}
            onProductUndoRemove={this.onProductUndoRemove}
            onProductRestore={this.onProductRestore}
            onProductRemoveRate={this.onProductRemoveRate}
            onProductEditRate={this.onProductEditRate}
            onProductAddRate={this.onProductAddRate}
            onProductInitRate={this.onProductInitRate}
            onNewProductRestore={this.onNewProductRestore}
          />
        </div>
      </form>
    );
  }

}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getProductByKey,
    getExistPlanProducts,
    removePlanProduct,
    restorePlanProduct,
    undoRemovePlanProduct,
    planProductsRateRemove,
    planProductsRateAdd,
    planProductsRateUpdate,
    planProductsRateInit,
    planProductsClear,
    showSuccess,
    showWarning,
    showDanger,
    showInfo }, dispatch);
}

function mapStateToProps(state, props) {
  return  {
    planProducts: state.planProducts.get('planProducts'),
    productPlanPrice: state.planProducts.get('productPlanPrice')
 };
}
export default connect(mapStateToProps, mapDispatchToProps)(PlanProductsPriceTab);
