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
import PaymentGateways from './PaymentGateways';

import InputProcessorsList from '../InputProcessorsList';
import InputProcessor from '../InputProcessor';

const styles = {
  inkBar: {
    backgroundColor: "#0091FA",
    color: "black"
  },
  tabItem: {
    backgroundColor: "white",
    color: "black"
  },
  tab: {
    color: "#0091FA"
  }
};

class Settings extends Component {
  constructor(props) {
    super(props);

    this.onChangeCollection = this.onChangeCollection.bind(this);
    this.onChangeDatetime = this.onChangeDatetime.bind(this);
    this.onChangeCurrencyTax = this.onChangeCurrencyTax.bind(this);
    this.onSelectInputProcessor = this.onSelectInputProcessor.bind(this);
    this.onCancelInputProcessorEdit = this.onCancelInputProcessorEdit.bind(this);
    this.onSaveEmail = this.onSaveEmail.bind(this);
    this.onSave = this.onSave.bind(this);
    this.onSelectTab = this.onSelectTab.bind(this);

    this.state = {
      processor_selected: false,
      hideSave: false
    };
  }

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(getSettings(["pricing", "billrun", "payment_gateways"]));
    dispatch(getList("supported_gateways", {api: "supportedgateways"}));
  }
  
  onChangeCollection(e) {
    let { id, value } = e.target;
    this.props.dispatch(updateSetting(['collection', id], value));
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

  onSelectInputProcessor(file_type) {
    this.setState({processor_selected: file_type});
  }

  onCancelInputProcessorEdit() {
    this.setState({processor_selected: false});
  }

  onSaveEmail(email, which) {
    this.props.dispatch(updateSetting(['collection', `invoice_overdue_${which}_email`], email));
  }

  onSave(e) {
    const { setting } = this.props.location.query;
    this.props.dispatch(saveSettings(setting, this.props.settings));
  }

  onSelectTab(selected) {
    if (selected === 5) return this.setState({hideSave: true});
    return this.setState({hideSave: false});
  }
  
  render() {
    let { settings, supported_gateways } = this.props;
    
    let collection = settings.get('collection') || Immutable.Map();
    let datetime = settings.get('billrun') || Immutable.Map();
    let currency_tax = settings.get('pricing') || Immutable.Map();
    let payment_gateways = settings.get('payment_gateways') || Immutable.Map();
    const { processor_selected } = this.state;
    const inputProcessorView = (processor_selected ? <InputProcessor fileType={processor_selected} onCancel={this.onCancelInputProcessorEdit} /> : <InputProcessorsList onSelectInputProcessor={this.onSelectInputProcessor} />);

    const views = {
      billrun: {
        component: (<DateTime onChange={this.onChangeDatetime} data={datetime} />),
        title: "Date and Time"
      },
      pricing: {
        component: (<CurrencyTax onChange={this.onChangeCurrencyTax} data={currency_tax} />),
        title: "Currency and Tax"
      },
      payment_gateways: {
	component: (<PaymentGateways onChange={this.onChangePaymentGateways} data={payment_gateways} gateways={supported_gateways} />),
	title: "Payment Gateways"
      }
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
    settings: state.settings,
    supported_gateways: state.list.get('supported_gateways') || Immutable.List()
  };
}

export default connect(mapStateToProps)(Settings);
