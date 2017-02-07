import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Map, List } from 'immutable';
import { Tabs, Tab, Panel } from 'react-bootstrap';
import ActionButtons from '../Elements/ActionButtons';
import { fetchPrepaidIncludeByIdQuery, getProductsKeysQuery } from '../../common/ApiQueries';
import PrepaidInclude from './PrepaidInclude';
import LimitedDestinations from './LimitedDestinations';
import { getEntity, updateEntityField, clearEntity } from '../../actions/entityActions';
import { showDanger } from '../../actions/alertsActions';
import { getList } from '../../actions/listActions';
import { setPageTitle } from '../../actions/guiStateActions/pageActions';
import { savePrepaidInclude } from '../../actions/prepaidIncludeActions';
import { getSettings } from '../../actions/settingsActions';
import { clearItems } from '../../actions/entityListActions';


class PrepaidIncludeSetup extends Component {

  static propTypes = {
    itemId: PropTypes.string,
    item: PropTypes.instanceOf(Map),
    mode: PropTypes.string,
    allRates: PropTypes.instanceOf(List),
    usageTypes: PropTypes.instanceOf(List),
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
    item: Map(),
    allRates: List(),
    usageTypes: List(),
    activeTab: 1,
  };

  state = {
    activeTab: parseInt(this.props.activeTab),
  }

  componentDidMount() {
    const { itemId, mode } = this.props;
    if (mode === 'new') {
      this.props.dispatch(setPageTitle('Create New Prepaid Bucket'));
      this.setDefaultValues();
    }
    if (itemId) {
      const query = fetchPrepaidIncludeByIdQuery(itemId);
      this.props.dispatch(getEntity('prepaid_include', query));
    }
    this.props.dispatch(getList('all_rates', getProductsKeysQuery()));
    this.props.dispatch(getSettings('usage_types'));
  }

  componentWillReceiveProps(nextProps) {
    const { item, mode } = nextProps;
    const { item: oldItem } = this.props;
    if (mode !== 'new' && item.get('name') && oldItem.get('name') !== item.get('name')) {
      this.props.dispatch(setPageTitle(`Edit Prepaid Bucket - ${item.get('name')}`));
    }
  }

  componentWillUnmount() {
    this.props.dispatch(clearEntity('prepaid_include'));
  }

  setDefaultValues = () => {
    this.props.dispatch(updateEntityField('prepaid_include', 'shared', false));
    this.props.dispatch(updateEntityField('prepaid_include', 'unlimited', false));
  }

  onChangeField = (e) => {
    const { id, value } = e.target;
    this.props.dispatch(updateEntityField('prepaid_include', id, value));
  };

  onChangeLimitedDestinations = (name, value) => {
    this.props.dispatch(updateEntityField('prepaid_include', ['allowed_in', name], value));
  };

  onSelectPlan = (name) => {
    const { item, dispatch } = this.props;
    if (item.getIn(['allowed_in', name])) {
      dispatch(showDanger('Plan already exists'));
      return;
    }
    this.props.dispatch(updateEntityField('prepaid_include', ['allowed_in', name], Map()));
  };

  afterSave = (response) => {
    if (response.status) {
      this.props.dispatch(clearItems('charging_plans')); // refetch items list because item was (changed in / added to) list
      this.handleBack();
    }
  }

  handleSave = () => {
    const { item, mode } = this.props;
    this.props.dispatch(savePrepaidInclude(item, mode, this.afterSave));
  };

  handleBack = () => {
    this.props.router.push('/prepaid_includes');
  }

  handleSelectTab = (key) => {
    this.setState({ activeTab: key });
  }

  render() {
    const { item, allRates, usageTypes } = this.props;

    const chargingByOptions = [
      { value: 'usagev', label: 'Usage volume' },
      { value: 'cost', label: 'Cost' },
      { value: 'total_cost', label: 'Total cost' },
    ];

    const allRatesOptions = allRates.map(rate => ({ value: rate.get('key'), label: rate.get('key') })).toArray();

    return (
      <div className="PrepaidIncludeSetup">
        <Tabs defaultActiveKey={this.state.activeTab} id="PrepaidInclude" animation={false} onSelect={this.handleSelectTab}>

          <Tab title="Details" eventKey={1}>
            <Panel style={{ borderTop: 'none' }}>
              <PrepaidInclude
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
                limitedDestinations={item.get('allowed_in', Map())}
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

const mapStateToProps = (state, props) => {
  const { tab: activeTab, action } = props.location.query;
  const { itemId } = props.params;
  const mode = action || ((itemId) ? 'update' : 'new');
  const item = state.entity.get('prepaid_include');
  const usageTypes = state.settings.get('usage_types');
  const allRates = state.list.get('all_rates');
  return { itemId, item, mode, usageTypes, allRates, activeTab };
};

export default withRouter(connect(mapStateToProps)(PrepaidIncludeSetup));
