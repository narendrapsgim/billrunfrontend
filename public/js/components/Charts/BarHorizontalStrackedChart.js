import React, { Component, PropTypes } from 'react';
import { HorizontalBar } from 'react-chartjs-2';
import { palitra } from './helpers';


export default class BarHorizontalStrackedChart extends Component {

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
        position: 'bottom',
      },
      hover: {
        mode: 'single',
      },
      tooltips: {
        mode: 'single',
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
      borderWidth: 1,
      backgroundColor: palitra(i),
      borderColor: palitra(i),
      hoverBorderWidth: 1,
      hoverBackgroundColor: palitra(i, 'light'),
      hoverBorderColor: palitra(i, 'dark'),
    }));
    return chartData;
  }

  render() {
    const { width, height, data } = this.props;
    if (!data || !data.x) {
      return null;
    }
    return (
      <HorizontalBar
        type="horizontalBar"
        data={this.prepareData()}
        options={this.getOptions()}
        width={width}
        height={height}
      />
    );
  }
}
