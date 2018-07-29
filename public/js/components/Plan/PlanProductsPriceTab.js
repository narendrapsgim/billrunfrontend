import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Panel, Form, Col, Row } from 'react-bootstrap';
import Immutable from 'immutable';
import PlanProduct from './components/PlanProduct';
import PlanProductRemoved from './components/PlanProductRemoved';
import { PlanDescription } from '../../FieldDescriptions';
import Help from '../Help';
import ProductSearch from './components/ProductSearch';
import {
  getProductsByKeysQuery,
  getProductByKeyQuery,
  getRetailProductsKeysQuery,
} from '../../common/ApiQueries';
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
import {
  usageTypesDataSelector,
  propertyTypeSelector,
} from '../../selectors/settingsSelector';
import {
  sourcePlanRatesSelector,
} from '../../selectors/entitySelector';
import {
  getProductConvertedRates,
} from '../../common/Util';


class PlanProductsPriceTab extends Component {

  static propTypes = {
    planRates: PropTypes.instanceOf(Immutable.Map),
    usageTypesData: PropTypes.instanceOf(Immutable.List),
    propertyTypes: PropTypes.instanceOf(Immutable.List),
    mode: PropTypes.string,
    originalRates: PropTypes.instanceOf(Immutable.Map),
    products: PropTypes.instanceOf(Immutable.List),
    onChangeFieldValue: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  static defaultProps = {
    planRates: Immutable.Map(),
    usageTypesData: Immutable.List(),
    propertyTypes: Immutable.List(),
    mode: 'create',
    originalRates: Immutable.Map(),
    products: Immutable.List(),
  };

  componentWillMount() {
    const { planRates } = this.props;
    if (!planRates.isEmpty()) {
      const planRatesKeys = planRates.keySeq();
      this.props.dispatch(getList('plan_products', getProductsByKeysQuery(planRatesKeys.toArray())));
    }
  }

  componentWillReceiveProps(nextProps) {
    const { planRates, products } = nextProps;
    const { planRates: oldPlanRates } = this.props;
    if (!Immutable.is(planRates, oldPlanRates)) {
      const newProductsKeys = planRates.keySeq().filter(planRateKey =>
        // Get all products that exist in plan but not fetched from server
        (products.findIndex(product => product.get('key', '') === planRateKey) === -1),
      );
      if (!newProductsKeys.isEmpty()) {
        this.props.dispatch(pushToList('plan_products', getProductsByKeysQuery(newProductsKeys.toArray())));
      }
    }
  }

  componentWillUnmount() {
    this.props.dispatch(clearList('plan_products'));
  }

  addNewProductToPlan = (newProducts) => {
    const { products, propertyTypes, usageTypesData } = this.props;
    newProducts.forEach((product) => {
      const newProduct = products.find(planProd => planProd.get('key', '') === product.key);
      if (newProduct) {
        const usaget = newProduct.get('rates', Immutable.Map()).keySeq().first();
        const productPath = ['rates', newProduct.get('key', ''), usaget, 'rate'];
        const newRates = getProductConvertedRates(propertyTypes, usageTypesData, newProduct, false);
        const newProductWithRates = !newRates.isEmpty() ? newProduct.set('rates', newRates) : newProduct;
        this.props.dispatch(planProductsRateInit(newProductWithRates, productPath));
      }
    });
  }

  onSelectProduct = (key) => {
    const { planRates } = this.props;
    if (planRates.has(key)) {
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
      this.props.dispatch(showInfo(`Product ${productName} prices for this plan restored to origin state`));
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
      const prod = products.find(planProduct => planProduct.get('key', '') === productKey,
        null,
        Immutable.Map({ key: productKey }),
      );
      const usaget = originalRates.get(productKey).keySeq().first();
      return (
        <PlanProductRemoved
          key={prod.getIn(['_id', '$id'], prod.get('key', productKey))}
          usaget={usaget}
          item={prod}
          onProductUndoRemove={this.onProductUndoRemove}
        />
      );
    });
  }

  renderItems = () => {
    const { products, planRates, usageTypesData, propertyTypes, mode } = this.props;
    return planRates
      .reverse()
      .map((productUsageTypes, productKey) => {
        const usaget = productUsageTypes.keySeq().first();
        const prices = productUsageTypes.getIn([usaget, 'rate'], Immutable.List());
        const prod = products.find(planProduct => planProduct.get('key', '') === productKey,
          null,
          Immutable.Map({ key: productKey }),
        );
        return (
          <PlanProduct
            key={prod.getIn(['_id', '$id'], prod.get('key'))}
            item={prod}
            prices={prices}
            usaget={usaget}
            mode={mode}
            onProductInitRate={this.onProductInitRate}
            onProductRemoveRate={this.onProductRemoveRate}
            onProductAddRate={this.onProductAddRate}
            onProductEditRate={this.onProductEditRate}
            onProductEditRateTo={this.onProductEditRateTo}
            onProductRemove={this.onProductRemove}
            onProductRestore={this.onProductRestore}
            usageTypes={usageTypesData}
            propertyTypes={propertyTypes}
          />
        );
      })
      .toArray();
  }

  render() {
    const { planRates, mode } = this.props;
    const editable = (mode !== 'view');

    const panelTitle = (
      <h3>Select Products to Override Price <Help contents={PlanDescription.add_product} /></h3>
    );
    return (
      <Row>
        <Col lg={12}>
          <Form>
            { editable &&
              <Panel header={panelTitle}>
                <ProductSearch
                  onSelectProduct={this.onSelectProduct}
                  searchFunction={getRetailProductsKeysQuery()}
                />
              </Panel>
            }
            { this.renderRemovedItems() }
            { this.renderItems() }
            { planRates.isEmpty() && this.renderNoItems() }
          </Form>
        </Col>
      </Row>
    );
  }

}

const mapStateToProps = (state, props) => ({
  originalRates: sourcePlanRatesSelector(state, props),
  products: state.list.get('plan_products'),
  usageTypesData: usageTypesDataSelector(state, props),
  propertyTypes: propertyTypeSelector(state, props),
});
export default connect(mapStateToProps)(PlanProductsPriceTab);
