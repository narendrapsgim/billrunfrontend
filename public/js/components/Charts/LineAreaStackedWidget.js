import React from 'react';
import {Line} from 'react-chartjs';
import {palitra, hexToRgba} from './helpers';


export default class LineAreaStackedWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getOptions(data, options = {}) {
    let defaultOptions = {
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
        mode: 'label'
      },
      hover: {
        mode: 'label'
      },
      scales: {
        xAxes: [
          {
            stacked: true
          }
        ],
        yAxes: [
          {
            stacked: true
          }
        ],
      },
    };
    return Object.assign(defaultOptions, options);
  }

  prepareData(data) {
    let chartData = {};
    chartData.labels = data.y || Array.from(new Array(data.x[0].values.length), (x, i) => i + 1);
    chartData.datasets = data.x.map((x, i) => ({
      label: x.label,
      data: x.values,
      fill: true,
      lineTension:0.2,
      borderWidth: 1,
      borderColor: palitra([i]),
      backgroundColor: hexToRgba((palitra([i])), 1),
      pointBackgroundColor: 'white',
      pointBorderColor: palitra([i]),
      pointHoverBorderColor: 'white',
      pointHoverBackgroundColor: palitra([i], 'dark')
    }));
    return chartData;
  }

  render() {
    const {width, height, data, options} = this.props;
    return (<Line data={this.prepareData(data)} options={this.getOptions(data, options)} width={width} height={height}/>);
  }
}
