import React from 'react';
import {Doughnut} from 'react-chartjs';
import {palitra} from './helpers';


export default class DoughnutWidget extends React.Component {
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
        display: (data.values.length > 1),
        position: 'right',
        boxWidth: 20
      },
    };
    return Object.assign(defaultOptions, options);
  }

  prepareData(data) {
    let chartData = {
      labels: data.labels,
      datasets: [
        {
          data: data.values,
          backgroundColor: data.values.map((x, i) => palitra([i])),
          hoverBackgroundColor: data.values.map((x, i) => palitra([i], 'light')),
          borderWidth: 1
        }
      ]
    };
    return chartData;
  }

  render() {
    const {width, height, data, options} = this.props;
    return (<Doughnut data={this.prepareData(data)} options={this.getOptions(data, options)} width={width} height={height}/>);
  }
}
