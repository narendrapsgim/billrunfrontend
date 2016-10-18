import React, { Component } from 'react';
import Select from 'react-select';

export default class StateDropDown extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {name, value, onChange, optionsType = 'yesNo', hide} = this.props;
    if (hide) return (null);

    let options = {
      yesNo: [
      { value: 1, label: 'Yes' },
      { value: 0, label: 'No' }
      ],
      trueFalse: [
        { value: 1, label: 'True' },
        { value: 0, label: 'False' }
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
