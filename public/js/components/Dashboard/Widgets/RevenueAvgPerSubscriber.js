import React, { Component } from 'react';
import { connect } from 'react-redux';
import { LineAreaChart } from '../../Charts';
import { getData } from '../../../actions/dashboardActions';
import PlaceHolderWidget from '../Widgets/PlaceHolder';
import { getMonthName, getYearsToDisplay, chartOptionCurrencyAxesLabel, chartOptionCurrencyTooltipLabel, isEmptyData, isPointDate } from '../Widgets/helper';


class RevenueAvgPerSubscriber extends Component {

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
    this.props.getData('revenueAvgPerSubscriber', this.prepereAgrigateQuery());
  }

  prepereAgrigateQuery() {
    const { fromDate, toDate } = this.props;
    const AGGREGATE = 'aggregate';

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

    const newSubscribersQuery = [{
      $match: { type: 'subscriber', creation_time: { $gte: fromDate }, to: { $gte: toDate } },
    }, {
      $group: { _id: '$sid', creation_time: { $first: '$creation_time' } },
    }, {
      $group: { _id: { year: { $year: '$creation_time' }, month: { $month: '$creation_time' } }, count: { $sum: 1 } },
    }, {
      $project: { year: '$_id.year', month: '$_id.month', _id: 0, count: '$count' },
    }, {
      $sort: { year: 1, month: 1 },
    }];

    const totalSubscribersQuery = [{
      $match: { to: { $gte: toDate }, creation_time: { $lte: fromDate } },
    }, {
      $sort: { creation_time: 1 },
    }, {
      $group: { _id: '$sid' },
    }, {
      $group: { _id: null, count: { $sum: 1 } },
    }, {
      $project: { count: 1, _id: 0 },
    }];

    return [{
      name: 'revenue',
      api: AGGREGATE,
      params: [
        { collection: 'bills' },
        { pipelines: JSON.stringify(revenueQuery) },
      ],
    }, {
      name: 'new_subscribers',
      api: AGGREGATE,
      params: [
        { collection: 'subscribers' },
        { pipelines: JSON.stringify(newSubscribersQuery) },
      ],
    }, {
      name: 'total_subscribers',
      api: AGGREGATE,
      params: [
        { collection: 'subscribers' },
        { pipelines: JSON.stringify(totalSubscribersQuery) },
      ],
    }];
  }


  prepareChartData() {
    const { chartData, fromDate, toDate } = this.props;
    const yearsToDisplay = getYearsToDisplay(fromDate, toDate);
    const multipleYears = Object.keys(yearsToDisplay).length > 1;
    const formatedData = {
      // title: 'Revenue Avg. per Subscriber',
      x: [{ label: 'Avg. Revenue', values: [] }],
      y: [],
    };
    let total = 0;

    const totalSubscribersDataset = chartData.find(dataset => dataset.name === 'total_subscribers');
    if (!isEmptyData(totalSubscribersDataset)) {
      total = totalSubscribersDataset.data[0].count;
    }

    const newSubscribersDataset = chartData.find(dataset => dataset.name === 'new_subscribers');
    const revenueDataset = chartData.find(dataset => dataset.name === 'revenue');
    if (isEmptyData(revenueDataset) || isEmptyData(newSubscribersDataset)) {
      return null;
    }

    Object.keys(yearsToDisplay).forEach((year) => {
      yearsToDisplay[year].forEach((month) => {
        const revenue = revenueDataset.data.find(node => isPointDate({ year, month }, node));
        const newSubscriber = newSubscribersDataset.data.find(node => isPointDate({ year, month }, node));
        total += (newSubscriber) ? newSubscriber.count : 0;
        const avarage = (revenue) ? Math.round(revenue.due / total) : 0;
        formatedData.x[0].values.push(avarage);
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
        return <LineAreaChart width={width} height={height} data={data} options={options} />;
      }
    }
  }

  render() {
    return (<div className="RevenueAvgPerSubscriber">{this.renderContent()}</div>);
  }
}

const mapStateToProps = state => ({
  chartData: state.dashboard.get('revenueAvgPerSubscriber'),
});

export default connect(mapStateToProps, { getData })(RevenueAvgPerSubscriber);
