import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import classNames from 'classnames';
import { palitra } from './helpers';
import WidgetsHOC from './WidgetsHOC';


class PercentBar extends Component {

  static propTypes = {
    data: PropTypes.instanceOf(Immutable.Map),
    parseValue: PropTypes.func,
    parsePercent: PropTypes.func,
  };

  static defaultProps = {
    data: Immutable.Map({
      values: Immutable.List(),
    }),
    parseValue: value => value,
    parsePercent: percent => percent,

  };

  render() {
    const { data } = this.props;
    const values = data.get('values', Immutable.List());
    const maxValue = Math.max(...values);
    const yearAvg = values.reduce((acc, cur) => acc + cur, 0) / values.size;
    const value = values.get(values.size - 1);
    const prevValue = values.get(values.size - 2);
    const percent = value / (maxValue !== 0 ? maxValue : 1);

    const barStyle = { width: `${percent * 100}%`, backgroundColor: palitra(1), height: 12 };

    const yearDiff = value - yearAvg;
    const yearPercent = yearDiff / (yearAvg !== 0 ? yearAvg : 1);
    const yearPercentFromMax = yearAvg / (maxValue !== 0 ? maxValue : 1);
    const charPersentYStyle = { marginLeft: `${(yearPercentFromMax * 100) - 3}%` };

    const monthDiff = value - prevValue;
    const monthPercent = monthDiff / (prevValue !== 0 ? prevValue : 1);
    const monthPercentFromMax = prevValue / (maxValue !== 0 ? maxValue : 1);
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
          <h2 className="value">{ this.props.parseValue(value) }</h2>
          <div style={{ position: 'relative' }}>
            <div style={{ backgroundColor: '#DDDDDD' }}>
              <div style={barStyle}>&nbsp;</div>
            </div>
            <span className={markerYearClass} style={charPersentYStyle}>Y</span>
            <span className={markerMonthClass} style={charPersentMStyle}>M</span>
          </div>
        </div>
        <div className="clearfix" />
        <div className="details">
          <div className="details-left text-left">
            <h4 className={valueMonthClass}>{ this.props.parsePercent(monthPercent) }</h4>
            <h4 className="value">{ this.props.parseValue(prevValue) }</h4>
            <div>
              <span className="legend">M</span>
              <span>Prev. Month</span>
            </div>
          </div>
          <div className="details-right text-right">
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
