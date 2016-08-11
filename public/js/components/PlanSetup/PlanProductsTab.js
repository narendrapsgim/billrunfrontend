import React, { Component } from 'react';
import { connect } from 'react-redux';
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


export default class PlanProductsTab extends Component {

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
  }

  componentWillMount() {
    const { planName } = this.props
    this.props.dispatch(getExistPlanProducts(planName));
  }

  componentWillUnmount() {
    this.props.dispatch(planProductsClear());
  }

  onSelectProduct (key) {
    const { planName, planProducts } = this.props
    if(!planProducts.some( (item) => item.get('key') === key)){
      this.props.dispatch(getProductByKey(key, planName));
    } else {
      this.props.dispatch(showStatusMessage(`Price of product ${key} already overridden for plan ${planName}`, 'warning'));
    }
  }

  onNewProductRestore(key, planName, usageType) {
    this.onProductInitRate(key, planName, usageType)
    this.props.dispatch(showStatusMessage(`Product ${key} prices for this plan restored to BASE state`, 'info'));
  }

  onProductRestore(key, ratePath){
    this.props.dispatch(restorePlanProduct(key, ratePath));
    this.props.dispatch(showStatusMessage(`Product ${key} prices for this plan restored to original state`, 'info'));
  }
  onProductRemove(key, ratePath){
    this.props.dispatch(removePlanProduct(key, ratePath));
    this.props.dispatch(showStatusMessage(`Product ${key} prices for this plan will be removed after save`, 'info'));
  }
  onProductUndoRemove(key, ratePath){
    this.props.dispatch(undoRemovePlanProduct(key, ratePath));
    this.props.dispatch(showStatusMessage(`Product ${key} prices restored`, 'success'));
  }
  onProductRemoveRate(key, path, idx){
    this.props.dispatch(planProductsRateRemove(key, path, idx));
  }
  onProductEditRate(key, path, value) {
    this.props.dispatch(planProductsRateUpdate(key, path, value));
  }
  onProductAddRate(key, path) {
    this.props.dispatch(planProductsRateAdd(key, path));
  }
  onProductInitRate(key, planName, usageType) {
    this.props.dispatch(planProductsRateInit(key, planName, usageType));
  }

  render() {
    const { planName, planProducts } = this.props
    console.log("render PlanProductsTab");
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

function mapStateToProps(state, props) {
  return  { planProducts: state.planProducts };
}
export default connect(mapStateToProps)(PlanProductsTab);
