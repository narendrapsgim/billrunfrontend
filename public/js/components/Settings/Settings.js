import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getSettings, updateSetting } from '../../actions/settingsActions';
import Immutable from 'immutable';

import Tabs from 'react-bootstrap/lib/Tabs';
import Tab from 'react-bootstrap/lib/Tab';

import DateTime from './DateTime';
import Collections from './Collections';
import CurrencyTax from './CurrencyTax';

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
  }

  componentWillMount() {
    this.props.dispatch(getSettings());
  }

  onChangeCollection(e) {
    let { id, value } = e.target;
    this.props.dispatch(updateSetting(['collection', id], value));
  }

  onChangeDatetime(e) {
    let { id, value } = e.target;
    this.props.dispatch(updateSetting(['datetime', id], value));
  }

  onChangeCurrencyTax(e) {
    let { id, value } = e.target;
    this.props.dispatch(updateSetting(['currency_tax', id], value));
  }
  
  render() {
    let { settings } = this.props;
    let collection = settings.get('collection') || Immutable.Map();
    let datetime = settings.get('datetime') || Immutable.Map();
    let currency_tax = settings.get('currency_tax') || Immutable.Map();

    return (
      <Tabs defaultActiveKey={1} animation={false} id="SettingsTab">
        <Tab title="Date, Time, and Zone" eventKey={1}>
          <DateTime onChange={this.onChangeDatetime} data={datetime} />
        </Tab>
        <Tab title="Payment Gateways" eventKey={2}>Payment Gateways</Tab>
        <Tab title="Currency and tax" eventKey={3}>
          <CurrencyTax onChange={this.onChangeCurrencyTax} data={currency_tax} />
        </Tab>
        <Tab title="Collections" eventKey={4}>
          <Collections onChange={this.onChangeCollection} data={collection} />
        </Tab>
      </Tabs>
    );
  }
}

function mapStateToProps(state, props) {
  return {settings: state.settings};
}

export default connect(mapStateToProps)(Settings);
