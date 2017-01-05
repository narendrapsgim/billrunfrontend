import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Immutable from 'immutable';
import { Col, Panel, Button } from 'react-bootstrap';
import Product from './Product';
import LoadingItemPlaceholder from '../Elements/LoadingItemPlaceholder';
/* ACTIONS */
import { onRateAdd, onRateRemove, onFieldUpdate, onToUpdate, onUsagetUpdate, getProduct, saveProduct, clearProduct } from '../../actions/productActions';
import { getSettings } from '../../actions/settingsActions';
import { addUsagetMapping } from '../../actions/inputProcessorActions';
import { setPageTitle } from '../../actions/guiStateActions/pageActions';


class ProductSetup extends Component {

  static defaultProps = {
    item: Immutable.Map(),
    usaget: '',
  };

  static propTypes = {
    item: PropTypes.instanceOf(Immutable.Map),
    itemId: PropTypes.string,
    usaget: PropTypes.string,
    usageTypes: PropTypes.instanceOf(Immutable.List),
    mode: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    router: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
  }

  componentWillMount() {
    const { itemId } = this.props;
    if (itemId) {
      this.props.dispatch(getProduct(itemId));
    }
    this.props.dispatch(getSettings('usage_types'));
  }

  componentDidMount() {
    const { mode } = this.props;
    if (mode === 'new') {
      this.props.dispatch(setPageTitle('Create New Product'));
    }
  }

  componentWillReceiveProps(nextProps) {
    const { item } = this.props;
    const { item: nextItem, mode } = nextProps;
    if (mode === 'update' && item.get('key') !== nextItem.get('key')) {
      this.props.dispatch(setPageTitle(`Edit product - ${nextItem.get('key')}`));
    }
  }

  componentWillUnmount() {
    this.props.dispatch(clearProduct());
  }

  onFieldUpdate = (path, value) => {
    this.props.dispatch(onFieldUpdate(path, value));
  }

  onToUpdate = (path, index, value) => {
    this.props.dispatch(onToUpdate(path, index, value));
  }

  onUsagetUpdate = (path, oldUsaget, newUsaget) => {
    const { usageTypes } = this.props;
    if (newUsaget.length > 0 && !usageTypes.includes(newUsaget)) {
      this.props.dispatch(addUsagetMapping(newUsaget));
    }
    this.props.dispatch(onUsagetUpdate(path, oldUsaget, newUsaget));
  }

  onProductRateAdd = (productPath) => {
    this.props.dispatch(onRateAdd(productPath));
  }

  onProductRateRemove = (productPath, index) => {
    this.props.dispatch(onRateRemove(productPath, index));
  }

  handleBack = () => {
    this.props.router.push('/products');
  }

  handleSave = () => {
    const { item, mode } = this.props;
    this.props.dispatch(saveProduct(item, mode, this.afterSave));
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
            onToUpdate={this.onToUpdate}
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


const mapStateToProps = (state, props) => {
  const { product: item } = state;
  const { itemId, action: mode = (itemId) ? 'update' : 'new' } = props.params;
  const usageTypes = state.settings.get('usage_types', Immutable.List());
  const usaget = item.get('rates', Immutable.Map()).keySeq().first();
  return { itemId, item, mode, usaget, usageTypes };
};

export default withRouter(connect(mapStateToProps)(ProductSetup));
