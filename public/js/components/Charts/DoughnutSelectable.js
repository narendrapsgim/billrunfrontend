import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import DoughnutChart from './DoughnutChart';
import { palitra, trend } from './helpers';
import WidgetsHOC from './WidgetsHOC';

class DoughnutSelectable extends Component {

  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    data: PropTypes.object,
    type: PropTypes.string,
    parseValue: PropTypes.func,
    parseLabel: PropTypes.func,
    parsePercent: PropTypes.func,
  };

  static defaultProps = {
    // width: 100,
    // height: 70,
    data: {
      labels: [],
      values: [],
    },
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
      const sum = data.values.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
      return data.values[selectedIndex] / sum;
    }
    return '';
  }

  renderLegend = () => {
    const { data } = this.props;
    const { selectedIndex } = this.state;
    const width = 100 / data.labels.length;
    return data.labels.map((label, idx) => (
      <div key={idx} className="inline" style={{ width: `${width}%`, textAlign: 'center', color: palitra(idx), fontWeight: (idx === selectedIndex) ? 'bold' : 'normal' }}>
        <p className="mb0">{ this.props.parseValue(data.values[idx]) }</p>
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

    const sign = (data.sign && data.sign[selectedIndex] !== 0) ? data.sign[selectedIndex] : 0;
    const signClass = classNames('fa fa-3x', {
      'fa-caret-up': sign > 0,
      'fa-caret-down': sign < 0,
    });

    return (
      <div className="details">
        <div style={{ height: 40 }}>
          <h4 className="details-left">
            {`${this.props.parsePercent(percentage)} | ${this.props.parseValue(data.values[selectedIndex])}`}
          </h4>
          { (sign !== 0) &&
            <p className="details-right">
              <i className={signClass} style={{ color: trend(sign) }} />
            </p>
          }
        </div>
        <p style={{ color: palitra(selectedIndex) }}>
          { this.props.parseLabel(data.labels[selectedIndex]) }
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
