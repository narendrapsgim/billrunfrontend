import React, { Component, PropTypes } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { palitra } from './helpers';


export default class DoughnutChart extends Component {

  static propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    selectedRadiusMargin: PropTypes.number,
    selectable: PropTypes.bool,
    data: PropTypes.oneOfType([
      PropTypes.object,
      null,
    ]),
    options: PropTypes.object,
    onClick: PropTypes.func,
  };

  static defaultProps = {
    options: {},
    data: null,
    selectedRadiusMargin: 10,
    selectable: true,
    onClick: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      options: this.options,
      selectedIndex: null,
    };
  }

  get options() {
    const { options } = this.props;
    return Object.assign({}, {
      responsive: true,
      title: {
        display: false,
      },
      legend: {
        display: false,
      },
      cutoutPercentage: 40,
      layout: {
        padding: 40,
      },
    },
    options
    );
  }

  prepareData = () => {
    const { data } = this.props;
    const chartData = {
      labels: data.labels,
      datasets: [
        {
          data: data.values,
          backgroundColor: data.values.map((x, i) => palitra([i])),
          hoverBackgroundColor: data.values.map((x, i) => palitra([i], 'light')),
          borderWidth: 1,
        },
      ],
    };
    return chartData;
  }

  onElementsClick = (elems) => {
    const { selectedIndex } = this.state;
    const { selectedRadiusMargin, selectable } = this.props;
    if (selectable && elems.length > 0) {
      const clickedIndex = elems[0]._index;
      const chartRef = this.refs.chartRef.chart_instance;
      // reset
      chartRef.update();
      if (clickedIndex !== selectedIndex) {
        elems[0]._model.outerRadius = chartRef.outerRadius + selectedRadiusMargin;
        elems[0]._model.innerRadius = chartRef.innerRadius + selectedRadiusMargin;
      }
      chartRef.render(500, false);
      this.setState({
        selectedIndex: (clickedIndex === selectedIndex) ? null : clickedIndex,
      });
      this.props.onClick(clickedIndex);
    }
  }

  render() {
    const { width, height } = this.props;
    const { options } = this.state;

    return (
      <Doughnut
        ref="chartRef"
        data={this.prepareData()}
        options={options}
        width={width}
        height={height}
        onElementsClick={this.onElementsClick}
      />
    );
  }
}
