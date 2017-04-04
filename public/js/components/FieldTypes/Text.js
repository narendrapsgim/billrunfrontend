import React, { PropTypes } from 'react';

const Text = (props) => {
  const {
    onChange,
    value,
    placeholder,
    required,
    disabled,
    editable,
    ...otherProps
  } = props;

  if (editable) {
    return (
      <div>
        <input
          {...otherProps}
          type="text"
          className="form-control"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
        />
      </div>
    );
  }
  return (
    <div className="non-editable-field">{ value }</div>
  );
};

Text.defaultProps = {
  required: false,
  disabled: false,
  editable: true,
  placeholder: '',
  onChange: () => {},
};

Text.propTypes = {
  value: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  editable: PropTypes.bool,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
};

export default Text;
