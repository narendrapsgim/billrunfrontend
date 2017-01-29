import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Map, List } from 'immutable';
import { Button, Tabs, Tab, Panel } from 'react-bootstrap';
import { fetchPrepaidIncludeByIdQuery, getActiveProductsKeysQuery } from '../../common/ApiQueries';
import PrepaidInclude from './PrepaidInclude';
import LimitedDestinations from './LimitedDestinations';
import { getEntity, updateEntityField, clearEntity } from '../../actions/entityActions';
import { showDanger, showSuccess } from '../../actions/alertsActions';
import { getList } from '../../actions/listActions';
import { setPageTitle } from '../../actions/guiStateActions/pageActions';
import { savePrepaidInclude } from '../../actions/prepaidIncludeActions';
import { getSettings } from '../../actions/settingsActions';

class PrepaidIncludeSetup extends Component {

  static defaultProps = {
    prepaidInclude: Map(),
    allRates: List(),
    usageTypes: List(),
  };

  static propTypes = {
    itemId: PropTypes.string,
    action: PropTypes.string,
    prepaidInclude: PropTypes.instanceOf(Map),
    allRates: PropTypes.instanceOf(List),
    usageTypes: PropTypes.instanceOf(List),
    router: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    dispatch: PropTypes.func.isRequired,
  }

  componentDidMount() {
    const { itemId, action } = this.props;
    if (action === 'new') {
      this.props.dispatch(setPageTitle('Create New Prepaid Bucket'));
      this.setDefaultValues();
    }
    if (itemId) {
      const query = fetchPrepaidIncludeByIdQuery(itemId);
      this.props.dispatch(getEntity('prepaid_include', query));
    }
    this.props.dispatch(getList('all_rates', getActiveProductsKeysQuery()));
    this.props.dispatch(getSettings('usage_types'));
  }

  componentWillReceiveProps(nextProps) {
    const { prepaidInclude, action } = nextProps;
    const { prepaidInclude: oldPrepaidInclude } = this.props;
    if (action !== 'new' && prepaidInclude.get('name') && oldPrepaidInclude.get('name') !== prepaidInclude.get('name')) {
      this.props.dispatch(setPageTitle(`Edit Prepaid Bucket - ${prepaidInclude.get('name')}`));
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

  handleSave = () => {
    const { prepaidInclude, action } = this.props;
    const callback = (success) => {
      if (success) {
        this.props.dispatch(showSuccess('Saved prepaid bucket successfuly!'));
        this.handleBack();
      } else {
        this.props.dispatch(showDanger('Error saving prepaid bucket!'));
      }
    };
    this.props.dispatch(savePrepaidInclude(prepaidInclude, action, callback));
  };

  handleBack = () => {
    this.props.router.push('/prepaid_includes');
  }

  handleCancel = () => {
    this.handleBack();
  };

  onChangeLimitedDestinations = (name, value) => {
    this.props.dispatch(updateEntityField('prepaid_include', ['allowed_in', name], value));
  };

  onSelectPlan = (name) => {
    const { prepaidInclude, dispatch } = this.props;
    if (prepaidInclude.getIn(['allowed_in', name])) {
      dispatch(showDanger('Plan already exists'));
      return;
    }
    this.props.dispatch(updateEntityField('prepaid_include', ['allowed_in', name], Map()));
  };

  render() {
    const { prepaidInclude, allRates, usageTypes } = this.props;

    const chargingByOptions = [
      { value: 'usagev', label: 'Usage volume' },
      { value: 'cost', label: 'Cost' },
      { value: 'total_cost', label: 'Total cost' },
    ];

    const allRatesOptions = allRates.map(rate => ({ value: rate.get('key'), label: rate.get('key') })).toArray();

    return (
      <div className="PrepaidIncludeSetup">
        <Tabs id="PrepaidInclude" defaultActiveKey={1} animation={false}>

          <Tab title="Details" eventKey={1}>
            <Panel style={{ borderTop: 'none' }}>
              <PrepaidInclude
                prepaidInclude={prepaidInclude}
                onChangeField={this.onChangeField}
                usageTypes={usageTypes}
                onChangeSelectField={this.onChangeSelectField}
                chargingByOptions={chargingByOptions}
              />
            </Panel>
          </Tab>

          <Tab title="Limited Products" eventKey={2}>
            <Panel style={{ borderTop: 'none' }}>
              <LimitedDestinations
                limitedDestinations={prepaidInclude.get('allowed_in', Map())}
                onSelectPlan={this.onSelectPlan}
                onChange={this.onChangeLimitedDestinations}
                allRates={allRatesOptions}
              />
            </Panel>
          </Tab>
        </Tabs>

        <div style={{ marginTop: 12 }}>
          <Button onClick={this.handleSave} bsStyle="primary" style={{ marginRight: 10 }} >Save</Button>
          <Button onClick={this.handleCancel} bsStyle="default">Cancel</Button>
        </div>

      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  itemId: props.location.query.pp_id,
  action: props.location.query.action,
  usageTypes: state.settings.get('usage_types'),
  prepaidInclude: state.entity.get('prepaid_include'),
  allRates: state.list.get('all_rates'),
});

export default withRouter(connect(mapStateToProps)(PrepaidIncludeSetup));
