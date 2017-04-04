import React, { Component, PropTypes } from 'react';
import { Line } from 'react-chartjs-2';
import { palitra, trend } from './helpers';


export default class LineChart extends Component {

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
      tooltips: {
        mode: 'single',
        callbacks: {
          // beforeTitle: function() {
          //     return '...beforeTitle';
          // },
          // afterTitle: function() {
          //     return '...afterTitle';
          // },
          // beforeBody: function() {
          //     return '...beforeBody';
          // },
          // afterBody: function() {
          //     return '...afterBody';
          // },
          // beforeFooter: function() {
          //     return '...beforeFooter';
          // },
          // footer: function() {
          //     return 'Footer';
          // },
          // afterFooter: function() {
          //     return '...afterFooter';
          // },
        },
      },
      hover: {
        mode: 'single',
      },
      scales: {
        xAxes: [
          {
            display: true,
            // scaleLabel: {
            //     show: true,
            //     labelString: 'Month'
            // },,,,,,,,,,,
          },
        ],
        yAxes: [
          {
            display: true,
            // scaleLabel: {
            //     show: true,
            //     labelString: 'Value'
            // },
            ticks: {
              beginAtZero: false,
            // suggestedMin: -10,
            // suggestedMax: 250,
            },
          },
        ],
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
        fill: false,
        // hidden: true,
        // borderDash: [5, 5],
        lineTension: 0, // line angel
        borderColor: linesCount === 1 ? trend(direction) : palitra(i),
        backgroundColor: linesCount === 1 ? trend(direction) : palitra(i),
        pointBackgroundColor: linesCount === 1 ? trend(direction) : palitra(i),
        pointBorderColor: linesCount === 1 ? trend(direction) : palitra(i),
        pointHoverBorderColor: linesCount === 1 ? trend(direction, 'dark') : palitra(i, 'dark'),
        pointHoverBackgroundColor: 'white',
      };
    });
    return chartData;
  }

  render() {
    const { width, height, data } = this.props;
    if (!data || !data.x || !data.y) return null;
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
