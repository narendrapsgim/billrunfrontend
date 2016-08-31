import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PlanProductsList from './PlanProductsList'
import PlanProductsSelect from './PlanProductsSelect'
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
import { showStatusMessage } from '../../actions';


class PlanProductsTab extends Component {

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
    this.props.getExistPlanProducts(planName);
  }

  componentWillUnmount() {
    this.props.planProductsClear();
  }

  onSelectProduct (key) {
    const { planProducts } = this.props;
    const { planName } = this.state;
    if(!planProducts.some( (item) => item.get('key') === key)){
      this.props.getProductByKey(key, planName);
    } else {
      this.props.showStatusMessage(`Price of product ${key} already overridden for plan ${planName}`, 'warning');
    }
  }

  onNewProductRestore(key, planName, usageType) {
    this.onProductInitRate(key, planName, usageType)
    this.props.showStatusMessage(`Product ${key} prices for this plan restored to BASE state`, 'info');
  }

  onProductRestore(key, ratePath){
    this.props.restorePlanProduct(key, ratePath);
    this.props.showStatusMessage(`Product ${key} prices for this plan restored to original state`, 'info');
  }
  onProductRemove(key, ratePath){
    this.props.removePlanProduct(key, ratePath);
    this.props.showStatusMessage(`Product ${key} prices for this plan will be removed after save`, 'info');
  }
  onProductUndoRemove(key, ratePath){
    this.props.undoRemovePlanProduct(key, ratePath);
    this.props.showStatusMessage(`Product ${key} prices restored`, 'success');
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
  onProductInitRate(key, planName, usageType) {
    this.props.planProductsRateInit(key, planName, usageType);
  }

  render() {
    const { planProducts } = this.props;
    const { planName } = this.state;

    if(typeof planName === 'undefined' || planName === null || planName.length === 0){
      return null;
    }

    return (
      <form className="form-horizontal basic-products-settings">
        <div className="add-products">
          <PlanProductsSelect onSelectProduct={this.onSelectProduct}/>
          <PlanProductsList
            planName={planName}
            planProducts={planProducts}
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
    showStatusMessage }, dispatch);
}

function mapStateToProps(state, props) {
  return  { planProducts: state.planProducts };
}
export default connect(mapStateToProps, mapDispatchToProps)(PlanProductsTab);
