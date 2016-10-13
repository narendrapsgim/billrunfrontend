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
import Subscriptions from './Subscriptions';

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

          this.context.router.push({
            pathname: "/customers"
          });
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
        const errorMessage = failure.error[0].error.display.desc ? failure.error[0].error.display.desc : failure.error[0].error.message;
        dispatch(showDanger(`Error - ${errorMessage}`));
        console.log(failure);
      }
    ).catch(
      error => {
	dispatch(showDanger("Network error - please try again"));
	dispatch(apiBillRunErrorHandler(error));
      }
    );
  }
  
  onClickNewSubscription(aid, e) {
    window.location = `${globalSetting.serverUrl}/internalpaypage?aid=${aid}&return_url="${globalSetting.serverUrl}/subscriber?action=update&aid=${aid}"`;
  }

  onSaveSubscription = (subscription, data, callback) => {
    const newsub = subscription.withMutations(map => {
      Object.keys(data).map(field => {
        map.set(field, data[field]);
      });
    });
    const query = {
      api: "subscribers",
      params: [
        { method: "update" },
        { type: "subscriber" },
        { query: JSON.stringify({"aid": subscription.get('aid'),
                                 "sid": subscription.get('sid')}) },
        { update: JSON.stringify(data) }
      ]
    };
    apiBillRun(query).then(
      success => {
        callback(true);
        this.props.dispatch(showSuccess("Saved subscription successfully!"));
      },
      failure => {
        const errorMessage = failure.error[0].error.display.desc ? failure.error[0].error.display.desc : failure.error[0].error.message;
        dispatch(showDanger(`Error - ${errorMessage}`));
        console.log(failure);
      }
    ).catch(
      error => {
        this.props.dispatch(showDanger("Network error - please try again"));
      }
    );
  };
  
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

    </div>


  </div>
    </Tab>)
    ];
    if (action === "update") {
      tabs.push((
        <Tab title="Subscriptions" eventKey={2} key={2}>
          <div className="panel panel-default">
            <div className="panel-body">
              <Subscriptions
                  subscriptions={subscriptions}
                  aid={customer.get('aid')}
                  settings={settings.getIn(['subscriber', 'fields'])}
                  plans={plans}
                  onSaveSubscription={this.onSaveSubscription}
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

        <div style={{marginTop: 12}}>
          <button type="submit"
                  className="btn btn-primary"
                  onClick={this.onSaveCustomer}
                  style={{marginRight: 10}}>
            Save
          </button>
          <button type="reset"
                  className="btn btn-default"
                  onClick={this.onCancel}>
            Cancel
          </button>
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
