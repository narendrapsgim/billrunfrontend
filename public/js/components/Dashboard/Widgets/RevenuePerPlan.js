import React, { Component } from 'react';
import { connect } from 'react-redux';
import { PieChart } from '../../Charts';
import { getData } from '../../../actions/dashboardActions';
import PlaceHolderWidget from '../Widgets/PlaceHolder';
import { drawDataOnPie, isEmptyData } from '../Widgets/helper';


class RevenuePerPlan extends Component {

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
    this.props.getData('revenuePerPlan', this.prepereAgrigateQuery());
  }

  prepereAgrigateQuery() {
    const { fromDate, toDate } = this.props;
    const query = [{
      $match: { type: 'flat', plan: { $exists: true }, urt: { $gte: fromDate, $lte: toDate } },
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
    const { chartData } = this.props;
    const formatedData = {
      // title: 'Revenue per Plan',
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
        return <PieChart width={width} height={height} data={data} options={options} />;
      }
    }
  }

  render() {
    return (<div className="revenuePerPlan">{this.renderContent()}</div>);
  }
}

const mapStateToProps = state => ({
  chartData: state.dashboard.get('revenuePerPlan'),
});

export default connect(mapStateToProps, { getData })(RevenuePerPlan);
