import React, { Component } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import moment from 'moment';

/* ACTIONS */
import { getEntity, updateEntityField, gotEntity, clearEntity } from '../../actions/entityActions';
import { getList, clearList } from '../../actions/listActions';
import { getSettings } from '../../actions/settingsActions';
import { apiBillRun, apiBillRunErrorHandler } from '../../common/Api';
import { showSuccess, showDanger } from '../..//actions/alertsActions';

/* COMPONENTS */
import { PageHeader, Tabs, Tab } from 'react-bootstrap';
import Customer from './Customer';
import SubscriptionsList from './SubscriptionsList';
import Subscription from './Subscription';

class CustomerSetup extends Component {
  constructor(props) {
    super(props);

    this.onChangeCustomerField = this.onChangeCustomerField.bind(this);
    this.onSaveCustomer = this.onSaveCustomer.bind(this);
    this.onCancel = this.onCancel.bind(this);
  }

  componentDidMount() {
    const { aid } = this.props.location.query;
    if (aid) {
      const customer_params = {
        api: "subscribers",
        params: [
          { method: "query" },
          { query: JSON.stringify({aid: parseInt(aid, 10), type: "account"}) }
        ]
      };
      const subscriptions_params = {
        api: "find",
        params: [
          { collection: "subscribers" },
          { query: JSON.stringify({
            aid: parseInt(aid, 10),
            type: "subscriber",
            to: {"$gt": moment().toISOString()}
          }) }
        ]
      };
      const plans_params = {
        api: "find",
        params: [
          { collection: "plans" },
          { query: JSON.stringify({
            to: { "$gt": moment().toISOString() }
          }) }
        ]
      };
      this.props.dispatch(getEntity('customer', customer_params));
      this.props.dispatch(getList('subscriptions', subscriptions_params));
      this.props.dispatch(getList('plans', plans_params));
    }
    this.props.dispatch(getSettings('subscribers'));
  }

  componentWillUnmount() {
    this.props.dispatch(clearEntity());
    this.props.dispatch(clearList('subscriptions'));
  }

  onChangeCustomerField(e) {
    const { value, id } = e.target;
    this.props.dispatch(updateEntityField('customer', id, value));
  }
  
  onSaveCustomer() {
    const { dispatch, customer, location } = this.props;
    const { action } = location.query;

    const params = action === "update" ?
                   [{ method: "update" },
                    { type: "account" },
                    { query: JSON.stringify({"aid": customer.get('aid')}) },
                    { update: JSON.stringify(customer.toJS()) }] :
                   [{ method: "create" },
                    { type: "account" },
                    { subscriber: JSON.stringify(customer.toJS()) }];
    const query = {
      api: "subscribers",
      params
    };
    
    apiBillRun(query).then(
      success => {
        if (action === "update") {
          dispatch(showSuccess("Customer saved successfully"));
        } else {
          dispatch(showSuccess("Customer created successfully"));
          dispatch(gotEntity('customer', success.data[0].data.details));
          
          this.context.router.push({
            pathname: '/customer',
            query: {
              action: "update",
              aid: success.data[0].data.details.aid
            }
          });
        }
      },
      failure => {
        let errorMessages = failure.error.map( (response) => response.error.desc );
        dispatch(showDanger("Network error - could not retrieve customer! Please try again"));
        console.log(errorMessages);
      }
    ).catch(
      error => dispatch(apiBillRunErrorHandler(error))
    );
  }
  
  onClickNewSubscription(aid, e) {
    window.location = `${globalSetting.serverUrl}/internalpaypage?aid=${aid}&return_url="${globalSetting.serverUrl}/subscriber?action=update&aid=${aid}"`;
  }

  onCancel() {
    this.context.router.push({
      pathname: "/customers"
    });
  }

  render() {
    const { customer, subscriptions, settings, plans } = this.props;
    const { action } = this.props.location.query;

    const tabs = [(<Tab title="Customer Details" eventKey={1} key={1}>
  <div className="panel panel-default">
    <div className="panel-body">
      <Customer customer={customer}
                action={action}
                settings={settings.getIn(['account', 'fields'])}
                onChange={this.onChangeCustomerField} />
      <button type="submit"
              className="btn btn-primary"
              onClick={this.onSaveCustomer}
              style={{marginRight: 10}}>
        Submit
      </button>
      <button type="reset"
              className="btn btn-default"
              onClick={this.onCancel}>
        Cancel
      </button>
    </div>
  </div>
    </Tab>)
    ];
    if (action === "update") {
      tabs.push((
        <Tab title="Subscriptions" eventKey={2} key={2}>
          <div className="panel panel-default">
            <div className="panel-body">
              <SubscriptionsList
                  subscriptions={subscriptions}
                  aid={customer.get('aid')}
                  settings={settings.getIn(['subscriber', 'fields'])}
                  onNew={this.onClickNewSubscription}
              />
            </div>
          </div>
        </Tab>));
    }
    
    return (
      <div>

        <div className="row">
          <div className="col-lg-12">
            <Tabs defaultActiveKey={1} animation={false} id="CustomerEditTabs">
              { tabs }
            </Tabs>
          </div>
        </div>  

      </div>
    );
  }
}

CustomerSetup.contextTypes = {
  router: React.PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    customer: state.entity.get('customer') || Immutable.Map(),
    subscriptions: state.list.get('subscriptions') || Immutable.List(),
    settings: state.settings.get('subscribers') || Immutable.List(),
    plans: state.list.get('plans') || Immutable.List()
  };
}

export default connect(mapStateToProps)(CustomerSetup);
