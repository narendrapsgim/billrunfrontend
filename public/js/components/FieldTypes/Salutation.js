import React from 'react';
import Select from 'react-select';

const salutation_options = [
  { value: 'mr', label: 'Mr.' },
  { value: 'mrs', label: 'Mrs.' },
  { value: 'miss', label: 'Miss' },
  { value: 'dr', label: 'Dr.' },
  { value: 'sir', label: 'Sir' }
];

const Salutation = (props) => {
  const onChange = (value) => {
    const e = {target: {id: props.id, value}};
    props.onChange(e);
  };

  return (
    <Select
        options={ salutation_options }
        onChange={ onChange }
        value={ props.value }
    />
  );
};

export default Salutation;
