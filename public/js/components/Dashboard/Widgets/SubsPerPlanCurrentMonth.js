import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DoughnutChart } from '../../Charts';
import { getData } from '../../../actions/dashboardActions';
import PlaceHolderWidget from '../Widgets/PlaceHolder';
import { drawDataOnPie, isEmptyData } from '../Widgets/helper';


class SubsPerPlanCurrentMonth extends Component {

  static defaultProps = {
    width: 545,
    height: 400,
  };

  static propTypes = {
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    getData: React.PropTypes.func.isRequired,
    toDate: React.PropTypes.instanceOf(Date).isRequired,
    chartData: React.PropTypes.array, // eslint-disable-line react/forbid-prop-types
  };

  state = {
    width: this.props.width,
    height: this.props.height,
  }

  componentDidMount() {
    this.props.getData('subsPerPlanCurrentMonth', this.prepereAgrigateQuery());
  }

  prepereAgrigateQuery() {
    const { toDate } = this.props;
    const query = [{
      $match: { type: 'subscriber', plan: { $exists: true }, creation_time: { $exists: true } },
    }, {
      $group: { _id: '$sid', plan: { $last: '$plan' }, creation_time: { $last: '$creation_time' }, type: { $last: '$type' } },
    }, {
      $project: { year: { $year: '$creation_time' }, month: { $month: '$creation_time' }, type: 1, plan: 1 },
    }, {
      $match: { year: toDate.getUTCFullYear(), month: toDate.getUTCMonth() + 1 },
    }, {
      $group: { _id: '$plan', count: { $sum: 1 } },
    }, {
      $project: { name: '$_id', count: 1, _id: 0 },
    }];

    return {
      name: 'subsPerPlan',
      api: 'aggregate',
      params: [
        { collection: 'subscribers' },
        { pipelines: JSON.stringify(query) },
      ],
    };
  }

  prepareChartData() {
    const { chartData, toDate } = this.props;
    const formatedData = {
      // title: getMonthName(toDate.getUTCMonth()+1) + ", " + '01 to ' + ("0" + toDate.getUTCDate()).slice(-2),
      labels: [],
      values: [],
    };

    if (isEmptyData(chartData)) {
      return null;
    }

    chartData.forEach((dataset) => {
      dataset.data.forEach((node) => {
        formatedData.labels.push(node.name);
        formatedData.values.push(node.count);
      });
    });
    return formatedData;
  }

  overrideChartOptions() { // eslint-disable-line class-methods-use-this
    return {
      tooltips: {
        enabled: false,
      },
      legend: {
        onClick: null,
        position: 'right',
      },
      animation: {
        onProgress: drawDataOnPie,
      },
      cutoutPercentage: 20,
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
        return (<DoughnutChart width={width} height={height} data={data} options={options} />);
      }
    }
  }

  render() {
    return (<div className="subsPerPlanCurrentMonth">{this.renderContent()}</div>);
  }
}

const mapStateToProps = state => ({
  chartData: state.dashboard.get('subsPerPlanCurrentMonth'),
});

export default connect(mapStateToProps, { getData })(SubsPerPlanCurrentMonth);
