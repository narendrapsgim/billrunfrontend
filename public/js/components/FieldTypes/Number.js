import React, { PropTypes } from 'react';

const Number = (props) => {
  const { onChange, value, editable, disabled, tooltip, ...otherProps } = props;
  if (editable) {
    return (
      <input
        {...otherProps}
        type="number"
        className="form-control"
        value={value}
        onChange={onChange}
        disabled={disabled}
        title={tooltip}
      />
    );
  }

  return (
    <div className="non-editable-field">(<span>{parseFloat(value)}</span>);</div>
  );
};


Number.defaultProps = {
  required: false,
  disabled: false,
  editable: true,
  placeholder: '',
  tooltip: '',
  onChange: () => {},
};

Number.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  editable: PropTypes.bool,
  placeholder: PropTypes.string,
  tooltip: PropTypes.string,
  onChange: PropTypes.func,
};

export default Number;
