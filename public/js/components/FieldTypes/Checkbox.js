import React from 'react';
import uuid from 'uuid';

const Checkbox = (props) => {
  const onChange = (e) => {
    const { id, checked } = e.target;
    props.onChange({ target: { id, value: checked } });
  };

  const { id = uuid.v4(), value='', editable=true, disabled=false, label = '' } = props;

  if (!editable) {
    return (<span>{ value ? 'Yes' : 'No' }</span>);
  }

  if (label.length) {
    return (
      <label htmlFor={id}>
        <input
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

export default Checkbox;
