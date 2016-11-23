import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Map, List } from 'immutable';
import moment from 'moment';

import { getEntity, updateEntityField, clearEntity } from '../../actions/entityActions';
import { showDanger } from '../../actions/alertsActions';
import { getList } from '../../actions/listActions';
import { setPageTitle } from '../../actions/guiStateActions/pageActions';
import { savePrepaidInclude } from '../../actions/prepaidIncludeActions';

import { Button, Tabs, Tab, Panel } from 'react-bootstrap';
import PrepaidInclude from './PrepaidInclude';
import LimitedDestinations from './LimitedDestinations';

class PrepaidIncludeSetup extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { dispatch, location } = this.props;
    const { pp_id, action } = location.query;
    if (action === 'new') {
      this.props.dispatch(setPageTitle('Create New Prepaid Bucket'));
    }
    if (pp_id) {
      const params = {
	api: 'find',
	params: [
	  { collection: 'prepaidincludes' },
	  { query: JSON.stringify({_id: pp_id}) }
	]
      };
      dispatch(getEntity('prepaid_include', params));
    }
    const query = {
      api: 'find',
      params: [
        { collection: 'rates' },
        { query: JSON.stringify({to: {"$gt": moment().toISOString()}}) },
        { project: JSON.stringify({'key': 1}) }
      ]
    };
    dispatch(getList('all_rates', query));
  }

  componentWillReceiveProps(nextProps) {
    const { prepaid_include } = nextProps;
    const { action } = this.props.location.query;
    if (action !== 'new' &&
        prepaid_include.get('name') &&
        this.props.prepaid_include.get('name') !== prepaid_include.get('name')) {
      this.props.dispatch(setPageTitle(`Edit Prepaid Bucket - ${prepaid_include.get('name')}`));
    }
  }
  
  componentWillUnmount() {
    this.props.dispatch(clearEntity('prepaid_include'));
  }
  
  onChangeField = (e) => {
    const { id, value } = e.target;
    this.props.dispatch(updateEntityField('prepaid_include', id, value));
  };

  handleSave = () => {
    this.props.dispatch(savePrepaidInclude(this.props.prepaid_include));
 };

  handleCancel = () => {
    this.props.router.push('/prepaid_includes');
  };

  onChangeLimitedDestinations = (name, value) => {
    this.props.dispatch(updateEntityField('prepaid_include', ['allowed_in', name], value));
  };

  onSelectPlan = (name) => {
    const { prepaid_include, dispatch } = this.props;
    if (prepaid_include.getIn(['allowed_in', name])) {
      dispatch(showDanger("Plan already exists"));
      return;
    }
    this.props.dispatch(updateEntityField('prepaid_include', ['allowed_in', name], Map()));
  };
  
  render() {
    const { prepaid_include, all_rates } = this.props;

    const charging_by_options = [
      { value: 'usagev', label: 'Usage volume' },
      { value: 'cost', label: 'Cost' },
      { value: 'total_cost', label: 'Total cost' }
    ];

    const allRatesOptions = all_rates.map(rate => {
      return {value: rate.get('key'), label: rate.get('key')};
    }).toJS();
    
    return (
      <div className="PrepaidIncludeSetup">
        <Tabs id="PrepaidInclude" defaultActiveKey={1} animation={false}>
          <Tab title="Details" eventKey={1}>
            <Panel style={{ borderTop: 'none' }}>
              <PrepaidInclude prepaidInclude={ prepaid_include }
                              onChangeField={ this.onChangeField }
                              onChangeSelectField={ this.onChangeSelectField }
                              chargingByOptions={ charging_by_options } />
            </Panel>
          </Tab>
          <Tab title="Limited Products" eventKey={2}>
            <Panel style={{ borderTop: 'none' }}>
              <LimitedDestinations
                  limitedDestinations={ prepaid_include.get('allowed_in', List()) }
                  onSelectPlan={ this.onSelectPlan }
                  onChange={ this.onChangeLimitedDestinations }
                  allRates={ allRatesOptions }/>
            </Panel>
          </Tab>
        </Tabs>
	<div style={{ marginTop: 12 }}>
          <Button onClick={ this.handleSave }
		  bsStyle="primary"
		  style={{ marginRight: 10 }}>
	    Save
	  </Button>
          <Button onClick={ this.handleCancel }
		  bsStyle="default">
	    Cancel
	  </Button>
	</div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    prepaid_include: state.entity.get('prepaid_include', Map()),
    all_rates: state.list.get('all_rates', List())
  };
}

export default withRouter(connect(mapStateToProps)(PrepaidIncludeSetup));
