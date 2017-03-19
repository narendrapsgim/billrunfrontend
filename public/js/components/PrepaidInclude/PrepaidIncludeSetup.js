import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Immutable from 'immutable';
import moment from 'moment';
import { Tabs, Tab, Panel } from 'react-bootstrap';
import { ActionButtons, LoadingItemPlaceholder } from '../Elements';
import PrepaidInclude from './PrepaidInclude';
import LimitedDestinations from './LimitedDestinations';
import { EntityRevisionDetails } from '../Entity';
import { buildPageTitle, getConfig, getItemId } from '../../common/Util';
import { getProductsKeysQuery } from '../../common/ApiQueries';
import { showDanger, showSuccess } from '../../actions/alertsActions';
import { getList } from '../../actions/listActions';
import { setPageTitle } from '../../actions/guiStateActions/pageActions';
import {
  savePrepaidInclude,
  getPrepaidInclude,
  clearPrepaidInclude,
  updatePrepaidInclude,
  setClonePrepaidInclude,
} from '../../actions/prepaidIncludeActions';
import { getSettings } from '../../actions/settingsActions';
import {
  clearItems,
  getRevisions,
  clearRevisions,
} from '../../actions/entityListActions';
import {
  modeSelector,
  itemSelector,
  idSelector,
  tabSelector,
  revisionsSelector,
} from '../../selectors/entitySelector';


