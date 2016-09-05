import React from 'react';
import {Bar} from 'react-chartjs';
import {palitra, hexToRgba, trend} from './helpers';


export default class BarChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getOptions(data, options = {}) {
    let defaultOptions = {
      responsive: true,
      title: {
        display: (typeof data.title !== 'undefined'),
        text: data.title
      },
      legend: {
        position: 'bottom'
      },
      hover: {
        mode: 'single'
      },
      tooltips: {
        mode: 'single'
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero:true
          }
        }]
      }
    };
    return Object.assign(defaultOptions, options);
  }

  prepareData(data) {
    let linesCount = data.x.length;
    let chartData = {};
    chartData.labels = data.y || Array.from(new Array(data.x[0].values.length), (x, i) => i + 1);
    chartData.datasets = data.x.map((x, i) => {
      let direction = x.values[x.values.length-1] - x.values[0];
      return {
        label: x.label,
        data: x.values,
        borderWidth: 1,
        backgroundColor: hexToRgba(( (linesCount == 1) ? trend(direction) : palitra([i]) ), 1),
        borderColor:  hexToRgba(( (linesCount == 1) ? trend(direction) : palitra([i]) ), 1),
        hoverBorderWidth: 1,
        hoverBackgroundColor: linesCount == 1 ? trend(direction) : palitra([i], 'light'),
        hoverBorderColor: linesCount == 1 ? trend(direction) : palitra([i], 'dark'),
      }
    });
    return chartData;
  }

  render() {
    const {width, height, data, options} = this.props;
    if (!data || !data.x) return null;
    return (<Bar data={this.prepareData(data)} options={this.getOptions(data, options)} width={width} height={height}/>);
  }
}
