import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Immutable from 'immutable';
import moment from 'moment';
import { Col, Panel } from 'react-bootstrap';
import { ActionButtons, LoadingItemPlaceholder } from '../Elements';
import { EntityRevisionDetails } from '../Entity';
import Product from './Product';
import { onRateAdd, onRateRemove, onFieldUpdate, onToUpdate, onUsagetUpdate, getProduct, saveProduct, clearProduct } from '../../actions/productActions';
import { getSettings } from '../../actions/settingsActions';
import { addUsagetMapping } from '../../actions/inputProcessorActions';
import { showSuccess } from '../../actions/alertsActions';
import { setPageTitle } from '../../actions/guiStateActions/pageActions';
import { clearItems, getRevisions, clearRevisions } from '../../actions/entityListActions';
import { modeSelector, itemSelector, idSelector, tabSelector, revisionsSelector } from '../../selectors/entitySelector';
import { buildPageTitle, getItemDateValue } from '../../common/Util';


class ProductSetup extends Component {

  static propTypes = {
    item: PropTypes.instanceOf(Immutable.Map),
    itemId: PropTypes.string,
    revisions: PropTypes.instanceOf(Immutable.List),
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
    revisions: Immutable.List(),
    usageTypes: Immutable.List(),
    activeTab: 1,
  };

  state = {
    activeTab: parseInt(this.props.activeTab),
  }

  componentWillMount() {
    const { itemId, usageTypes } = this.props;
    if (itemId) {
      this.props.dispatch(getProduct(itemId)).then(this.afterItemReceived);
    }
    if (usageTypes.isEmpty()) {
      this.props.dispatch(getSettings('usage_types'));
    }
  }

  componentDidMount() {
    const { mode } = this.props;
    if (mode === 'create') {
      const pageTitle = buildPageTitle(mode, 'product');
      this.props.dispatch(setPageTitle(pageTitle));
    }
    this.initDefaultValues();
  }

  componentWillReceiveProps(nextProps) {
    const { item, mode, itemId, revisions } = nextProps;
    const { item: oldItem,
      itemId: oldItemId,
      mode: oldMode,
      revisions: oldRevisions,
    } = this.props;
    if (mode !== oldMode || oldItem.get('key') !== item.get('key')) {
      const pageTitle = buildPageTitle(mode, 'product', item);
      this.props.dispatch(setPageTitle(pageTitle));

      this.props.dispatch(setPageTitle(pageTitle));
    }
    if (itemId !== oldItemId || !Immutable.is(revisions, oldRevisions)) {
      this.props.dispatch(getProduct(itemId)).then(this.afterItemReceived);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !Immutable.is(this.props.item, nextState.item)
      || !Immutable.is(this.props.revisions, nextState.revisions)
      || this.props.activeTab !== nextProps.activeTab
      || this.props.itemId !== nextProps.itemId
      || this.props.mode !== nextProps.mode;
  }

  componentWillUnmount() {
    this.props.dispatch(clearProduct());
  }

  initDefaultValues = () => {
    const { mode, item } = this.props;
    if (mode === 'create' || (mode === 'closeandnew' && getItemDateValue(item, 'from').isBefore(moment()))) {
      const defaultFromValue = moment().add(1, 'days').toISOString();
      this.props.dispatch(onFieldUpdate(['from'], defaultFromValue));
    }
  }

  initRevisions = () => {
    const { item, revisions } = this.props;
    if (revisions.isEmpty() && item.getIn(['_id', '$id'], false)) {
      const key = item.get('key', '');
      this.props.dispatch(getRevisions('rates', 'key', key));
    }
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

  afterItemReceived = (response) => {
    if (response.status) {
      this.initRevisions();
      this.initDefaultValues();
    } else {
      this.handleBack();
    }
  }

  afterSave = (response) => {
    const { mode, item } = this.props;
    if (response.status) {
      const key = item.get('key', '');
      this.props.dispatch(clearRevisions('rates', key)); //
      const action = (mode === 'create' || mode === 'closeandnew') ? 'created' : 'updated';
      this.props.dispatch(showSuccess(`The product was ${action}`));
      this.handleBack(true);
    }
  }

  handleSave = () => {
    const { item, mode } = this.props;
    this.props.dispatch(saveProduct(item, mode)).then(this.afterSave);
  }

  handleBack = (itemWasChanged = false) => {
    if (itemWasChanged) {
      this.props.dispatch(clearItems('product')); // refetch items list because item was (changed in / added to) list
    }
    const listUrl = globalSetting.systemItems.product.itemsType;

    this.props.router.push(`/${listUrl}`);
  }

  render() {
    const { item, usageTypes, mode, revisions } = this.props;
    if (mode === 'loading') {
      return (<LoadingItemPlaceholder onClick={this.handleBack} />);
    }

    const usaget = item.get('rates', Immutable.Map()).keySeq().first();
    return (
      <Col lg={12}>

        <Panel>
          <EntityRevisionDetails
            revisions={revisions}
            item={item}
            mode={mode}
            onChangeFrom={this.onFieldUpdate}
            itemName="product"
            backToList={this.handleBack}
          />
        </Panel>

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

const mapStateToProps = (state, props) => ({
  itemId: idSelector(state, props, 'product'),
  item: itemSelector(state, props, 'product'),
  mode: modeSelector(state, props, 'product'),
  activeTab: tabSelector(state, props, 'product'),
  revisions: revisionsSelector(state, props, 'product'),
  usageTypes: state.settings.get('usage_types'),
});

export default withRouter(connect(mapStateToProps)(ProductSetup));
