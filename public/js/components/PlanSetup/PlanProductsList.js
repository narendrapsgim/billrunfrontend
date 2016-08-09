import React, { Component } from 'react';
import { connect } from 'react-redux';
import FontIcon from 'material-ui/FontIcon';

import Field from '../Field';
import Help from '../Help';
import { PlanDescription } from '../../FieldDescriptions';
import ProductPricePlanOverride from '../ProductSetup/ProductPricePlanOverride';
import {
  getExistPlanProducts,
  removePlanProduct,
  undoRemovePlanProduct,
  planProductsRateRemove,
  planProductsRateAdd,
  planProductsRateUpdate,
  planProductsClear } from '../../actions/planProductsActions';

export default class PlanProductsList extends Component {

  constructor(props) {
    super(props);
    this.renderContent = this.renderContent.bind(this);
    this.onProductRemove = this.onProductRemove.bind(this);
    this.onProductUndoRemove = this.onProductUndoRemove.bind(this);
    this.onProductRemoveRate = this.onProductRemoveRate.bind(this);
    this.onProductEditRate = this.onProductEditRate.bind(this);
    this.onProductAddRate = this.onProductAddRate.bind(this);

    this.state = {};
  }

  componentWillMount() {
    let { units } = this.props;
    this.props.dispatch(getExistPlanProducts(units));
  }

  componentWillUnmount() {
    this.props.dispatch(planProductsClear());
  }

  onProductRemove(key){
    if(key){
      this.props.dispatch(removePlanProduct(key));
    }
  }
  onProductUndoRemove(key){
    if(key){
      this.props.dispatch(undoRemovePlanProduct(key));
    }
  }
  onProductRemoveRate(key, idx){
    if(key && typeof idx !== 'undefined'){
      this.props.dispatch(planProductsRateRemove(key, idx));
    }
  }
  onProductEditRate(key, id, idx, value) {
    if(key && typeof id !== 'undefined' && typeof idx !== 'undefined'){
      this.props.dispatch(planProductsRateUpdate(key, id, idx, value));
    }
  }
  onProductAddRate(key) {
    if(key){
      this.props.dispatch(planProductsRateAdd(key));
    }
  }


  renderContent(){
    const {planProducts} = this.props;
    let content = null;
    if(planProducts.size){
      content = [];
      this.props.planProducts.forEach( (prod, i) => content.push(
        <div key={prod.get('id')}>
          <hr/>
          <ProductPricePlanOverride item={prod}
            onProductRemove={this.onProductRemove}
            onProductUndoRemove={this.onProductUndoRemove}
            onProductRemoveRate={this.onProductRemoveRate}
            onProductEditRate={this.onProductEditRate}
            onProductAddRate={this.onProductAddRate}
          />
        </div>
      ));
    } else {
      content = (
        <div>
          <hr/>
          No overridden prices for this plan
        </div>
      );
    }
    return content;
  }


  render() {
    return (
      <div className="form-horizontal basic-products-settings">
        {this.renderContent()}
      </div>
    );
  }

}

function mapStateToProps(state, props) {
  return  { planProducts: state.planProducts };
}

export default connect(mapStateToProps)(PlanProductsList);
