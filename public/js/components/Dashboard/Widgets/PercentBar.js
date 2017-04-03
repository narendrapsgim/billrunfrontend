import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import { palitra } from '../../Charts/helpers';


class PercentBar extends Component {

  static propTypes = {
    data: PropTypes.object,
    parseValue: PropTypes.func,
    parsePercent: PropTypes.func,
  };

  static defaultProps = {
    data: {
      values: [],
    },
    parseValue: value => value,
    parsePercent: percent => Number(percent).toLocaleString('en-US', { style: 'percent', maximumFractionDigits: 2 }),

  };

  render() {
    const { data: { values } } = this.props;
    const maxValue = Math.max(...values);
    const yearAvg = values.reduce((p, c) => p + c, 0) / values.length;

    const value = values[values.length - 1];
    const prevValue = values[values.length - 2];
    const persent = value / maxValue;

    const barStyle = { width: `${persent * 100}%`, backgroundColor: palitra(1) };

    const yearDiff = (value - yearAvg) / yearAvg;
    const yearPercent = yearAvg / maxValue;
    const charPersentYStyle = { marginLeft: `${(yearPercent * 100) - 3}%` };

    const monthDiff = (value - maxValue) / maxValue;
    const monthPercent = prevValue / maxValue;
    const charPersentMStyle = { marginLeft: `${(monthPercent * 100) - 3}%` };

    const markerYearClass = classNames('marker', {
      negative: yearDiff < 0,
    });
    const markerMonthClass = classNames('marker', {
      negative: monthDiff < 0,
    });
    const valueMonthClass = classNames('diff', {
      negative: monthDiff < 0,
    });
    const valueYearClass = classNames('diff', {
      negative: yearDiff < 0,
    });

    return (
      <div className="percentBarChart">
        <div>
          <h3 className="value" style={{ marginTop: 0 }}>{ this.props.parseValue(value) }</h3>
          <div style={{ position: 'relative' }}>
            <div style={{ backgroundColor: '#F5F5F5' }}>
              <div style={barStyle}>&nbsp;</div>
            </div>
            <span className={markerYearClass} style={charPersentYStyle}>Y</span>
            <span className={markerMonthClass} style={charPersentMStyle}>M</span>
          </div>
        </div>
        <br />
        <br />
        <div>
          <div className="pull-left text-left">
            <h4 className={valueMonthClass}>{ this.props.parsePercent(monthDiff) }</h4>
            <h4 className="value">{ this.props.parseValue(prevValue) }</h4>
            <div>
              <span className="legend">M</span>
              <span>Prev. Month</span>
            </div>
          </div>
          <div className="pull-right text-right">
            <h4 className={valueYearClass}>{ this.props.parsePercent(yearDiff) }</h4>
            <h4 className="value">{ this.props.parseValue(yearAvg) }</h4>
            <div>
              <span className="legend">Y</span>
              <span>Yearly AVG.</span>
            </div>
          </div>
        </div>
        <div className="clearfix" />
      </div>
    );
  }
}


export default PercentBar;
