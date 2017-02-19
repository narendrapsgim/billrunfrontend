import React, { PropTypes } from 'react';
import uuid from 'uuid';

const Radio = ({ name, id, value, editable, disabled, checked, label, onChange }) => {
  const inputField = (
    <input
      type="radio"
      style={{ verticalAlign: 'top' }}
      name={name}
      id={id}
      value={value}
      checked={checked}
      disabled={disabled}
      onChange={onChange}
    />
  );

  if (!editable) {
    return (<span>{ value }</span>);
  }

  if (label.length) {
    return (
      <label htmlFor={id} style={{ paddingTop: '10px' }}>
        {inputField}
        {label}
      </label>
    );
  }

  return inputField;
};

Radio.defaultProps = {
  id: uuid.v4(),
  label: '',
  value: '',
  editable: true,
  checked: false,
  disabled: false,
  onChange: () => {},
};

Radio.propTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.string,
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  editable: PropTypes.bool,
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
};


export default Radio;
