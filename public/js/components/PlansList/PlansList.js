import React, { Component } from 'react';
import Immutable from 'immutable';
import changeCase from 'change-case';
import EntityList from '../EntityList';


class PlansList extends Component {

  parserTrial = (item) => {
    if (item.getIn(['price', 0, 'trial'])) {
      return `${item.getIn(['price', 0, 'to'])} ${item.getIn(['recurrence', 'periodicity'])}`;
    }
    return '';
  };

  parserRecuringCharges = (item) => {
    const sub = item.getIn(['price', 0, 'trial']) ? 1 : 0;
    const cycles = item.get('price', Immutable.List()).size - sub;
    return `${cycles} cycles`;
  };

  parserBillingFrequency = (item) => {
    const periodicity = item.getIn(['recurrence', 'periodicity'], '');
    return (!periodicity) ? '' : `${changeCase.upperCaseFirst(periodicity)}ly`;
  };

  parserChargingMode = item => (item.get('upfront') ? 'Upfront' : 'Arrears');

  getFilterFields = () => ([
    { id: 'description', title: 'Title', sort: true },
    { id: 'name', title: 'Key', sort: true },
    { id: 'code', title: 'External Code', sort: true },
    { title: 'Trial', parser: this.parserTrial },
    { id: 'recurrence_charges', title: 'Recurring Charges', parser: this.parserRecuringCharges },
    { id: 'recurrence_frequency', title: 'Billing Frequency', parser: this.parserBillingFrequency },
    { id: 'charging_mode', title: 'Charging Mode', parser: this.parserChargingMode },
    { id: 'connection_type', display: false, showFilter: false },
  ]);

  getTableFields = () => ([
    { id: 'name', placeholder: 'Key' },
    { id: 'description', placeholder: 'Title' },
    { id: 'to', display: false, type: 'datetime', showFilter: false },
  ])

  getProjectFields = () => ({
    recurrence_frequency: 1,
    recurrence_charges: 1,
    connection_type: 1,
    charging_mode: 1,
    description: 1,
    recurrence: 1,
    upfront: 1,
    price: 1,
    name: 1,
    code: 1,
    to: 1,
  });

  render() {
    return (
      <EntityList
        itemsType="plans"
        itemType="plan"
        filterFields={this.getFilterFields()}
        tableFields={this.getTableFields()}
        projectFields={this.getProjectFields()}
      />
    );
  }
}

export default PlansList;
