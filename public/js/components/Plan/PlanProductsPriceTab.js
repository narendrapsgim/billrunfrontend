import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Panel, Form, FormGroup, Col, Row } from 'react-bootstrap';
import Immutable from 'immutable';

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

import { PlanDescription } from '../../FieldDescriptions';
import Help from '../Help';
import ProductSearch from './components/ProductSearch';
import PlanProduct from './components/PlanProduct';


class PlanProductsPriceTab extends Component {

  static propTypes = {
    planName : React.PropTypes.string
  };

  state = {
    planName: this.props.planName
  };

  componentWillMount() {
    const { planName } = this.state;
    if(planName){
      this.props.getExistPlanProducts(planName);
    }
  }

  componentWillUnmount() {
    this.props.planProductsClear();
  }

  onSelectProduct = (key) => {
    const { productPlanPrice } = this.props;
    const { planName } = this.state;
    if(!productPlanPrice.some( (prod) => prod === key)){
      this.props.getProductByKey(key, planName);
    } else {
      this.props.showWarning(`Price of product ${key} already overridden for plan ${planName}`);
    }
  }

  onProductRestore = (productName, productPath, existing = false) => {
    if(existing){
      this.props.restorePlanProduct(productName, productPath);
      this.props.showInfo(`Product ${productName} prices for this plan restored to original state`);
    } else {
      this.onProductInitRate(productName, productPath);
      this.props.showInfo(`Product ${productName} prices for this plan restored to BASE state`);
    }
  }

  onProductRemove = (productName, productPath, existing = false) => {
    this.props.removePlanProduct(productName, productPath, existing);
    if(existing){
      this.props.showInfo(`Product ${productName} prices for this plan will be removed after save`);
    }
  }

  onProductUndoRemove = (productName, productPath) => {
    this.props.undoRemovePlanProduct(productName, productPath);
    this.props.showSuccess(`Product ${productName} prices restored`);
  }
  onProductRemoveRate = (productName, productPath, index) => {
    this.props.planProductsRateRemove(productName, productPath, index);
  }
  onProductEditRate = (productName, productPath, value) => {
    this.props.planProductsRateUpdate(productName, productPath, value);
  }
  onProductAddRate = (productName, productPath) => {
    this.props.planProductsRateAdd(productName, productPath);
  }
  onProductInitRate = (productName, productPath) => {
    this.props.planProductsRateInit(productName, productPath);
  }

  renderNoItems = () => {
    return ( <Col lg={12}> No overridden prices for this plan </Col> );
  }

  renderItems = () => {
    const { planName } = this.state;
    const { planProducts, productPlanPrice } = this.props;

    return productPlanPrice.map( (key, i) => {
      var prod = planProducts.get(key);
      return (
        <PlanProduct key={prod.getIn(['_id', '$id'])}
            index={i}
            count={productPlanPrice.size}
            item={prod}
            planName={planName}
            onProductRemove={this.onProductRemove}
            onProductUndoRemove={this.onProductUndoRemove}
            onProductRemoveRate={this.onProductRemoveRate}
            onProductEditRate={this.onProductEditRate}
            onProductAddRate={this.onProductAddRate}
            onProductInitRate={this.onProductInitRate}
            onProductRestore={this.onProductRestore}
        />
      )
    });
  }

  render() {
    const { planName } = this.state;
    const { productPlanPrice } = this.props;

    if(typeof planName === 'undefined' || planName === null || planName.length === 0){
      return (<p>Override Product Price available only in edit mode</p>);
    }

    return (
      <Row>
        <Col lg={8}>
          <Form>

            <Panel header={<h3>Select Products to Override Price <Help contents={PlanDescription.add_product} /></h3>}>
              <ProductSearch onSelectProduct={this.onSelectProduct}/>
            </Panel>

            <Panel header={<h3>Overridden Products Prices for Plan &quot;{planName}&quot;</h3>}>
              { this.props.productPlanPrice.size > 0 ? this.renderItems() : this.renderNoItems() }
            </Panel>

          </Form>
        </Col>
      </Row>
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
    planName: state.plan.get('name'),
    planProducts: state.planProducts.planProducts,
    productPlanPrice: state.planProducts.productPlanPrice
 };
}
export default connect(mapStateToProps, mapDispatchToProps)(PlanProductsPriceTab);
