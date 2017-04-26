import React, { Component, PropTypes } from 'react';
import { Bubble } from 'react-chartjs-2';
import { palitra } from './helpers';


export default class BubbleChart extends Component {

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
        boxWidth: 20,
      },
    };
    return Object.assign(defaultOptions, options);
  }

  prepareData = () => {
    const { data } = this.props;
    const chartData = {
      labels: data.labels,
      datasets: data.x.map((x, i) => ({
        label: (typeof data.labels !== 'undefined')
          ? data.labels[i]
          : '',
        data: [
          {
            x: data.x[i],
            y: data.y[i],
            r: data.z[i],
          },
        ],
        backgroundColor: palitra(i),
        hoverBackgroundColor: palitra(i, 'light'),
      })),
    };
    return chartData;
  }

  render() {
    const { width, height, data } = this.props;
    if (!data || !data.x || !data.y || !data.z) {
      return null;
    }
    return (
      <Bubble
        data={this.prepareData()}
        options={this.getOptions()}
        width={width}
        height={height}
      />
    );
  }
}
