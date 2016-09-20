import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getSettings, updateSetting, saveSettings } from '../../actions/settingsActions';
import { getList } from '../../actions/listActions';
import Immutable from 'immutable';

import { PageHeader } from 'react-bootstrap';
import Tabs from 'react-bootstrap/lib/Tabs';
import Tab from 'react-bootstrap/lib/Tab';
import RaisedButton from 'material-ui/RaisedButton';

import DateTime from './DateTime';
import CurrencyTax from './CurrencyTax';

class Settings extends Component {
  constructor(props) {
    super(props);

    this.onChangeDatetime = this.onChangeDatetime.bind(this);
    this.onChangeCurrencyTax = this.onChangeCurrencyTax.bind(this);
    this.onSave = this.onSave.bind(this);
  }

  componentWillMount() {
    this.props.dispatch(getSettings(["pricing", "billrun"]));
  }

  onChangeFieldValue(category, e) {
    let { id, value } = e.target;
    this.props.dispatch(updateSetting(category, id, value));
  }
  
  onChangeDatetime(e) {
    let { id, value } = e.target;
    this.props.dispatch(updateSetting('billrun', id, value));
  }

  onChangeCurrencyTax(e) {
    let { id, value } = e.target;
    this.props.dispatch(updateSetting('pricing', id, value));
  }

  onSave(e) {
    const { setting } = this.props.location.query;
    this.props.dispatch(saveSettings(setting, this.props.settings));
  }
  
  render() {
    let { settings } = this.props;
    
    let collection = settings.get('collection') || Immutable.Map();
    let datetime = settings.get('billrun') || Immutable.Map();
    let currency_tax = settings.get('pricing') || Immutable.Map();

    const views = {
      billrun: {
        component: (<DateTime onChange={this.onChangeDatetime} data={datetime} />),
        title: "Date and Time"
      },
      pricing: {
        component: (<CurrencyTax onChange={this.onChangeCurrencyTax} data={currency_tax} />),
        title: "Currency and Tax"
      },
      /* payment_gateways: {
	 component: (<PaymentGateways onChange={this.onChangePaymentGateways} data={payment_gateways} gateways={supported_gateways} />),
	 title: "Payment Gateways"
       * }*/
    };
    const currentView = views[this.props.location.query.setting].component;

    return (
      <div>
        <div className="row">
          <div className="col-lg-12">
            <div className="panel panel-default">
              <div className="panel-heading">
                { views[this.props.location.query.setting].title }
              </div>
              <div className="panel-body">
                { currentView }
                <div style={{marginTop: 12}}>
                  <button className="btn btn-primary"
                          onClick={this.onSave}>
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    settings: state.settings
  };
}

export default connect(mapStateToProps)(Settings);
