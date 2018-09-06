import React, { PropTypes } from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { getConfig } from '../../../common/Util';

const DateTime = (props) => {
  const {
    editable,
    value,
    disabled,
    placeholder,
    onChange,
    dateFormat,
    timeFormat,
    message,
    timeIntervals,
    ...otherProps
  } = props;
  if (!editable) {
    const displayValue = (moment.isMoment(value) && value.isValid())
      ? value.format(dateFormat)
      : value;
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
      showTimeSelect
      timeIntervals={timeIntervals}
      dateFormat={dateFormat}
      timeFormat={timeFormat}
      selected={selected}
      onChange={onChange}
      disabled={disabled}
      placeholderText={placeholderText}
    >
      {message}
    </DatePicker>
  );
};

DateTime.defaultProps = {
  required: false,
  disabled: false,
  editable: true,
  placeholder: '',
  message: null,
  dateFormat: getConfig('datetimeFormat', 'DD/MM/YYYY HH:mm'),
  timeFormat: getConfig('timeFormat', 'HH:mm'),
  timeIntervals: 15,
  onChange: () => {},
};

DateTime.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.instanceOf(moment),
    null,
  ]),
  disabled: PropTypes.bool,
  editable: PropTypes.bool,
  placeholder: PropTypes.string,
  dateFormat: PropTypes.string,
  timeFormat: PropTypes.string,
  timeIntervals: PropTypes.number,
  message: PropTypes.node,
  onChange: PropTypes.func,
};

export default DateTime;
