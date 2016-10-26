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
    getProductByKey: React.PropTypes.func.isRequired,
    getExistPlanProducts: React.PropTypes.func.isRequired,
    removePlanProduct: React.PropTypes.func.isRequired,
    restorePlanProduct: React.PropTypes.func.isRequired,
    undoRemovePlanProduct: React.PropTypes.func.isRequired,
    planProductsRateRemove: React.PropTypes.func.isRequired,
    planProductsRateAdd: React.PropTypes.func.isRequired,
    planProductsRateUpdate: React.PropTypes.func.isRequired,
    planProductsRateInit: React.PropTypes.func.isRequired,
    planProductsClear: React.PropTypes.func.isRequired,
    showSuccess: React.PropTypes.func.isRequired,
    showWarning: React.PropTypes.func.isRequired,
    showDanger: React.PropTypes.func.isRequired,
    showInfo: React.PropTypes.func.isRequired,
    planName : React.PropTypes.string.isRequired,
    productsKeys : React.PropTypes.instanceOf(Immutable.List),
    planProducts : React.PropTypes.instanceOf(Immutable.Map),
  };

  static defaultProps = {
    planName: '',
    productsKeys: Immutable.List()
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
    const { productsKeys } = this.props;
    const { planName } = this.state;

    if(!productsKeys.includes(key)){
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
    const { planProducts, productsKeys } = this.props;
    const count = productsKeys.size;
    return productsKeys.map( (key, i) => {
      var prod = planProducts.get(key);
      return (
        <PlanProduct key={prod.getIn(['_id', '$id'])}
            index={i}
            count={count}
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
    const { productsKeys } = this.props;

    if(typeof planName === 'undefined' || planName === null || planName.length === 0){
      return (<p>Override Product Price available only in edit mode</p>);
    }

    return (
      <Row>
        <Col lg={12}>
          <Form>

            <Panel header={<h3>Select Products to Override Price <Help contents={PlanDescription.add_product} /></h3>}>
              <ProductSearch onSelectProduct={this.onSelectProduct}/>
            </Panel>

            { productsKeys.size > 0 ? this.renderItems() : this.renderNoItems() }

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
    productsKeys: state.planProducts.productPlanPrice
 };
}
export default connect(mapStateToProps, mapDispatchToProps)(PlanProductsPriceTab);
