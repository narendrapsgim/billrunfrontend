import React, { Component, PropTypes } from 'react';
import { Line } from 'react-chartjs-2';
import { palitra, hexToRgba, trend } from './helpers';


export default class LineAreaChart extends Component {

  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    data: PropTypes.oneOfType([
      PropTypes.object,
      null,
    ]),
    options: PropTypes.object,
  };

  static defaultProps = {
    options: {},
    data: null,
  };

  getOptions = () => {
    const { data, options } = this.props;
    const defaultOptions = {
      responsive: true,
      title: {
        display: (typeof data.title !== 'undefined'),
        text: data.title,
      },
      legend: {
        display: (data.x.length > 1),
        position: 'bottom',
      },
      tooltips: {
        mode: 'single',
      },
      hover: {
        mode: 'single',
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
          },
        }],
      },
    };
    return Object.assign(defaultOptions, options);
  }

  prepareData = () => {
    const { data } = this.props;
    const linesCount = data.x.length;
    const chartData = {};
    chartData.labels = data.y || Array.from(new Array(data.x[0].values.length), (x, i) => i + 1);
    chartData.datasets = data.x.map((x, i) => {
      const direction = x.values[x.values.length - 1] - x.values[0];
      return {
        label: x.label,
        data: x.values,
        lineTension: 0.2,
        fill: true,
        borderWidth: 1,
        borderColor: linesCount === 1 ? trend(direction) : palitra(i),
        backgroundColor: hexToRgba(((linesCount === 1) ? trend(direction) : palitra(i, 'light')), 0.5),
        pointBackgroundColor: 'white',
        pointBorderColor: (linesCount === 1) ? trend(direction) : palitra(i),
        pointHoverBorderColor: 'white',
        pointHoverBackgroundColor: (linesCount === 1) ? trend(direction) : palitra(i, 'dark'),
      };
    });
    return chartData;
  }

  render() {
    const { width, height, data } = this.props;
    if (!data || !data.x || !data.y) {
      return null;
    }
    return (
      <Line
        data={this.prepareData()}
        options={this.getOptions()}
        width={width}
        height={height}
      />
    );
  }
}
