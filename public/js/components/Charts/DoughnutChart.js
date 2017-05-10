import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable'
import { Doughnut } from 'react-chartjs-2';
import { palitra } from './helpers';


export default class DoughnutChart extends Component {

  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    selectedRadiusMargin: PropTypes.number,
    selectable: PropTypes.bool,
    message: PropTypes.string,
    data: PropTypes.oneOfType([
      PropTypes.instanceOf(Immutable.Map),
      null,
    ]),
    options: PropTypes.object,
    onClick: PropTypes.func,
  };

  static defaultProps = {
    options: {},
    data: Immutable.Map(),
    selectedRadiusMargin: 10,
    selectable: true,
    message: '',
    onClick: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      options: this.options,
      selectedIndex: null,
      height: 0,
    };
  }

  componentDidMount() {
    // Charts are responsive, height should be updated only after first render
    this.setState({
      height: this.refs.chartRef.chart_instance.chart.height,
    });
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
      cutoutPercentage: 50,
      layout: {
        padding: 20,
      },
      onResize: this.onChartResize,
    },
    options
    );
  }

  onChartResize = (chart, size) => {
    this.setState({
      height: size.height,
    });
  }

  prepareData = (canvas) => { // eslint-disable-line no-unused-vars
    const { data } = this.props;
    const chartData = {
      labels: data.get('labels', Immutable.List()).toArray(),
      datasets: [
        {
          data: data.get('values', Immutable.List()).toArray(),
          backgroundColor: data.get('values', Immutable.List()).map((x, i) => palitra(i)).toArray(),
          hoverBackgroundColor: data.get('values', Immutable.List()).map((x, i) => palitra(i, 'light')).toArray(),
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
      const clickedIndex = elems[0]._index; // eslint-disable-line  no-underscore-dangle
      const chartRef = this.refs.chartRef.chart_instance;
      // reset
      chartRef.update();
      if (clickedIndex !== selectedIndex) {
        const newRatio = 1 + (selectedRadiusMargin / 100);
        elems[0]._model.outerRadius = chartRef.outerRadius * newRatio;
        elems[0]._model.innerRadius = chartRef.innerRadius * newRatio;
      }
      chartRef.render(500, false);
      this.setState({
        selectedIndex: (clickedIndex === selectedIndex) ? null : clickedIndex,
      });
      this.props.onClick(clickedIndex);
    }
  }

  renderMessage = () => {
    const { message } = this.props;
    const { height } = this.state;
    if (!message || message === '') {
      return null;
    }
    const fontSize = (height / 150).toFixed(2);
    return (
      <p className="doughnut-message" style={{ fontSize: `${fontSize}em` }}>
        {message}
      </p>
    );
  }

  render() {
    const { width, height } = this.props;
    const { options } = this.state;
    return (
      <div className="doughnut-wrapper">
        { this.renderMessage() }
        <Doughnut
          ref="chartRef"
          data={this.prepareData}
          options={options}
          width={width}
          height={height}
          onElementsClick={this.onElementsClick}
        />
      </div>
    );
  }
}
