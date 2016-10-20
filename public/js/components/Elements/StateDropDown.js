import React, { Component } from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';

class StateDropDown extends Component {
  render() {
    const {name, value = 1, onChange, optionsType = 'yesNo', hide} = this.props;
    if (hide) return (null);

    let options = {
      yesNo: [
        {value: 1, label: 'Yes'},
        {value: 0, label: 'No'}
      ],
      trueFalse: [
        {value: 1, label: 'True'},
        {value: 0, label: 'False'}
      ]
    };

    return (
      <Select
        name={name}
        value={value}
        clearable={false}
        options={options[optionsType]}
        onChange={onChange}
      />
    );
  }
}
export default connect()(StateDropDown)