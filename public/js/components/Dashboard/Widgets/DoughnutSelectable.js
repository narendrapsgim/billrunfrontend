import React, { Component, PropTypes } from 'react';
import { DoughnutChart } from '../../Charts';
import { palitra } from '../../Charts/helpers';


class DoughnutSelectable extends Component {

  static defaultProps = {
    width: 100,
    height: 100,
    data: {
      labels: [],
      values: [],
    },
    type: 'legend',
  };

  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    data: PropTypes.object,
    type: PropTypes.string,
  };

  state = {
    selectedIndex: null,
  }

  getOptions() { // eslint-disable-line class-methods-use-this
    const owerideOptions = {
      tooltips: {
        enabled: false,
      },
      legend: {
        display: false,
      },
    };
    return owerideOptions;
  }

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
      return data.values.reduce((accumulator, currentValue, idx, array) => {
        const sum = accumulator + currentValue;
        if (array.length - 1 === idx) {
          return array[selectedIndex] / sum;
        }
        return sum;
      }, 0);
    }
    return '';
  }

  renderLegend = () => {
    const { data } = this.props;
    const { selectedIndex } = this.state;
    const width = 100 / data.labels.length;
    return data.labels.map((label, idx) => (
      <div className="inline" style={{ width: `${width}%`, textAlign: 'center', color: palitra(idx), fontWeight: (idx === selectedIndex) ? 'bold' : 'normal' }}>
        <p>{data.values[idx]}</p>
        <p>{label}</p>
      </div>
    ));
  }

  renderDetails = (percentage) => {
    const { data } = this.props;
    const { selectedIndex } = this.state;
    return (
      <div>
        <div>
          <h4 className="pull-left" style={{ color: '#7C7C7C' }}>
            { selectedIndex !== null
              ? (
                <span>
                  {this.convertToPercentageString(percentage)} | {data.values[selectedIndex]}
                </span>
              )
              : <span>&nbsp;</span>
            }
          </h4>
          { (selectedIndex !== null && data.sign && data.sign[selectedIndex] !== 0) &&
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
          <p className="mb0" style={{ color: (selectedIndex !== null) ? palitra(selectedIndex) : '#000' }}>
            { (selectedIndex !== null)
              ? data.labels[selectedIndex]
              : <span>&nbsp;</span>
            }
          </p>
        </div>
      </div>
    );
  }

  convertToPercentageString = percentage => `${parseFloat((percentage * 100).toFixed(1))}%`

  render() {
    const { width, height, data, type } = this.props;
    const options = this.getOptions();
    const percentage = this.calcSelectedItemPercentage();
    const message = (type === 'legend' && percentage !== '') ? this.convertToPercentageString(percentage) : '';

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


export default DoughnutSelectable;
