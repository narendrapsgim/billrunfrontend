import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';
import Immutable from 'immutable';
import { Col, Panel, Button } from 'react-bootstrap';
import Product from './Product';
import LoadingItemPlaceholder from '../Elements/LoadingItemPlaceholder';
/* ACTIONS */
import { onRateAdd, onRateRemove, onFieldUpdate, onUsagetUpdate, getProduct, saveProduct, clearProduct } from '../../actions/productActions';
import { getSettings } from '../../actions/settingsActions';
import { addUsagetMapping } from '../../actions/inputProcessorActions';
import { setPageTitle } from '../../actions/guiStateActions/pageActions';


class ProductSetup extends Component {

  static defaultProps = {
    item: Immutable.Map(),
    usaget: '',
  };

  static propTypes = {
    itemId: React.PropTypes.string,
    item: React.PropTypes.instanceOf(Immutable.Map),
    usaget: React.PropTypes.string,
    usageTypes: React.PropTypes.instanceOf(Immutable.List),
    mode: React.PropTypes.string,
    router: React.PropTypes.shape({
      push: React.PropTypes.func.isRequired,
    }).isRequired,
    addUsagetMapping: React.PropTypes.func.isRequired,
    clearProduct: React.PropTypes.func.isRequired,
    getProduct: React.PropTypes.func.isRequired,
    getSettings: React.PropTypes.func.isRequired,
    onFieldUpdate: React.PropTypes.func.isRequired,
    onRateAdd: React.PropTypes.func.isRequired,
    onRateRemove: React.PropTypes.func.isRequired,
    onUsagetUpdate: React.PropTypes.func.isRequired,
    saveProduct: React.PropTypes.func.isRequired,
    setPageTitle: React.PropTypes.func.isRequired,
  }

  componentWillMount() {
    const { itemId } = this.props;
    if (itemId) {
      this.props.getProduct(itemId);
    }
    this.props.getSettings('usage_types');
  }

  componentDidMount() {
    const { mode } = this.props;
    if (mode === 'new') {
      this.props.setPageTitle('Create New Product');
    }
  }

  componentWillReceiveProps(nextProps) {
    const { item } = this.props;
    const { item: nextItem, mode } = nextProps;
    if (mode === 'update' && item.get('key') !== nextItem.get('key')) {
      this.props.setPageTitle(`Edit product - ${nextItem.get('key')}`);
    }
  }

  componentWillUnmount() {
    this.props.clearProduct();
  }

  onFieldUpdate = (path, value) => {
    this.props.onFieldUpdate(path, value);
  }

  onUsagetUpdate = (path, oldUsaget, newUsaget) => {
    const { usageTypes } = this.props;
    if (newUsaget.length > 0 && !usageTypes.includes(newUsaget)) {
      this.props.addUsagetMapping(newUsaget);
    }
    this.props.onUsagetUpdate(path, oldUsaget, newUsaget);
  }

  onProductRateAdd = (productPath) => {
    this.props.onRateAdd(productPath);
  }

  onProductRateRemove = (productPath, index) => {
    this.props.onRateRemove(productPath, index);
  }

  handleBack = () => {
    this.props.router.push('/products');
  }

  handleSave = () => {
    const { item, mode } = this.props;
    this.props.saveProduct(item, mode, this.afterSave);
  }

  afterSave = (data) => {
    if (typeof data.error !== 'undefined' && data.error.length) {
      console.log('error on save : ', data);
    } else {
      this.props.router.push('/products');
    }
  }

  render() {
    const { item, usaget, usageTypes, mode } = this.props;

    // in update mode wait for item before render edit screen
    if (mode === 'update' && typeof item.getIn(['_id', '$id']) === 'undefined') {
      return (<LoadingItemPlaceholder onClick={this.handleBack} />);
    }

    return (
      <Col lg={12}>
        <Panel>
          <Product
            mode={mode}
            onFieldUpdate={this.onFieldUpdate}
            onProductRateAdd={this.onProductRateAdd}
            onProductRateRemove={this.onProductRateRemove}
            onUsagetUpdate={this.onUsagetUpdate}
            planName="BASE"
            product={item}
            usaget={usaget}
            usageTypes={usageTypes}
          />
        </Panel>
        <div style={{ marginTop: 12 }}>
          <Button onClick={this.handleSave} bsStyle="primary" style={{ marginRight: 10 }}>Save</Button>
          <Button onClick={this.handleBack} bsStyle="default">Cancel</Button>
        </div>
      </Col>
    );
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({
  addUsagetMapping,
  clearProduct,
  getProduct,
  getSettings,
  onFieldUpdate,
  onRateAdd,
  onRateRemove,
  onUsagetUpdate,
  saveProduct,
  setPageTitle,
}, dispatch);

const mapStateToProps = (state, props) => {
  const { product: item } = state;
  const { itemId, action: mode = (itemId) ? 'update' : 'new' } = props.params;
  const usageTypes = state.settings.get('usage_types', Immutable.List());
  const usaget = item.get('rates', Immutable.Map()).keySeq().first();
  return { itemId, item, mode, usaget, usageTypes };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProductSetup));
