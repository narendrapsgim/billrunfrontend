import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import { Line } from 'react-chartjs-2';
import { palitra, trend } from './helpers';


export default class LineChart extends Component {

  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    data: PropTypes.instanceOf(Immutable.Map),
    options: PropTypes.object,
  };

  static defaultProps = {
    options: {},
    data: Immutable.Map(),
  };

  getOptions = () => {
    const { data, options } = this.props;
    const defaultOptions = {
      responsive: true,
      title: {
        display: (data.get('title', null) !== null),
        text: data.get('title', ''),
      },
      legend: {
        display: (data.get('x', Immutable.List()).size > 1),
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
    const linesCount = data.get('x', Immutable.List()).size;
    const valuesCount = data.getIn(['x', 0, 'values'], Immutable.List()).size;
    const labels = data.get('y', Immutable.List(Array.from(new Array(valuesCount), (x, i) => i + 1)));
    return {
      labels: labels.toArray(),
      datasets: data.get('x', Immutable.List()).map((dataset, i) => {
        const direction = dataset.get('values', Immutable.List()).last() - dataset.get('values', Immutable.List()).first();
        return {
          label: dataset.get('label', ''),
          data: dataset.get('values', Immutable.List()).toArray(),
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
      }).toArray(),
    };
  }

  render() {
    const { width, height } = this.props;
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
