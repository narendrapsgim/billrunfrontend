import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DoughnutChart } from '../../Charts';
import { getData } from '../../../actions/dashboardActions';
import PlaceHolderWidget from '../Widgets/PlaceHolder';
import { drawDataOnPie, isEmptyData } from '../Widgets/helper';


class RevenuePerPlanCurrentMonth extends Component {

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
    this.props.getData('revenuePerPlanCurrentMonth', this.prepereAgrigateQuery());
  }

  prepereAgrigateQuery() {
    const { toDate } = this.props;
    const query = [{
      $match: { type: 'flat', plan: { $exists: true } },
    }, {
      $project: { year: { $year: '$urt' }, month: { $month: '$urt' }, aprice: 1, plan: 1 },
    }, {
      $match: { year: toDate.getUTCFullYear(), month: toDate.getUTCMonth() + 1 },
    }, {
      $group: { _id: '$plan', sum: { $sum: '$aprice' } },
    }, {
      $project: { _id: 0, sum: 1, name: '$_id' },
    }];

    return {
      name: 'revenue_per_plan',
      api: 'aggregate',
      params: [
        { collection: 'lines' },
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

    if (isEmptyData(chartData[0])) {
      return null;
    }

    chartData[0].data.forEach((node) => {
      formatedData.labels.push(node.name);
      formatedData.values.push(Math.ceil(node.sum));
    });
    return formatedData;
  }

  overrideChartOptions() { // eslint-disable-line class-methods-use-this
    const owerideOptions = {
      tooltips: {
        enabled: false,
      },
      legend: {
        onClick: null,
        position: 'right',
      },
      // valueSuffix: ` ${globalSetting.currency}`,
      animation: {
        onProgress: drawDataOnPie,
      },
      cutoutPercentage: 20,
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
        return (<DoughnutChart width={width} height={height} data={data} options={options} />);
      }
    }
  }

  render() {
    return (<div className="revenuePerPlanCurrentMonth">{this.renderContent()}</div>);
  }
}

const mapStateToProps = state => ({
  chartData: state.dashboard.get('revenuePerPlanCurrentMonth'),
});

export default connect(mapStateToProps, { getData })(RevenuePerPlanCurrentMonth);
