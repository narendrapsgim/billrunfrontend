import React, { Component, PropTypes } from 'react';
import { BarChart } from '../../Charts';
import WidgetsHOC from './WidgetsHOC';

class BarCompare extends Component {

  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    data: PropTypes.object,
    parseXValue: PropTypes.func,
    parseYValue: PropTypes.func,
  };

  static defaultProps = {
    // width: 100,
    // height: 50,
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
        pointStyle: 'line',
      },
    },
    scales: {
      xAxes: [{
        stacked: true,
        gridLines: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          padding: 20,
          callback: label => this.props.parseXValue(label),
        },
      }],
      yAxes: [{
        stacked: true,
        gridLines: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          suggestedMax: 100,
          suggestedMin: 0,
          autoSkip: true,
          padding: 40,
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
        title: (tooltipItem, data) => data.datasets[tooltipItem[0].datasetIndex].label || '',
      },
    },
    layout: {
      padding: {
        left: 10,
        top: 0,
      },
    },
  });

  render() {
    const { data, width, height } = this.props;
    const options = this.getOptions();
    return (
      <div className="BarCompare">
        <BarChart width={width} height={height} data={data} options={options} />
      </div>
    );
  }
}


export default WidgetsHOC(BarCompare);
