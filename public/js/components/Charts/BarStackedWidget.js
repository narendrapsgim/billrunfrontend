import React from 'react';
import {Bar} from 'react-chartjs';
import {palitra} from './helpers';


export default class BarStackedWidget extends React.Component {
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
        mode: 'label'
      },
      tooltips: {
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
        ]
      }
    };
    return Object.assign(defaultOptions, options);
  }

  prepareData(data) {
    let chartData = {};
    chartData.labels = data.y || Array.from(new Array(data.x[0].values.length), (x, i) => i + 1);
    chartData.datasets = data.x.map((x, i) => ({
      label: x.label,
      data: x.values,
      borderWidth: 1,
      backgroundColor: palitra([i]),
      borderColor: palitra([i]),
      hoverBorderWidth: 1,
      hoverBackgroundColor: palitra([i], 'light'),
      hoverBorderColor: palitra([i], 'dark'),
    }));
    return chartData;
  }

  render() {
    const {width, height, data, options} = this.props;
    return (<Bar data={this.prepareData(data)} options={this.getOptions(data, options)} width={width} height={height}/>);
  }
}
