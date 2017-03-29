import React, { Component, PropTypes } from 'react';
import { Bar } from 'react-chartjs-2';
import { palitra, hexToRgba, trend } from './helpers';

export default class BarChart extends Component {

  static propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
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
        position: 'bottom',
      },
      hover: {
        mode: 'single',
      },
      tooltips: {
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
        borderWidth: 1,
        backgroundColor: hexToRgba(((linesCount === 1) ? trend(direction) : palitra([i])), 1),
        borderColor: hexToRgba(((linesCount === 1) ? trend(direction) : palitra([i])), 1),
        hoverBorderWidth: 1,
        hoverBackgroundColor: linesCount === 1 ? trend(direction) : palitra([i], 'light'),
        hoverBorderColor: linesCount === 1 ? trend(direction) : palitra([i], 'dark'),
      };
    });
    return chartData;
  }

  render() {
    const { width, height, data } = this.props;
    if (!data || !data.x) {
      return null;
    }
    return (
      <Bar
        data={this.prepareData()}
        options={this.getOptions()}
        width={width}
        height={height}
      />
    );
  }
}
