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
import { getList, clearList, pushToList } from '../../actions/listActions';
import {
  planProductRemove,
  planProductsRateRemove,
  planProductsRateAdd,
  planProductsRateUpdate,
  planProductsRateUpdateTo,
  planProductsRateInit,
} from '../../actions/planActions';


class PlanProductsPriceTab extends Component {

  static propTypes = {
    planRates: PropTypes.instanceOf(Immutable.Map),
    originalRates: PropTypes.instanceOf(Immutable.Map),
    products: PropTypes.instanceOf(Immutable.List),
    onChangeFieldValue: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  static defaultProps = {
    planRates: Immutable.Map(),
    originalRates: Immutable.Map(),
    products: Immutable.List(),
  };

  componentWillMount() {
    const { planRates } = this.props;
    const productKeys = planRates.map((rate, key) => key).toArray();
    if (productKeys.length) {
      this.props.dispatch(getList('plan_products', getProductsByKeysQuery(productKeys)));
    }
  }

  componentWillUnmount() {
    this.props.dispatch(clearList('plan_products'));
  }

  addNewProductToPlan = (newProducts) => {
    const { products } = this.props;
    newProducts.forEach((product) => {
      const newProduct = products.find(planProd => planProd.get('key', '') === product.key);
      if (newProduct) {
        const usaget = newProduct.get('rates', Immutable.Map()).keySeq().first();
        const productPath = ['rates', newProduct.get('key', ''), usaget, 'rate'];
        this.props.dispatch(planProductsRateInit(newProduct, productPath));
      }
    });
  }

  onSelectProduct = (key) => {
    const { planRates } = this.props;
    const productKeys = planRates.map((rate, productKey) => productKey);
    if (productKeys.includes(key)) {
      this.props.dispatch(showWarning(`Price of product ${key} already overridden`));
    } else {
      this.props.dispatch(pushToList('plan_products', getProductByKeyQuery(key)))
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
      this.props.onChangeFieldValue(['rates', productName], prices);
      this.props.dispatch(showInfo(`Product ${productName} prices for this plan restored to original state`));
    } else {
      this.props.dispatch(planProductsRateInit(product, productPath));
      this.props.dispatch(showInfo(`Product ${productName} prices for this plan restored to BASE state`));
    }
  }

  onProductRemove = (productPath, productName) => {
    this.props.dispatch(planProductRemove(productPath, productName));
  }

  onProductUndoRemove = (productName) => {
    const { originalRates } = this.props;
    const prices = originalRates.get(productName, Immutable.Map());
    this.props.onChangeFieldValue(['rates', productName], prices);
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
    const { planRates, originalRates } = this.props;
    const productKeys = planRates.map((rate, key) => key);
    return originalRates.reduce((newList, price, productName) => {
      if (!productKeys.includes(productName)) {
        return newList.push(productName);
      }
      return newList;
    }, Immutable.List());
  }

  renderRemovedItems = () => {
    const { products, originalRates } = this.props;
    const removedProductKeys = this.getRemovedProductKeys();
    return removedProductKeys.map((productKey) => {
      const prod = products.find(planProduct => planProduct.get('key', '') === productKey);
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
    const { products, planRates } = this.props;
    return planRates.map((productUsageTypes, productKey) => {
      const usaget = productUsageTypes.keySeq().first();
      const prices = productUsageTypes.getIn([usaget, 'rate'], Immutable.List());
      const prod = products.find(planProduct => planProduct.get('key', '') === productKey);
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
    const { products, planRates } = this.props;

    if (planRates.size > 0 && products.size === 0) {
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
  products: state.list.get('plan_products'),
});
export default connect(mapStateToProps)(PlanProductsPriceTab);
