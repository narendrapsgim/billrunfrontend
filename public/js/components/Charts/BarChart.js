import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import { Bar } from 'react-chartjs-2';
import { palitra, trend } from './helpers';

export default class BarChart extends Component {

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
          borderWidth: 1,
          backgroundColor: ((linesCount === 1) ? trend(direction) : palitra(i)),
          borderColor: ((linesCount === 1) ? trend(direction) : palitra(i)),
          hoverBorderWidth: 1,
          hoverBackgroundColor: linesCount === 1 ? trend(direction) : palitra(i, 'light'),
          hoverBorderColor: linesCount === 1 ? trend(direction) : palitra(i, 'dark'),
        };
      }).toArray(),
    };
  }

  render() {
    const { width, height } = this.props;
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