class PrepaidIncludeSetup extends Component {

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
  };

  state = {
    activeTab: parseInt(this.props.activeTab),
  }

  componentWillMount() {
    this.fetchItem();
  }

  componentDidMount() {
    const { mode } = this.props;
    if (mode === 'create') {
      const pageTitle = buildPageTitle(mode, 'prepaid_include');
      this.props.dispatch(setPageTitle(pageTitle));
    }
    this.props.dispatch(getList('all_rates', getProductsKeysQuery()));
    this.props.dispatch(getSettings('usage_types'));
    this.initDefaultValues();
  }

  componentWillReceiveProps(nextProps) {
    const { item, mode, itemId } = nextProps;
    const { item: oldItem, itemId: oldItemId, mode: oldMode } = this.props;
    if (mode !== oldMode || getItemId(item) !== getItemId(oldItem)) {
      const pageTitle = buildPageTitle(mode, 'prepaid_include', item);
      this.props.dispatch(setPageTitle(pageTitle));
    }
    if (itemId !== oldItemId || (mode !== oldMode && mode === 'clone')) {
      this.fetchItem(itemId);
    }
  }

  componentWillUnmount() {
    this.props.dispatch(clearPrepaidInclude());
  }

  initDefaultValues = () => {
    const { mode } = this.props;
    if (mode === 'create') {
      const defaultFromValue = moment().add(1, 'days').toISOString();
      this.onChangeFieldValue(['from'], defaultFromValue);
      this.onChangeFieldValue(['shared'], false);
      this.onChangeFieldValue(['unlimited'], false);
    }
    if (mode === 'clone') {
      this.props.dispatch(setClonePrepaidInclude());
    }
  }

  initRevisions = () => {
    const { item, revisions } = this.props;
    if (revisions.isEmpty() && getItemId(item, false)) {
      const key = item.get('name', '');
      this.props.dispatch(getRevisions('prepaidincludes', 'name', key));
    }
  }

  fetchItem = (itemId = this.props.itemId) => {
    if (itemId) {
      this.props.dispatch(getPrepaidInclude(itemId)).then(this.afterItemReceived);
    }
  }

  clearRevisions = () => {
    const { item } = this.props;
    const key = item.get('name', '');
    this.props.dispatch(clearRevisions('prepaidincludes', key)); // refetch items list because item was (changed in / added to) list
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
    this.props.dispatch(updatePrepaidInclude(path, value));
  }

  onChangeField = (e) => {
    const { id, value } = e.target;
    this.onChangeFieldValue(id, value);
  };

  onChangeLimitedDestinations = (name, value) => {
    this.onChangeFieldValue(['allowed_in', name], value);
  };

  onSelectPlan = (name) => {
    const { item, dispatch } = this.props;
    if (item.getIn(['allowed_in', name])) {
      dispatch(showDanger('Plan already exists'));
      return;
    }
    this.onChangeFieldValue(['allowed_in', name], Immutable.Map());
  };

  afterSave = (response) => {
    const { mode } = this.props;
    if (response.status) {
      const action = (['clone', 'create'].includes(mode)) ? 'created' : 'updated';
      this.props.dispatch(showSuccess(`The prepaid bucke was ${action}`));
      this.clearRevisions();
      this.handleBack(true);
    }
  }

  handleSave = () => {
    const { item, mode } = this.props;
    this.props.dispatch(savePrepaidInclude(item, mode)).then(this.afterSave);
  };

  handleBack = (itemWasChanged = false) => {
    const itemsType = getConfig(['systemItems', 'prepaid_include', 'itemsType'], '');
    if (itemWasChanged) {
      this.props.dispatch(clearItems(itemsType)); // refetch items list because item was (changed in / added to) list
    }
    this.props.router.push(`/${itemsType}`);
  }

  handleSelectTab = (key) => {
    this.setState({ activeTab: key });
  }

  render() {
    const { item, mode, allRates, usageTypes, revisions } = this.props;
    if (mode === 'loading') {
      return (<LoadingItemPlaceholder onClick={this.handleBack} />);
    }

    const chargingByOptions = [
      { value: 'usagev', label: 'Usage volume' },
      { value: 'cost', label: 'Cost' },
      { value: 'total_cost', label: 'Total cost' },
    ];

    const allRatesOptions = allRates.map(rate => ({
      value: rate.get('key'),
      label: rate.get('key'),
    })).toArray();

    return (
      <div className="PrepaidIncludeSetup">

        <Panel>
          <EntityRevisionDetails
            itemName="prepaid_include"
            revisions={revisions}
            item={item}
            mode={mode}
            onChangeFrom={this.onChangeFieldValue}
            backToList={this.handleBack}
            reLoadItem={this.fetchItem}
            clearRevisions={this.clearRevisions}
          />
        </Panel>

        <Tabs defaultActiveKey={this.state.activeTab} id="PrepaidInclude" animation={false} onSelect={this.handleSelectTab}>

          <Tab title="Details" eventKey={1}>
            <Panel style={{ borderTop: 'none' }}>
              <PrepaidInclude
                mode={mode}
                prepaidInclude={item}
                usageTypes={usageTypes}
                chargingByOptions={chargingByOptions}
                onChangeField={this.onChangeField}
                onChangeSelectField={this.onChangeSelectField}
              />
            </Panel>
          </Tab>

          <Tab title="Limited Products" eventKey={2}>
            <Panel style={{ borderTop: 'none' }}>
              <LimitedDestinations
                mode={mode}
                limitedDestinations={item.get('allowed_in', Immutable.Map())}
                allRates={allRatesOptions}
                onSelectPlan={this.onSelectPlan}
                onChange={this.onChangeLimitedDestinations}
              />
            </Panel>
          </Tab>
        </Tabs>
        <ActionButtons onClickCancel={this.handleBack} onClickSave={this.handleSave} />
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  itemId: idSelector(state, props, 'prepaid_include'),
  item: itemSelector(state, props, 'prepaid_include'),
  mode: modeSelector(state, props, 'prepaid_include'),
  activeTab: tabSelector(state, props, 'prepaid_include'),
  revisions: revisionsSelector(state, props, 'prepaid_include'),
  allRates: state.list.get('all_rates'),
  usageTypes: state.settings.get('usage_types'),
});
export default withRouter(connect(mapStateToProps)(PrepaidIncludeSetup));
