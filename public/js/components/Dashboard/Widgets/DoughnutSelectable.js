import React, { Component, PropTypes } from 'react';
import { DoughnutChart } from '../../Charts';
import { palitra } from '../../Charts/helpers';
import WidgetsHOC from './WidgetsHOC';

class DoughnutSelectable extends Component {

  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    data: PropTypes.object,
    type: PropTypes.string,
    parseValue: PropTypes.func,
    parseLabel: PropTypes.func,
    parsePercent: PropTypes.func,
  };

  static defaultProps = {
    width: 100,
    height: 70,
    data: {
      labels: [],
      values: [],
    },
    type: 'legend',
    parseValue: value => value,
    parseLabel: label => label,
    parsePercent: percent => percent,
  };

  state = {
    selectedIndex: null,
  }

  getOptions = () => ({
    tooltips: {
      enabled: true,
      displayColors: false,
      callbacks: {
        label: (tooltipItem, data) => {
          const label = data.labels[tooltipItem.index] || '';
          return this.props.parseLabel(label);
        },
      },
    },
    legend: {
      display: false,
    },
  })

  onClick = (index) => {
    const { selectedIndex } = this.state;
    if (!isNaN(index)) {
      this.setState({
        selectedIndex: (selectedIndex === index) ? null : index,
      });
    }
  }

  calcSelectedItemPercentage = () => {
    const { data } = this.props;
    const { selectedIndex } = this.state;
    if (selectedIndex !== null) {
      const sum = data.values.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
      return data.values[selectedIndex] / sum;
    }
    return '';
  }

  renderLegend = () => {
    const { data } = this.props;
    const { selectedIndex } = this.state;
    const width = 100 / data.labels.length;
    return data.labels.map((label, idx) => (
      <div key={idx} className="inline" style={{ width: `${width}%`, textAlign: 'center', color: palitra(idx), fontWeight: (idx === selectedIndex) ? 'bold' : 'normal' }}>
        <p className="mb0">{ this.props.parseValue(data.values[idx]) }</p>
        <p>{ this.props.parseLabel(label)}</p>
      </div>
    ));
  }

  renderDetails = (percentage) => {
    const { data } = this.props;
    const { selectedIndex } = this.state;

    if (selectedIndex === null) {
      return (
        <div style={{ minHeight: 72.5 }}>
          <ul className="mb0">
            { data.labels.map((label, idx) =>
              <li key={idx} className="mb0" style={{ color: palitra(idx), lineHeight: '17px' }}>
                { this.props.parseLabel(label) }
              </li>
            )}
          </ul>
        </div>
      );
    }
    return (
      <div>
        <div>
          <h4 className="pull-left" style={{ color: '#7C7C7C' }}>
            {`${this.props.parsePercent(percentage)} | ${this.props.parseValue(data.values[selectedIndex])}`}
          </h4>
          { (data.sign && data.sign[selectedIndex] !== 0) &&
            <p className="pull-right">
              { (data.sign[selectedIndex] > 0)
                ? <i className="fa fa-caret-up fa-3x" style={{ height: 30, color: 'green' }} />
                : <i className="fa fa-caret-down fa-3x" style={{ height: 30, color: 'red' }} />
              }
            </p>
          }
        </div>
        <div className="clearfix" />
        <div>
          <p style={{ color: palitra(selectedIndex) }}>
            { this.props.parseLabel(data.labels[selectedIndex]) }
          </p>
        </div>
      </div>
    );
  }

  render() {
    const { width, height, data, type } = this.props;
    const options = this.getOptions();
    const percentage = this.calcSelectedItemPercentage();
    const message = (type === 'legend' && percentage !== '') ? this.props.parsePercent(percentage) : '';

    return (
      <div>
        <DoughnutChart
          width={width}
          height={height}
          data={data}
          options={options}
          onClick={this.onClick}
          message={message}
        />
        { type === 'legend' && this.renderLegend() }
        { type === 'details' && this.renderDetails(percentage) }
      </div>
    );
  }
}


export default WidgetsHOC(DoughnutSelectable);
