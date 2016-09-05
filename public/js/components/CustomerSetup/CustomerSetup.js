import React, { Component } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';

/* ACTIONS */
import { getEntity, updateEntityField, gotEntity, clearEntity } from '../../actions/entityActions';
import { getSettings } from '../../actions/settingsActions';
import { apiBillRun, apiBillRunErrorHandler } from '../../common/Api';

/* COMPONENTS */
import { PageHeader, Tabs, Tab } from 'react-bootstrap';
import Customer from './Customer';
import SubscriptionsList from './SubscriptionsList';

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
      const params = {
        api: "subscribers",
        params: [
          { method: "query" },
          { query: JSON.stringify({aid: parseInt(aid, 10), type: "account"}) }
        ]
      };
      this.props.dispatch(getEntity('customer', params));
      //this.props.dispatch(getSubscriptions(aid));
    }
    this.props.dispatch(getSettings('subscribers'));
  }

  componentWillUnmount() {
    this.props.dispatch(clearEntity());
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
          //dispatch(showStatusMessage("Customer saved successfully", 'success'));
        } else {
          //dispatch(showStatusMessage("Customer created successfully", 'success'));
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
        console.log(errorMessages);
      }
    ).catch(
      error => dispatch(apiBillRunErrorHandler(error))
    );
  }
  
  onCancel() {
    this.context.router.push({
      pathname: "/customers"
    });
  }

  render() {
    const { customer, settings } = this.props;

    const tabs = [(<Tab title="Customer Details" eventKey={1} key={1}>
  <div className="panel panel-default">
    <div className="panel-body">
      <Customer customer={customer}
                settings={settings}
                onChange={this.onChangeCustomerField} />
      <button type="button"
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
    if (this.props.location.query.action === "update") {
      tabs.push((
        <Tab title="Subscriptions" eventKey={2} key={2}>
          <div className="panel panel-default">
            <div className="panel-body">
              <SubscriptionsList />
            </div>
          </div>
        </Tab>));
    }
    
    return (
      <div>

        <div className="row">
          <div className="col-lg-12">
            <PageHeader>Customer</PageHeader>
          </div>
        </div>

        <div className="row">
          <Tabs defaultActiveKey={1} animation={false} id="CustomerEditTabs">
            { tabs }
          </Tabs>
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
    settings: state.settings.get('subscribers')
  };
}

export default connect(mapStateToProps)(CustomerSetup);
