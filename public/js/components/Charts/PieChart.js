import React, { Component, PropTypes } from 'react';
import { Pie } from 'react-chartjs-2';
import { palitra } from './helpers';


export default class PieChart extends Component {

  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    data: PropTypes.oneOfType([
      PropTypes.object,
      null,
    ]),
    options: PropTypes.object,
    selectable: PropTypes.bool,
    onClick: PropTypes.func,
  };

  static defaultProps = {
    options: {},
    data: null,
    selectable: true,
    onClick: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: null,
    };
  }

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
    const { selectedIndex } = this.state;
    const { data } = this.props;
    const chartData = {
      labels: data.labels,
      datasets: [
        {
          data: data.values,
          backgroundColor: data.values.map((x, i) => (
            selectedIndex === i
              ? palitra(i, 'dark')
              : palitra(i)
          )),
          borderColor: data.values.map((x, i) => (
            selectedIndex === i
              ? '#000'
              : '#fff'
          )),
          borderWidth: data.values.map((x, i) => (selectedIndex === i ? 1 : 1)),
          hoverBackgroundColor: data.values.map((x, i) => (
            selectedIndex === i
              ? palitra(i, 'dark')
              : palitra(i, 'light')
          )),
          hoverBorderColor: data.values.map((x, i) => (selectedIndex === i
            ? '#000'
            : palitra(i, 'light')
          )),
          hoverBorderWidth: data.values.map((x, i) => (selectedIndex === i ? 1 : 1)),
        },
      ],
    };
    return chartData;
  }

  onElementsClick = (elems) => {
    const { selectedIndex } = this.state;
    const { selectable } = this.props;
    if (selectable && elems.length > 0) {
      const clickedIndex = elems[0]._index; // eslint-disable-line  no-underscore-dangle
      this.setState({
        selectedIndex: (clickedIndex === selectedIndex) ? null : clickedIndex,
      });
      this.props.onClick(clickedIndex);
    }
  }

  render() {
    const { width, height, data } = this.props;
    if (!data || !data.values) {
      return null;
    }
    return (
      <Pie
        data={this.prepareData()}
        options={this.getOptions()}
        width={width}
        height={height}
        onElementsClick={this.onElementsClick}
      />
    );
  }
}
