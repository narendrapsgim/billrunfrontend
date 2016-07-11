import React from 'react';
import {Bubble} from 'react-chartjs';
import {palitra} from './helpers';



export default class BubbleWidget extends React.Component {
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
        boxWidth: 20
      },
    };
    return Object.assign(defaultOptions, options);
  }

  prepareData(data) {
    let chartData = {
      labels: data.labels,
      datasets: data.x.map((x, i) => ({
        label: (typeof data.labels !== 'undefined')
          ? data.labels[i]
          : '',
        data: [
          {
            x: data.x[i],
            y: data.y[i],
            r: data.z[i]
          }
        ],
        backgroundColor: palitra([i]),
        hoverBackgroundColor: palitra([i], 'light')
      }))
    };
    return chartData;
  }

  render() {
    const {width, height, data, options} = this.props;
    return (<Bubble data={this.prepareData(data)} options={this.getOptions(data, options)} width={width} height={height}/>);
  }
}
