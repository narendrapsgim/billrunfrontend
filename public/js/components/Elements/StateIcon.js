import React, { PropTypes } from 'react';
import moment from 'moment';
import classNames from 'classnames';


const StateIcon = ({ from, to }) => {
  const fromTime = moment(from);
  const toTime = moment(to);
  const stateClass = classNames('cycle', {
    expired: toTime.isBefore(moment()),
    future: fromTime.isAfter(moment()),
    active: !toTime.isBefore(moment()) && !fromTime.isAfter(moment()),
  });
  return (<div className={stateClass} />);
};

StateIcon.propTypes = {
  from: PropTypes.string,
  to: PropTypes.string,
};

export default StateIcon;
