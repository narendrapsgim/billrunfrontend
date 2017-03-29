import React, { Component, PropTypes } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { palitra } from './helpers';


export default class DoughnutChart extends Component {

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
        display: (data.values.length > 1),
        position: 'right',
        boxWidth: 20,
      },
    };
    return Object.assign(defaultOptions, options);
  }

  prepareData = () => {
    const { data } = this.props;
    const chartData = {
      labels: data.labels,
      datasets: [
        {
          data: data.values,
          backgroundColor: data.values.map((x, i) => palitra([i])),
          hoverBackgroundColor: data.values.map((x, i) => palitra([i], 'light')),
          borderWidth: 1,
        },
      ],
    };
    return chartData;
  }

  render() {
    const { width, height, data } = this.props;
    if (!data || !data.values) {
      return null;
    }
    return (
      <Doughnut
        data={this.prepareData()}
        options={this.getOptions()}
        width={width}
        height={height}
      />
    );
  }
}
