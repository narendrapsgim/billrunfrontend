import React, { PropTypes } from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { getConfig } from '../../../common/Util';

const Date = (props) => {
  const { editable, value, disabled, placeholder, onChange, dateFormat, ...otherProps } = props;
  const format = dateFormat || getConfig('dateFormat', 'DD/MM/YYYY');
  if (!editable) {
    const displayValue = (moment.isMoment(value) && value.isValid()) ? value.format(format) : value;
    return (
      <div className="non-editable-field">{ displayValue }</div>
    );
  }
  const placeholderText = (disabled && !value) ? '' : placeholder;
  const selected = (moment.isMoment(value) && value.isValid()) ? value : null;
  return (
    <DatePicker
      {...otherProps}
      className="form-control"
      dateFormat={format}
      selected={selected}
      onChange={onChange}
      disabled={disabled}
      placeholderText={placeholderText}
    />
  );
};

Date.defaultProps = {
  required: false,
  disabled: false,
  editable: true,
  placeholder: '',
  onChange: () => {},
};

Date.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.instanceOf(moment),
    null,
  ]),
  disabled: PropTypes.bool,
  editable: PropTypes.bool,
  placeholder: PropTypes.string,
  dateFormat: PropTypes.string,
  onChange: PropTypes.func,
};

export default Date;
