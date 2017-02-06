import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Col, Tabs, Tab, Panel, Button } from 'react-bootstrap';
import Immutable from 'immutable';
import ChargingPlanDetails from './ChargingPlanDetails';
import ChargingPlanIncludes from './ChargingPlanIncludes';
import ActionButtons from '../Elements/ActionButtons';
import { getPrepaidIncludesQuery } from '../../common/ApiQueries';
import {
  getPlan,
  clearPlan,
  savePlan,
  onPlanFieldUpdate,
  addUsagetInclude,
} from '../../actions/planActions';
import { getList } from '../../actions/listActions';
import { showWarning } from '../../actions/alertsActions';
import { setPageTitle } from '../../actions/guiStateActions/pageActions';
import { clearItems } from '../../actions/entityListActions';


class ChargingPlanSetup extends Component {

  static propTypes = {
    itemId: PropTypes.string,
    item: PropTypes.instanceOf(Immutable.Map),
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
    prepaidIncludes: Immutable.List(),
    activeTab: 1,
  };

  state = {
    activeTab: parseInt(this.props.activeTab),
  }

  componentWillMount() {
    const { itemId } = this.props;
    if (itemId) {
      this.props.dispatch(getPlan(itemId));
    }
  }

  componentDidMount() {
    const { mode } = this.props;
    if (mode === 'new') {
      this.props.dispatch(setPageTitle('Create New Buckets Group'));
      this.props.dispatch(onPlanFieldUpdate(['connection_type'], 'prepaid'));
      this.props.dispatch(onPlanFieldUpdate(['charging_type'], 'prepaid'));
      this.props.dispatch(onPlanFieldUpdate(['type'], 'charging'));
      this.props.dispatch(onPlanFieldUpdate(['price'], 0));
      this.props.dispatch(onPlanFieldUpdate(['upfront'], true));
      this.props.dispatch(onPlanFieldUpdate(['recurrence'], Immutable.Map({ unit: 1, periodicity: 'month' })));
    }
    this.props.dispatch(getList('prepaid_includes', getPrepaidIncludesQuery()));
  }

  componentWillReceiveProps(nextProps) {
    const { item } = nextProps;
    const { item: oldItem, mode } = this.props;
    if (mode !== 'new' && item.get('name') && oldItem.get('name', '') !== item.get('name', '')) {
      this.props.dispatch(setPageTitle(`Edit Buckets Group - ${item.get('name')}`));
    }
  }

  componentWillUnmount() {
    this.props.dispatch(clearPlan());
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
    if (response.status) {
      this.props.dispatch(clearItems('charging_plans')); // refetch items list because item was (changed in / added to) list
      this.handleBack();
    }
  }

  handleSave = () => {
    const { item, mode } = this.props;
    this.props.dispatch(savePlan(item, mode)).then(this.afterSave);
  };

  handleBack = () => {
    this.props.router.push('/charging_plans');
  };

  handleSelectTab = (key) => {
    this.setState({ activeTab: key });
  }

  render() {
    const { item, prepaidIncludes, mode } = this.props;
    const prepaidIncludesOptions = prepaidIncludes.map(pp => ({
      label: pp.get('name'),
      value: pp.get('name'),
    })).toJS();

    return (
      <div className="ChargingPlanSetup">
        <Col lg={12} md={12}>
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

const mapStateToProps = (state, props) => {
  const { tab: activeTab, action } = props.location.query;
  const { itemId } = props.params;
  const mode = action || ((itemId) ? 'update' : 'new');
  const { plan: item } = state;
  const prepaidIncludes = state.list.get('prepaid_includes');
  return { itemId, item, mode, prepaidIncludes, activeTab };
};

export default withRouter(connect(mapStateToProps)(ChargingPlanSetup));
