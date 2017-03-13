import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Immutable from 'immutable';
import moment from 'moment';
import { Tabs, Tab, Panel } from 'react-bootstrap';
import { ActionButtons, LoadingItemPlaceholder } from '../Elements';
import { EntityRevisionDetails } from '../Entity';
import { buildPageTitle, getItemDateValue, getConfig, getItemId } from '../../common/Util';
import { getProductsKeysQuery } from '../../common/ApiQueries';
import { showDanger, showSuccess } from '../../actions/alertsActions';
import { getList } from '../../actions/listActions';
import { setPageTitle } from '../../actions/guiStateActions/pageActions';
import { saveDiscount, getDiscount, clearDiscount, updateDiscount } from '../../actions/discountsActions';
import { getSettings } from '../../actions/settingsActions';
import { clearItems, getRevisions, clearRevisions } from '../../actions/entityListActions';
import { modeSelector, itemSelector, idSelector, tabSelector, revisionsSelector } from '../../selectors/entitySelector';


class Discount extends Component {

  static propTypes = {
    itemId: PropTypes.string,
    item: PropTypes.instanceOf(Immutable.Map),
    revisions: PropTypes.instanceOf(Immutable.List),
    mode: PropTypes.string,
    allRates: PropTypes.instanceOf(Immutable.List),
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
    allRates: Immutable.List(),
    usageTypes: Immutable.List(),
    activeTab: 1,
  }

  state = {
    activeTab: parseInt(this.props.activeTab),
  }

  componentWillMount() {
    this.fetchItem();
  }

  componentDidMount() {
    const { mode } = this.props;
    if (mode === 'create') {
      const pageTitle = buildPageTitle(mode, 'discount');
      this.props.dispatch(setPageTitle(pageTitle));
    }
    this.initDefaultValues();
  }

  componentWillReceiveProps(nextProps) {
    const { item, mode, itemId } = nextProps;
    const { item: oldItem, itemId: oldItemId, mode: oldMode } = this.props;
    if (mode !== oldMode || getItemId(item) !== getItemId(oldItem)) {
      const pageTitle = buildPageTitle(mode, 'discount', item);
      this.props.dispatch(setPageTitle(pageTitle));
    }
    if (itemId !== oldItemId) {
      this.fetchItem(itemId);
    }
  }

  componentWillUnmount() {
    this.props.dispatch(clearDiscount());
  }

  initDefaultValues = () => {
    const { mode, item } = this.props;
    if (mode === 'create' || (mode === 'closeandnew' && getItemDateValue(item, 'from').isBefore(moment()))) {
      const defaultFromValue = moment().add(1, 'days').toISOString();
      this.onChangeFieldValue(['from'], defaultFromValue);
    }
    if (mode === 'create') {
      // set defaults values
    }
  }

  initRevisions = () => {
    const { item, revisions } = this.props;
    if (revisions.isEmpty() && getItemId(item, false)) {
      const key = item.get('key', '');
      this.props.dispatch(getRevisions('discount', 'key', key));
    }
  }

  fetchItem = (itemId = this.props.itemId) => {
    if (itemId) {
      this.props.dispatch(getDiscount(itemId)).then(this.afterItemReceived);
    }
  }

  clearRevisions = () => {
    const { item } = this.props;
    const key = item.get('key', '');
    this.props.dispatch(clearRevisions('discount', key)); // refetch items list because item was (changed in / added to) list
  }

  afterItemReceived = (response) => {
    if (response.status) {
      this.initRevisions();
      this.initDefaultValues();
    } else {
      this.handleBack();
    }
  }

  onChangeFieldValue = (path, value) => {
    this.props.dispatch(updateDiscount(path, value));
  }

  afterSave = (response) => {
    const { mode } = this.props;
    if (response.status) {
      const action = (['clone', 'create'].includes(mode)) ? 'created' : 'updated';
      this.props.dispatch(showSuccess(`The discounts was ${action}`));
      this.clearRevisions();
      this.handleBack(true);
    }
  }

  handleSave = () => {
    const { item, mode } = this.props;
    this.props.dispatch(saveDiscount(item, mode)).then(this.afterSave);
  }

  handleBack = (itemWasChanged = false) => {
    const itemsType = getConfig(['systemItems', 'discount', 'itemsType'], '');
    if (itemWasChanged) {
      this.props.dispatch(clearItems(itemsType)); // refetch items list because item was (changed in / added to) list
    }
    this.props.router.push(`/${itemsType}`);
  }

  handleSelectTab = (key) => {
    this.setState({ activeTab: key });
  }

  render() {
    const { item, mode, revisions } = this.props;
    if (mode === 'loading') {
      return (<LoadingItemPlaceholder onClick={this.handleBack} />);
    }

    const allowEdit = mode !== 'view';
    return (
      <div className="DiscountSetup">
        <Panel>
          <EntityRevisionDetails
            itemName="discount"
            revisions={revisions}
            item={item}
            mode={mode}
            onChangeFrom={this.onChangeFieldValue}
            backToList={this.handleBack}
            reLoadItem={this.fetchItem}
            clearRevisions={this.clearRevisions}
          />
          <p>discount</p>
        </Panel>

        <ActionButtons
          onClickCancel={this.handleBack}
          onClickSave={this.handleSave}
          hideSave={!allowEdit}
          cancelLabel={allowEdit ? undefined : 'Back'}
        />
      </div>
    );
  }
}
const mapStateToProps = (state, props) => ({
  itemId: idSelector(state, props, 'discount'),
  item: itemSelector(state, props, 'discount'),
  mode: modeSelector(state, props, 'discount'),
  activeTab: tabSelector(state, props, 'discount'),
  revisions: revisionsSelector(state, props, 'discount'),
});
export default withRouter(connect(mapStateToProps)(Discount));
