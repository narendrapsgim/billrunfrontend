import React from 'react';
import PropTypes from 'prop-types';
import { InputGroup } from 'react-bootstrap';
import isNumber from 'is-number';


const Percentage = ({
  onChange, value, editable, disabled, tooltip, preffix, ...otherProps
}) => {

  const onChangePercentage = (e) => {
    const val = e.target.value;
    const convertedVal = isNumber(val) ? parseFloat(val) / 100 : val;
    const convertedEvent = { target: { value:convertedVal } };
    onChange(convertedEvent);
  }

  const displayValue = isNumber(value) ? parseFloat((parseFloat(value) * 100).toFixed(3)) : value;

  if (editable) {
    return (
      <InputGroup>
        {preffix !== null && (<InputGroup.Addon>{preffix}</InputGroup.Addon>)}
        <input
          {...otherProps}
          type="number"
          className="form-control"
          value={displayValue}
          onChange={onChangePercentage}
          disabled={disabled}
          title={tooltip}
        />
        <InputGroup.Addon>%</InputGroup.Addon>
      </InputGroup>
    );
  }

  return (
    <div className="non-editable-field">
      <span>
        {(preffix !== null) && `${preffix} `}
        {displayValue}
        {isNumber(displayValue) && '%'}
      </span>
    </div>
  );
};


Percentage.defaultProps = {
  required: false,
  disabled: false,
  editable: true,
  placeholder: '',
  tooltip: '',
  suffix: null,
  preffix: null,
  onChange: () => {},
};

Percentage.propTypes = {
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

export default Percentage;
