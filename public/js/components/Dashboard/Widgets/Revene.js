import React, { Component } from 'react';
import { connect } from 'react-redux';
import { LineAreaChart } from '../../Charts';
import { getData } from '../../../actions/dashboardActions';
import PlaceHolderWidget from '../Widgets/PlaceHolder';
import { getMonthName, getYearsToDisplay, chartOptionCurrencyAxesLabel, chartOptionCurrencyTooltipLabel, isEmptyData, isPointDate } from '../Widgets/helper';


class Revene extends Component {

  static defaultProps = {
    width: 545,
    height: 400,
  };

  static propTypes = {
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    getData: React.PropTypes.func.isRequired,
    fromDate: React.PropTypes.instanceOf(Date).isRequired,
    toDate: React.PropTypes.instanceOf(Date).isRequired,
    chartData: React.PropTypes.array, // eslint-disable-line react/forbid-prop-types
  };

  state = {
    width: this.props.width,
    height: this.props.height,
  }

  componentDidMount() {
    this.props.getData('revene', this.prepereAgrigateQuery());
  }

  prepereAgrigateQuery() {
    const { fromDate, toDate } = this.props;
    const revenueQuery = [{
      $match: { confirmation_time: { $gte: fromDate, $lte: toDate }, type: 'rec' },
    }, {
      $group: { _id: '$aid', date: { $first: '$confirmation_time' }, due: { $sum: '$due' } },
    }, {
      $group: { _id: { year: { $year: '$date' }, month: { $month: '$date' } }, due: { $sum: '$due' } },
    }, {
      $project: { year: '$_id.year', month: '$_id.month', _id: 0, due: '$due' },
    }, {
      $sort: { year: 1, month: 1 },
    }];

    return {
      name: 'revenue',
      api: 'aggregate',
      params: [
        { collection: 'bills' },
        { pipelines: JSON.stringify(revenueQuery) },
      ],
    };
  }

  prepareChartData() {
    const { chartData, fromDate, toDate } = this.props;
    const yearsToDisplay = getYearsToDisplay(fromDate, toDate);
    const multipleYears = Object.keys(yearsToDisplay).length > 1;
    const formatedData = {
      // title: 'Revenue',
      x: [{ label: 'Revenue', values: [] }],
      y: [],
    };
    const dataset = chartData.find(set => set.name === 'revenue');

    if (isEmptyData(dataset)) {
      return null;
    }
    Object.keys(yearsToDisplay).forEach((year) => {
      yearsToDisplay[year].forEach((month) => {
        const point = dataset.data.find(node => isPointDate({ year, month }, node));
        const data = (point) ? point.due : 0;
        formatedData.x[0].values.push(data);
        let label = getMonthName(month);
        if (multipleYears) {
          label += `, ${year}`;
        }
        formatedData.y.push(label);
      });
    });
    return formatedData;
  }

  overrideChartOptions() { // eslint-disable-line class-methods-use-this
    const owerideOptions = {
      legend: {
        display: false,
      },
      tooltips: {
        enabled: true,
        mode: 'single',
        callbacks: {
          title: (tooltipItem, data) => null, // eslint-disable-line no-unused-vars
          label: chartOptionCurrencyTooltipLabel,
        },
      },
      scales: {
        yAxes: [
          {
            display: true,
            ticks: {
              beginAtZero: false,
              callback: chartOptionCurrencyAxesLabel,
            },
          },
        ],
      },
    };
    return owerideOptions;
  }

  renderContent() {
    const { height, width } = this.state;
    switch (this.props.chartData) {
      case undefined:
        return (<PlaceHolderWidget />);
      case null:
        return null;
      default: {
        const data = this.prepareChartData();
        const options = this.overrideChartOptions();
        return (<LineAreaChart data={data} options={options} height={height} width={width} />);
      }
    }
  }

  render() {
    return (<div className="Revene">{this.renderContent()}</div>);
  }
}

const mapStateToProps = state => ({
  chartData: state.dashboard.get('revene'),
});

export default connect(mapStateToProps, { getData })(Revene);
