import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Col, Tabs, Tab, Panel } from 'react-bootstrap';
import Immutable from 'immutable';
import moment from 'moment';
import ChargingPlanDetails from './ChargingPlanDetails';
import ChargingPlanIncludes from './ChargingPlanIncludes';
import { EntityRevisionDetails } from '../Entity';
import { ActionButtons, LoadingItemPlaceholder } from '../Elements';
import { getPrepaidIncludesQuery } from '../../common/ApiQueries';
import { buildPageTitle, getItemDateValue, getConfig } from '../../common/Util';
import {
  getPlan,
  clearPlan,
  savePlan,
  onPlanFieldUpdate,
  addUsagetInclude,
  onPlanTariffAdd,
} from '../../actions/planActions';
import { getList } from '../../actions/listActions';
import { showWarning, showSuccess } from '../../actions/alertsActions';
import { setPageTitle } from '../../actions/guiStateActions/pageActions';
import { clearItems, getRevisions, clearRevisions } from '../../actions/entityListActions';
import { modeSelector, itemSelector, idSelector, tabSelector, revisionsSelector } from '../../selectors/entitySelector';


class ChargingPlanSetup extends Component {

  static propTypes = {
    itemId: PropTypes.string,
    item: PropTypes.instanceOf(Immutable.Map),
    revisions: PropTypes.instanceOf(Immutable.List),
    mode: PropTypes.string,
    prepaidIncludes: PropTypes.instanceOf(Immutable.List),
    activeTab: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    router: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  static defaultProps = {
    item: Immutable.Map(),
    revisions: Immutable.List(),
    prepaidIncludes: Immutable.List(),
    activeTab: 1,
  };

  state = {
    activeTab: parseInt(this.props.activeTab),
  }

  componentWillMount() {
    const { itemId } = this.props;
    if (itemId) {
      this.props.dispatch(getPlan(itemId)).then(this.afterItemReceived);
    }
    this.initDefaultValues();
  }

  componentDidMount() {
    const { mode } = this.props;
    if (mode === 'create') {
      const pageTitle = buildPageTitle(mode, 'charging_plan');
      this.props.dispatch(setPageTitle(pageTitle));
    }
    this.props.dispatch(getList('prepaid_includes', getPrepaidIncludesQuery()));
  }


  componentWillReceiveProps(nextProps) {
    const { item, mode, itemId, revisions } = nextProps;
    const {
      item: oldItem,
      itemId: oldItemId,
      mode: oldMode,
      revisions: oldRevisions,
    } = this.props;
    if (mode !== oldMode || oldItem.get('name') !== item.get('name')) {
      const pageTitle = buildPageTitle(mode, 'charging_plan', item);
      this.props.dispatch(setPageTitle(pageTitle));
    }
    if (itemId !== oldItemId || !Immutable.is(revisions, oldRevisions)) {
      this.props.dispatch(getPlan(itemId)).then(this.afterItemReceived);
    }
  }

  componentWillUnmount() {
    this.props.dispatch(clearPlan());
  }

  initDefaultValues = () => {
    const { mode, item } = this.props;
    if (mode === 'create' || (mode === 'closeandnew' && getItemDateValue(item, 'from').isBefore(moment()))) {
      const defaultFromValue = moment().add(1, 'days').toISOString();
      this.props.dispatch(onPlanFieldUpdate(['from'], defaultFromValue));
    }
    if (mode === 'create') {
      this.props.dispatch(onPlanFieldUpdate(['connection_type'], 'prepaid'));
      this.props.dispatch(onPlanFieldUpdate(['charging_type'], 'prepaid'));
      this.props.dispatch(onPlanFieldUpdate(['type'], 'charging'));
      this.props.dispatch(onPlanTariffAdd());
      this.props.dispatch(onPlanFieldUpdate(['price', 0, 'price'], 0));
      this.props.dispatch(onPlanFieldUpdate(['upfront'], true));
      this.props.dispatch(onPlanFieldUpdate(['recurrence'], Immutable.Map({ unit: 1, periodicity: 'month' })));
    }
  }

  initRevisions = () => {
    const { item, revisions } = this.props;
    if (revisions.isEmpty() && item.getIn(['_id', '$id'], false)) {
      const key = item.get('name', '');
      this.props.dispatch(getRevisions('plans', 'name', key));
    }
  }

  afterItemReceived = (response) => {
    if (response.status) {
      this.initRevisions();
      this.initDefaultValues();
    } else {
      this.handleBack();
    }
  }

  onChangeField = (path, value) => {
    this.props.dispatch(onPlanFieldUpdate(path, value));
  };

  onSelectPPInclude = (value) => {
    const { prepaidIncludes } = this.props;
    const ppInclude = prepaidIncludes.find(pp => pp.get('name') === value);
    const usaget = ppInclude.get('charging_by_usaget');
    if (this.props.item.getIn(['include', usaget])) {
      this.props.dispatch(showWarning('Prepaid bucket already defined'));
    } else {
      const ppIncludesName = ppInclude.get('name');
      const ppIncludesExternalId = ppInclude.get('external_id');
      this.props.dispatch(addUsagetInclude(usaget, ppIncludesName, ppIncludesExternalId));
    }
  };

  onUpdatePeriodField = (type, id, value) => {
    this.props.dispatch(onPlanFieldUpdate(['include', type, 'period', id], value));
  };

  onUpdateIncludeField = (usaget, id, value) => {
    this.props.dispatch(onPlanFieldUpdate(['include', usaget, id], value));
  };

  afterSave = (response) => {
    const { mode, item } = this.props;
    if (response.status) {
      const key = item.get('name', '');
      this.props.dispatch(clearRevisions('plans', key)); // refetch items list because item was (changed in / added to) list
      const action = (mode === 'create') ? 'created' : 'updated';
      this.props.dispatch(showSuccess(`The plan was ${action}`));
      this.handleBack(true);
    }
  }

  handleSave = () => {
    const { item, mode } = this.props;
    this.props.dispatch(savePlan(item, mode)).then(this.afterSave);
  };

  handleBack = (itemWasChanged = false) => {
    if (itemWasChanged) {
      this.props.dispatch(clearItems('charging_plans')); // refetch items list because item was (changed in / added to) list
    }
    const listUrl = getConfig(['systemItems', 'charging_plan', 'itemsType'], '');
    this.props.router.push(`/${listUrl}`);
  };

  handleSelectTab = (key) => {
    this.setState({ activeTab: key });
  }

  render() {
    const { item, prepaidIncludes, mode, revisions } = this.props;
    if (mode === 'loading') {
      return (<LoadingItemPlaceholder onClick={this.handleBack} />);
    }

    const prepaidIncludesOptions = prepaidIncludes.map(pp => ({
      label: pp.get('name'),
      value: pp.get('name'),
    })).toJS();
    return (
      <div className="ChargingPlanSetup">
        <Col lg={12} md={12}>

          <Panel>
            <EntityRevisionDetails
              revisions={revisions}
              item={item}
              mode={mode}
              onChangeFrom={this.onChangeField}
              itemName="charging_plan"
              backToList={this.handleBack}
            />
          </Panel>

          <Tabs defaultActiveKey={this.state.activeTab} id="ChargingPlan" animation={false} onSelect={this.handleSelectTab}>

            <Tab title="Details" eventKey={1}>
              <Panel style={{ borderTop: 'none' }}>
                <ChargingPlanDetails
                  item={item}
                  mode={mode}
                  onChangeField={this.onChangeField}
                />
              </Panel>
            </Tab>

            <Tab title="Prepaid Buckets" eventKey={2}>
              <Panel style={{ borderTop: 'none' }}>
                <ChargingPlanIncludes
                  mode={mode}
                  includes={item.get('include', Immutable.Map())}
                  prepaidIncludesOptions={prepaidIncludesOptions}
                  onSelectPPInclude={this.onSelectPPInclude}
                  onUpdatePeriodField={this.onUpdatePeriodField}
                  onUpdateField={this.onUpdateIncludeField}
                />
              </Panel>
            </Tab>
          </Tabs>

          <ActionButtons onClickCancel={this.handleBack} onClickSave={this.handleSave} />

        </Col>
      </div>
    );
  }
}


const mapStateToProps = (state, props) => ({
  itemId: idSelector(state, props, 'plan'),
  item: itemSelector(state, props, 'plan'),
  mode: modeSelector(state, props, 'plan'),
  activeTab: tabSelector(state, props, 'plan'),
  revisions: revisionsSelector(state, props, 'plan'),
  prepaidIncludes: state.list.get('prepaid_includes'),
});
export default withRouter(connect(mapStateToProps)(ChargingPlanSetup));
