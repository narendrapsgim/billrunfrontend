import React from 'react';
import {Pie} from 'react-chartjs';
import {palitra, hexToRgba} from './helpers';


export default class PieChart extends React.Component {
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
        display: (data.values.length > 1),
        position: 'right',
        boxWidth: 20,
      }
    };
    return Object.assign(defaultOptions, options);
  }

  prepareData(data) {
    let chartData = {
      labels: data.labels,
      datasets: [
        {
          data: data.values,
          backgroundColor: data.values.map((x, i) => hexToRgba(palitra([i]),0.8)),
          borderWidth: 1,
          hoverBackgroundColor: data.values.map((x, i) => palitra([i], 'dark')),
          hoverBorderColor: data.values.map((x, i) => palitra([i], 'dark')),
          hoverBorderWidth:	3,
        }
      ],
    };
    return chartData;
  }
  render() {
    const {width, height, data, options} = this.props;
    if (!data || !data.values) return null;
    return (<Pie data={this.prepareData(data)} options={this.getOptions(data, options)} width={width} height={height}/>);
  }
}
