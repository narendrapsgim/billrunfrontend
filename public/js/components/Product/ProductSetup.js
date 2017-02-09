import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Immutable from 'immutable';
import { Col, Panel } from 'react-bootstrap';
import ActionButtons from '../Elements/ActionButtons';
import Product from './Product';
import LoadingItemPlaceholder from '../Elements/LoadingItemPlaceholder';
import { onRateAdd, onRateRemove, onFieldUpdate, onToUpdate, onUsagetUpdate, getProduct, saveProduct, clearProduct } from '../../actions/productActions';
import { getSettings } from '../../actions/settingsActions';
import { addUsagetMapping } from '../../actions/inputProcessorActions';
import { showSuccess } from '../../actions/alertsActions';
import { setPageTitle } from '../../actions/guiStateActions/pageActions';
import { clearItems } from '../../actions/entityListActions';


class ProductSetup extends Component {

  static propTypes = {
    item: PropTypes.instanceOf(Immutable.Map),
    itemId: PropTypes.string,
    mode: PropTypes.string,
    usageTypes: PropTypes.instanceOf(Immutable.List),
    activeTab: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    router: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    dispatch: PropTypes.func.isRequired,
  }

  static defaultProps = {
    item: Immutable.Map(),
    usageTypes: Immutable.List(),
    activeTab: 1,
  };

  state = {
    activeTab: parseInt(this.props.activeTab),
  }

  componentWillMount() {
    const { itemId, usageTypes } = this.props;
    if (itemId) {
      this.props.dispatch(getProduct(itemId));
    }
    if (usageTypes.isEmpty()) {
      this.props.dispatch(getSettings('usage_types'));
    }
  }

  componentDidMount() {
    const { mode } = this.props;
    if (mode === 'create') {
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

  afterSave = (response) => {
    const { mode } = this.props;
    if (response.status) {
      this.props.dispatch(clearItems('products')); // refetch items list because item was (changed in / added to) list
      const action = (mode === 'create') ? 'created' : 'updated';
      this.props.dispatch(showSuccess(`The product was ${action}`));
      this.handleBack();
    }
  }

  handleSave = () => {
    const { item, mode } = this.props;
    this.props.dispatch(saveProduct(item, mode)).then(this.afterSave);
  }

  handleBack = () => {
    this.props.router.push('/products');
  }

  render() {
    const { item, usageTypes, mode } = this.props;

    // in update mode wait for item before render edit screen
    if (mode === 'update' && typeof item.getIn(['_id', '$id']) === 'undefined') {
      return (<LoadingItemPlaceholder onClick={this.handleBack} />);
    }

    const usaget = item.get('rates', Immutable.Map()).keySeq().first();
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
        <ActionButtons onClickCancel={this.handleBack} onClickSave={this.handleSave} />
      </Col>
    );
  }
}


const mapStateToProps = (state, props) => {
  const { tab: activeTab, action } = props.location.query;
  const { itemId } = props.params;
  const mode = action || ((itemId) ? 'update' : 'create');
  const { product: item } = state;
  const usageTypes = state.settings.get('usage_types');
  return { itemId, item, mode, usageTypes, activeTab };
};
export default withRouter(connect(mapStateToProps)(ProductSetup));
