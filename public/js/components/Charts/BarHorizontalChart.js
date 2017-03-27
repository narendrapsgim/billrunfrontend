import React from 'react';
import {HorizontalBar} from 'react-chartjs-2';
import {palitra} from './helpers';


export default class BarHorizontalChart extends React.Component {
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
      elements: {
        rectangle: {
          borderWidth: 2,
          borderColor: 'rgb(0, 255, 0)',
          borderSkipped: 'left'
        }
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
    if (!data || !data.x) return null;
    return (<HorizontalBar data={this.prepareData(data)} options={this.getOptions(data, options)} type={'horizontalBar'} width={width} height={height}/>);
  }
}
