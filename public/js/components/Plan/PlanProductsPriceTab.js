import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Panel, Form, Col, Row } from 'react-bootstrap';
import Immutable from 'immutable';
import LoadingItemPlaceholder from '../Elements/LoadingItemPlaceholder';
import PlanProduct from './components/PlanProduct';
import PlanProductRemoved from './components/PlanProductRemoved';
import { PlanDescription } from '../../FieldDescriptions';
import Help from '../Help';
import ProductSearch from './components/ProductSearch';
import { getProductsByKeysQuery, getProductByKeyQuery } from '../../common/ApiQueries';
import { showSuccess, showWarning, showInfo } from '../../actions/alertsActions';
import { getList, clearList } from '../../actions/listActions';
import {
  removePlanProduct,
  onPlanFieldUpdate,
  planProductsRateRemove,
  planProductsRateAdd,
  planProductsRateUpdate,
  planProductsRateUpdateTo,
  planProductsRateInit,
} from '../../actions/planActions';


class PlanProductsPriceTab extends Component {

  static propTypes = {
    plan: PropTypes.instanceOf(Immutable.Map),
    planProducts: PropTypes.instanceOf(Immutable.List),
    originalRates: PropTypes.instanceOf(Immutable.Map),
    dispatch: PropTypes.func.isRequired,
  };

  static defaultProps = {
    plan: Immutable.Map(),
    planProducts: Immutable.List(),
    originalRates: Immutable.Map(),
  };

  componentWillMount() {
    const { plan } = this.props;
    const productKeys = plan.get('rates', Immutable.Map()).map((rate, key) => key).toArray();
    if (productKeys.length) {
      this.props.dispatch(getList('plan_products', getProductsByKeysQuery(productKeys)));
    }
  }

  componentWillUnmount() {
    this.props.dispatch(clearList('plan_products'));
  }

  addNewProductToPlan = (products) => {
    const { planProducts } = this.props;
    products.forEach((product) => {
      const newProduct = planProducts.find(planProd => planProd.get('key', '') === product.key);
      if (newProduct) {
        const usaget = newProduct.get('rates', Immutable.Map()).keySeq().first();
        const productPath = ['rates', newProduct.get('key', ''), usaget];
        this.props.dispatch(planProductsRateInit(newProduct, productPath));
      }
    });
  }

  onSelectProduct = (key) => {
    const { plan } = this.props;
    const productKeys = plan.get('rates', Immutable.Map()).map((rate, productKey) => productKey);
    if (productKeys.includes(key)) {
      this.props.dispatch(showWarning(`Price of product ${key} already overridden`));
    } else {
      this.props.dispatch(getList('plan_products', getProductByKeyQuery(key), false))
        .then((result) => {
          if (result.status) {
            this.addNewProductToPlan(result.data);
          }
        });
    }
  }

  onProductRestore = (product, productPath) => {
    const { originalRates } = this.props;
    const productName = product.get('key');
    const originalKeys = originalRates.keySeq();
    if (originalKeys.includes(productName)) {
      const prices = originalRates.get(productName, Immutable.Map());
      this.props.dispatch(onPlanFieldUpdate(['rates', productName], prices));
      this.props.dispatch(showInfo(`Product ${productName} prices for this plan restored to original state`));
    } else {
      this.props.dispatch(planProductsRateInit(product, productPath));
      this.props.dispatch(showInfo(`Product ${productName} prices for this plan restored to BASE state`));
    }
  }

  onProductRemove = (productPath, productName) => {
    this.props.dispatch(removePlanProduct(productPath, productName));
  }

  onProductUndoRemove = (productName) => {
    const { originalRates } = this.props;
    const prices = originalRates.get(productName, Immutable.Map());
    this.props.dispatch(onPlanFieldUpdate(['rates', productName], prices));
    this.props.dispatch(showSuccess(`Product ${productName} prices restored`));
  }

  onProductRemoveRate = (productPath, index) => {
    this.props.dispatch(planProductsRateRemove(productPath, index));
  }

  onProductEditRate = (productPath, value) => {
    this.props.dispatch(planProductsRateUpdate(productPath, value));
  }

  onProductEditRateTo = (productPath, index, value) => {
    this.props.dispatch(planProductsRateUpdateTo(productPath, index, value));
  }

  onProductAddRate = (productPath) => {
    this.props.dispatch(planProductsRateAdd(productPath));
  }

  onProductInitRate = (product, productPath) => {
    this.props.dispatch(planProductsRateInit(product, productPath));
  }

  renderNoItems = () => (<Col lg={12}> No overridden prices for this plan </Col>)

  getRemovedProductKeys = () => {
    const { plan, originalRates } = this.props;
    const productKeys = plan.get('rates', Immutable.Map()).map((rate, key) => key);
    return originalRates.reduce((newList, price, productName) => {
      if (!productKeys.includes(productName)) {
        return newList.push(productName);
      }
      return newList;
    }, Immutable.List());
  }

  renderRemovedItems = () => {
    const { planProducts, originalRates } = this.props;
    const removedProductKeys = this.getRemovedProductKeys();
    return removedProductKeys.map((productKey) => {
      const prod = planProducts.find(planProduct => planProduct.get('key', '') === productKey);
      const usaget = originalRates.get(productKey).keySeq().first();
      return (
        <PlanProductRemoved
          key={prod.getIn(['_id', '$id'])}
          usaget={usaget}
          item={prod}
          onProductUndoRemove={this.onProductUndoRemove}
        />
      );
    });
  }

  renderItems = () => {
    const { planProducts, plan } = this.props;
    const products = plan.get('rates', Immutable.Map());
    return products.map((productUsageTypes, productKey) => {
      const usaget = productUsageTypes.keySeq().first();
      const prices = productUsageTypes.get(usaget, Immutable.List());
      const prod = planProducts.find(planProduct => planProduct.get('key', '') === productKey);
      if (!prod) {
        return null;
      }
      return (
        <PlanProduct
          key={prod.getIn(['_id', '$id'])}
          item={prod}
          prices={prices}
          usaget={usaget}
          onProductInitRate={this.onProductInitRate}
          onProductRemoveRate={this.onProductRemoveRate}
          onProductAddRate={this.onProductAddRate}
          onProductEditRate={this.onProductEditRate}
          onProductEditRateTo={this.onProductEditRateTo}
          onProductRemove={this.onProductRemove}
          onProductRestore={this.onProductRestore}
        />
      );
    });
  }

  render() {
    const { planProducts, plan } = this.props;
    const products = plan.get('rates', Immutable.Map());

    if (products.size > 0 && planProducts.size === 0) {
      return (<LoadingItemPlaceholder onClick={this.handleBack} />);
    }

    const panelTitle = (
      <h3>Select Products to Override Price <Help contents={PlanDescription.add_product} /></h3>
    );
    return (
      <Row>
        <Col lg={12}>
          <Form>
            <Panel header={panelTitle}>
              <ProductSearch onSelectProduct={this.onSelectProduct} />
            </Panel>
            { this.renderRemovedItems() }
            { this.renderItems().toArray() }
            { (products.size === 0) && this.renderNoItems() }
          </Form>
        </Col>
      </Row>
    );
  }

}

const mapStateToProps = state => ({
  originalRates: state.entity.getIn(['planOriginal', 'rates']),
  planProducts: state.list.get('plan_products'),
  productsKeys: state.planProducts.productPlanPrice,
});
export default connect(mapStateToProps)(PlanProductsPriceTab);
