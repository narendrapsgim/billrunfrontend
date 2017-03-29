import React, { Component, PropTypes } from 'react';
import { Pie } from 'react-chartjs-2';
import { palitra, hexToRgba } from './helpers';


const addRadiusMargin = 10;
let currentSelectedPieceLabel = '';

export default class PieChart extends Component {

  static propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    data: PropTypes.oneOfType([
      PropTypes.object,
      null,
    ]),
    options: PropTypes.object,
  };

  static defaultProps = {
    options: {},
    data: null,
  };

  getOptions = () => {
    const { data, options } = this.props;
    const defaultOptions = {
      responsive: true,
      title: {
        display: (typeof data.title !== 'undefined'),
        text: data.title,
      },
      legend: {
        display: (data.values && data.values.length > 1),
        position: 'right',
        boxWidth: 20,
      },
      layout: {
        padding: 30,
      },
    };
    return Object.assign(defaultOptions, options);
  }

  prepareData = () => {
    const { data } = this.props;
    const chartData = {
      labels: data.labels,
      datasets: [
        {
          data: data.values,
          backgroundColor: data.values.map((x, i) => hexToRgba(palitra([i]), 0.8)),
          borderWidth: 1,
          hoverBackgroundColor: data.values.map((x, i) => palitra([i], 'dark')),
          hoverBorderColor: data.values.map((x, i) => palitra([i], 'dark')),
          hoverBorderWidth: 3,
        },
      ],
    };
    return chartData;
  }

  onElementsClick = (elems) => {
    const activePoints = elems;
    const myChart = this.refs.mychart.chart_instance;
    const defaultRadiusMyChart = this.refs.mychart.chart_instance.outerRadius;
    if (activePoints.length > 0) {
      // get the internal index of slice in pie chart
      const clickedElementindex = activePoints[0]._index;

      // get specific label by index
      const clickedLabel = myChart.data.labels[clickedElementindex];

      if (currentSelectedPieceLabel.toUpperCase() === '') {
        // no piece selected yet, save piece label
        currentSelectedPieceLabel = clickedLabel.toUpperCase();

        // clear whole pie
        myChart.outerRadius = defaultRadiusMyChart;
        myChart.innerRadius = 0;
        myChart.update();

        // update selected pie
        activePoints[0]._model.outerRadius = defaultRadiusMyChart + addRadiusMargin;
        activePoints[0]._model.innerRadius = addRadiusMargin;
      } else if (clickedLabel.toUpperCase() === currentSelectedPieceLabel.toUpperCase()) {
          // already selected piece clicked, clear the chart
        currentSelectedPieceLabel = '';

          // clear whole pie
        myChart.outerRadius = defaultRadiusMyChart;
        myChart.innerRadius = 0;
        myChart.update();

          // update selected pie
        activePoints[0]._model.outerRadius = defaultRadiusMyChart;
      } else {
          // other piece clicked
        currentSelectedPieceLabel = clickedLabel.toUpperCase();

          // clear whole pie
        myChart.outerRadius = defaultRadiusMyChart;
        myChart.innerRadius = 0;
        myChart.update();

          // update the newly selected piece
        activePoints[0]._model.outerRadius = defaultRadiusMyChart + addRadiusMargin;
        activePoints[0]._model.innerRadius = addRadiusMargin;
      }
      myChart.render(500, false);
    }
  }

  getElementsAtEvent = (elems) => {
    console.log('getElementsAtEvent', elems);
  }

  render() {
    const { width, height, data } = this.props;
    if (!data || !data.values) {
      return null;
    }
    return (
      <Pie
        ref="mychart"
        data={this.prepareData()}
        options={this.getOptions()}
        width={width}
        height={height}
        onElementsClick={this.onElementsClick}
        getElementsAtEvent={this.getElementsAtEvent}
      />
    );
  }
}
