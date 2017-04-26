import React, { PropTypes } from 'react';
import uuid from 'uuid';

const Checkbox = (props) => {
  const { id, value, editable, disabled, label } = props;
  const onChange = (e) => {
    const { checked } = e.target;
    props.onChange({ target: { id, value: checked } });
  };

  if (!editable) {
    return (<span>{ value ? 'Yes' : 'No' }</span>);
  }

  if (label.length) {
    return (
      <label htmlFor={id}>
        <input
          style={{ verticalAlign: 'top' }}
          type="checkbox"
          id={id}
          checked={value}
          disabled={disabled}
          onChange={onChange}
        />
        &nbsp;&nbsp;{ label }
      </label>
    );
  }

  return (
    <input
      type="checkbox"
      id={id}
      checked={value}
      disabled={disabled}
      onChange={onChange}
    />
  );
};

Checkbox.defaultProps = {
  id: uuid.v4(),
  label: '',
  value: false,
  editable: true,
  checked: false,
  disabled: false,
  onChange: () => {},
};

Checkbox.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOf([true, false, '']),
  editable: PropTypes.bool,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
};

export default Checkbox;
