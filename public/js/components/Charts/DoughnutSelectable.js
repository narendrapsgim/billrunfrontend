import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import classNames from 'classnames';
import DoughnutChart from './DoughnutChart';
import { palitra, trend } from './helpers';
import WidgetsHOC from './WidgetsHOC';

class DoughnutSelectable extends Component {

  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    data: PropTypes.instanceOf(Immutable.Map),
    type: PropTypes.string,
    parseValue: PropTypes.func,
    parseLabel: PropTypes.func,
    parsePercent: PropTypes.func,
  };

  static defaultProps = {
    // width: 100,
    // height: 70,
    data: Immutable.Map({
      labels: Immutable.List(),
      values: Immutable.List(),
    }),
    type: 'legend',
    parseValue: value => value,
    parseLabel: label => label,
    parsePercent: percent => percent,
  };

  state = {
    selectedIndex: null,
  }

  getOptions = () => ({
    tooltips: {
      enabled: true,
      displayColors: false,
      callbacks: {
        label: (tooltipItem, data) => {
          const label = data.labels[tooltipItem.index] || '';
          return this.props.parseLabel(label);
        },
      },
    },
    legend: {
      display: false,
    },
    responsive: true,
    maintainAspectRatio: false,
  })

  onClick = (index) => {
    const { selectedIndex } = this.state;
    if (!isNaN(index)) {
      this.setState({
        selectedIndex: (selectedIndex === index) ? null : index,
      });
    }
  }

  calcSelectedItemPercentage = () => {
    const { data } = this.props;
    const { selectedIndex } = this.state;
    if (selectedIndex !== null) {
      const sum = data.get('values', Immutable.List()).reduce((accumulator, currentValue) => accumulator + currentValue, 0);
      return data.getIn(['values', selectedIndex], 0) / (sum !== 0 ? sum : 1);
    }
    return '';
  }

  renderLegend = () => {
    const { data } = this.props;
    const { selectedIndex } = this.state;
    const count = data.get('labels', Immutable.List()).size;
    const width = 100 / (count !== 0 ? count : 1);
    return data.get('labels', Immutable.List()).map((label, idx) => (
      <div key={idx} className="inline" style={{ width: `${width}%`, textAlign: 'center', color: palitra(idx), fontWeight: (idx === selectedIndex) ? 'bold' : 'normal' }}>
        <p className="mb0">{ this.props.parseValue(data.getIn(['values', idx], 0)) }</p>
        <p>{ this.props.parseLabel(label)}</p>
      </div>
    ));
  }

  renderDetails = (percentage) => {
    const { data } = this.props;
    const { selectedIndex } = this.state;

    if (selectedIndex === null) {
      return (
        <div style={{ minHeight: 72.5 }} />
      );
    }

    const sign = data.getIn(['sign', selectedIndex], 0);
    const signClass = classNames('fa fa-3x', {
      'fa-caret-up': sign > 0,
      'fa-caret-down': sign < 0,
    });

    return (
      <div className="details">
        <div style={{ height: 40 }}>
          <h4 className="details-left">
            {`${this.props.parsePercent(percentage)} | ${this.props.parseValue(data.getIn(['values', selectedIndex], ''))}`}
          </h4>
          { (sign !== 0) &&
            <p className="details-right">
              <i className={signClass} style={{ color: trend(sign) }} />
            </p>
          }
        </div>
        <p style={{ color: palitra(selectedIndex) }}>
          { this.props.parseLabel(data.getIn(['labels', selectedIndex], '')) }
        </p>
      </div>
    );
  }

  render() {
    const { width, height, data, type } = this.props;
    const options = this.getOptions();
    const percentage = this.calcSelectedItemPercentage();
    const message = (type === 'legend' && percentage !== '') ? this.props.parsePercent(percentage) : '';

    return (
      <div style={{ width: '100%', height: '100%' }} className={`chart-doughnut-${type}`}>
        <DoughnutChart
          width={width}
          height={height}
          data={data}
          options={options}
          onClick={this.onClick}
          message={message}
        />
        { type === 'legend' && this.renderLegend() }
        { type === 'details' && this.renderDetails(percentage) }
      </div>
    );
  }
}


export default WidgetsHOC(DoughnutSelectable);
