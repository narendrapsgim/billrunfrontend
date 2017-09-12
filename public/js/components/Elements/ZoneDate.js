import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
/**
 * This Component Display a date aligned to the  time zone selected in the server.
 * ( As selected in the  configuration 'billrun.timezone' )
 */
class ZoneDate extends Component {

  static propTypes = {
    value: PropTypes.object.isRequired,
    format:PropTypes.string
  };

  static defaultProps = {
    value: moment(),
    format: globalSetting.dateFormat,
  };

  render( ) {
    const { value, format, timezone } = this.props;

    const date =  !value ?  '-' : moment(value).tz(timezone).format(format)
    return (
    <span>
      {date}
    </span>
  );
  }
};


const mapStateToProps = (state, props) => ({
  timezone: state.settings.getIn([ 'billrun','timezone']),
});
export default connect(mapStateToProps)(ZoneDate);
