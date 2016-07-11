import React from 'react';
import {Line} from 'react-chartjs';
import {palitra, hexToRgba, trend} from './helpers';


export default class LineAreaWidget extends React.Component {
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
        display: (data.x.length > 1),
        position: 'bottom',
      },
      tooltips: {
        mode: 'single'
      },
      hover: {
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
        lineTension:0.2,
        fill: true,
        borderWidth: 1,
        borderColor: linesCount == 1 ? trend(direction) : palitra([i]),//palitra([i]),
        backgroundColor: hexToRgba(( (linesCount == 1) ? trend(direction) : palitra([i], 'light') ), 0.5),
        pointBackgroundColor: 'white',
        pointBorderColor: (linesCount == 1) ? trend(direction) : palitra([i]),
        pointHoverBorderColor: 'white',
        pointHoverBackgroundColor: (linesCount == 1) ? trend(direction) : palitra([i], 'dark'),
      }
    });
    return chartData;
  }

  render() {
    const {width, height, data, options} = this.props;
    return (<Line data={this.prepareData(data)} options={this.getOptions(data, options)} width={width} height={height}/>);
  }
}
