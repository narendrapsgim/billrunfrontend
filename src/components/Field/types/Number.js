import React from 'react';
import PropTypes from 'prop-types';
import { InputGroup } from 'react-bootstrap';


const Number = (props) => {
  const { onChange, value, editable, disabled, tooltip, suffix, preffix, ...otherProps } = props;
  if (editable) {
    const input = (
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
    if (suffix !== null || preffix !== null) {
      return (
        <InputGroup>
          {preffix !== null && (<InputGroup.Addon>{preffix}</InputGroup.Addon>)}
          {input}
          {suffix !== null && (<InputGroup.Addon>{suffix}</InputGroup.Addon>)}
        </InputGroup>
      );
    }
    return input;
  }

  return (
    <div className="non-editable-field">
      <span>
        {(preffix !== null) && preffix}
        {parseFloat(value)}
        {(suffix !== null) && suffix}
      </span>
    </div>
  );
};


Number.defaultProps = {
  required: false,
  disabled: false,
  editable: true,
  placeholder: '',
  tooltip: '',
  suffix: null,
  preffix: null,
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
  suffix: PropTypes.node,
  preffix: PropTypes.node,
  onChange: PropTypes.func,
};

export default Number;
