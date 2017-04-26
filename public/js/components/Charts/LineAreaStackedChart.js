import React, { Component, PropTypes } from 'react';
import { Line } from 'react-chartjs-2';
import { palitra } from './helpers';


export default class LineAreaStackedChart extends Component {

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
        mode: 'label',
      },
      hover: {
        mode: 'label',
      },
      scales: {
        xAxes: [
          {
            stacked: true,
          },
        ],
        yAxes: [
          {
            stacked: true,
          },
        ],
      },
    };
    return Object.assign(defaultOptions, options);
  }

  prepareData = () => {
    const { data } = this.props;
    const chartData = {};
    chartData.labels = data.y || Array.from(new Array(data.x[0].values.length), (x, i) => i + 1);
    chartData.datasets = data.x.map((x, i) => ({
      label: x.label,
      data: x.values,
      fill: true,
      lineTension: 0.2,
      borderWidth: 1,
      borderColor: palitra(i),
      backgroundColor: palitra(i),
      pointBackgroundColor: 'white',
      pointBorderColor: palitra(i),
      pointHoverBorderColor: 'white',
      pointHoverBackgroundColor: palitra(i, 'dark'),
    }));
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
