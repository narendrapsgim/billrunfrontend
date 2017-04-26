import React, { Component, PropTypes } from 'react';
import LineChart from './LineChart';
import WidgetsHOC from './WidgetsHOC';

class LineCompare extends Component {

  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    data: PropTypes.object,
    parseXValue: PropTypes.func,
    parseYValue: PropTypes.func,
  };

  static defaultProps = {
    data: {
      x: [{ values: [] }],
      y: [],
    },
    parseXValue: value => value,
    parseYValue: label => label,
  };

  getOptions = () => ({
    legend: {
      display: true,
      position: 'top',
      labels: {
        padding: 20,
        usePointStyle: true,
      },
    },
    scales: {
      xAxes: [{
        gridLines: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          padding: 10,
          callback: label => this.props.parseXValue(label),
        },
      }],
      yAxes: [{
        gridLines: {
          display: true,
          color: 'rgba(199, 195, 196, 0.5)',
          drawBorder: false,
        },
        ticks: {
          suggestedMax: 100,
          suggestedMin: 0,
          autoSkip: true,
          padding: 10,
          callback: (label) => {
            const val = (label > 1000) ? label / 1000 : label;
            return label > 1000 ? `${val}k` : val;
          },
        },
        scaleLabel: {
          display: true,
          labelString: `${this.props.parseYValue(1)}k = ${this.props.parseYValue(1000)}`,
        },
      }],
    },
    tooltips: {
      enabled: true,
      displayColors: false,
      callbacks: {
        label: tooltipItem => this.props.parseYValue(tooltipItem.yLabel),
        title: tooltipItem => this.props.parseXValue(tooltipItem.yLabel),
      },
    },
    layout: {
      padding: {
        left: 10,
        top: 0,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  });

  render() {
    const { data, width, height } = this.props;
    const options = this.getOptions();
    return (
      <div className="LineCompare" style={{ width: '100%', height: '100%' }}>
        <LineChart width={width} height={height} data={data} options={options} />
      </div>
    );
  }
}


export default WidgetsHOC(LineCompare);
