import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import { palitra } from '../../Charts/helpers';
import WidgetsHOC from './WidgetsHOC';


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
    parsePercent: percent => percent,

  };

  render() {
    const { data: { values } } = this.props;
    const maxValue = Math.max(...values);
    const yearAvg = values.reduce((p, c) => p + c, 0) / values.length;
    const value = values[values.length - 1];
    const prevValue = values[values.length - 2];
    const percent = value / maxValue;

    const barStyle = { width: `${percent * 100}%`, backgroundColor: palitra(1), height: 12 };

    const yearDiff = value - yearAvg;
    const yearPercent = yearDiff / yearAvg;
    const yearPercentFromMax = yearAvg / maxValue;
    const charPersentYStyle = { marginLeft: `${(yearPercentFromMax * 100) - 3}%` };

    const monthDiff = value - prevValue;
    const monthPercent = monthDiff / prevValue;
    const monthPercentFromMax = prevValue / maxValue;
    const charPersentMStyle = { marginLeft: `${(monthPercentFromMax * 100) - 3}%` };

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
          <h2 className="value" style={{ marginTop: 0 }}>{ this.props.parseValue(value) }</h2>
          <div style={{ position: 'relative' }}>
            <div style={{ backgroundColor: '#DDDDDD' }}>
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
            <h4 className={valueMonthClass}>{ this.props.parsePercent(monthPercent) }</h4>
            <h4 className="value">{ this.props.parseValue(prevValue) }</h4>
            <div>
              <span className="legend">M</span>
              <span>Prev. Month</span>
            </div>
          </div>
          <div className="pull-right text-right">
            <h4 className={valueYearClass}>{ this.props.parsePercent(yearPercent) }</h4>
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


export default WidgetsHOC(PercentBar);
