import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { LineChart } from '../../Charts';
import { getData } from '../../../actions/dashboardActions';
import PlaceHolderWidget from '../Widgets/PlaceHolder';
import { getMonthName, getYearsToDisplay, isEmptyData, isPointDate } from '../Widgets/helper';


class ChurningSubscribers extends Component {

  static defaultProps = {
    width: 350,
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
    this.props.getData('churningSubscribers', this.prepereAgrigateQuery());
  }

  prepereAgrigateQuery() {
    const { fromDate, toDate } = this.props;
    const churningSubscribersQuery = [{
      $match: { type: 'subscriber', to: { $lte: toDate, $gte: fromDate } },
    }, {
      $group: { _id: '$sid', to: { $last: '$to' } },
    }, {
      $group: { _id: { year: { $year: '$to' }, month: { $month: '$to' } }, count: { $sum: 1 } },
    }, {
      $project: { year: '$_id.year', month: '$_id.month', _id: 0, count: '$count' },
    }, {
      $sort: { year: 1, month: 1 },
    }];

    return {
      name: 'churning_subscribers',
      api: 'aggregate',
      params: [
        { collection: 'subscribers' },
        { pipelines: JSON.stringify(churningSubscribersQuery) },
      ],
    };
  }

  prepareChartData() {
    const { chartData, fromDate, toDate } = this.props;
    const yearsToDisplay = getYearsToDisplay(fromDate, toDate);
    const multipleYears = Object.keys(yearsToDisplay).length > 1;
    const formatedData = {
      // title: 'Churning Subscribers',
      x: [{ label: 'Subsctibers', values: [] }],
      y: [],
    };

    const dataset = chartData.find(set => set.name === 'churning_subscribers');
    if (isEmptyData(dataset)) {
      return null;
    }
    Object.keys(yearsToDisplay).forEach((year) => {
      yearsToDisplay[year].forEach((month) => {
        const point = dataset.data.find(node => isPointDate({ year, month }, node));
        const data = (point) ? point.count : 0;
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
    return {
      legend: {
        display: false,
      },
      scales: {
        yAxes: [
          {
            display: true,
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
    };
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
        return (<LineChart width={width} height={height} data={data} options={options} />);
      }
    }
  }

  render() {
    return (<div className="churningSubscribers">{this.renderContent()}</div>);
  }
}

const mapStateToProps = state => ({
  chartData: state.dashboard.get('churningSubscribers'),
});

export default connect(mapStateToProps, { getData })(ChurningSubscribers);
