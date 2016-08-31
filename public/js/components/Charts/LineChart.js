import React from 'react';
import {Line} from 'react-chartjs';
import {palitra, trend} from './helpers';


export default class LineChart extends React.Component {
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
        mode: 'single'
      },
      scales: {
        xAxes: [
          {
            display: true,
            // scaleLabel: {
            //     show: true,
            //     labelString: 'Month'
            // },,,,,,,,,,,
          }
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
            }
          }
        ],
      },
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
        fill: false,
        // hidden: true,
        // borderDash: [5, 5],
        lineTension: 0, //line angel
        borderColor: linesCount == 1 ? trend(direction) : palitra([i]),
        backgroundColor: linesCount == 1 ? trend(direction) : palitra([i]),
        pointBackgroundColor: linesCount == 1 ? trend(direction) : palitra([i]),
        pointBorderColor:linesCount == 1 ? trend(direction) : palitra([i]),
        pointHoverBorderColor: linesCount == 1 ? trend(direction, 'dark') : palitra([i], 'dark'),
        pointHoverBackgroundColor: 'white'
      }
    });
    return chartData;
  }

  render() {
    const {width, height, data, options} = this.props;
    if (!data || !data.x || !data.y) return null;
    return (<Line data={this.prepareData(data)} options={this.getOptions(data, options)} width={width} height={height}/>);
  }
}
