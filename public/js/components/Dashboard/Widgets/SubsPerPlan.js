import React, { Component } from 'react';
import { connect } from 'react-redux';
import { PieChart } from '../../Charts';
import { getData } from '../../../actions/dashboardActions';
import PlaceHolderWidget from '../Widgets/PlaceHolder';
import { drawDataOnPie, isEmptyData } from '../Widgets/helper';


class SubsPerPlan extends Component {

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
    this.props.getData('subsPerPlan', this.prepereAgrigateQuery());
  }

  prepereAgrigateQuery() {
    const { fromDate, toDate } = this.props;
    const query = [{
      $match: { type: 'subscriber', plan: { $exists: true }, creation_time: { $gte: fromDate }, to: { $gte: toDate } },
    }, {
      $group: { _id: '$sid', plan: { $last: '$plan' } },
    }, {
      $group: { _id: '$plan', count: { $sum: 1 } },
    }, {
      $project: { name: '$_id', count: 1, _id: 0 },
    }, {
      $sort: { count: -1 },
    }];

    return {
      name: 'subs_per_plan',
      api: 'aggregate',
      params: [
        { collection: 'subscribers' },
        { pipelines: JSON.stringify(query) },
      ],
    };
  }

  prepareChartData() {
    const { chartData } = this.props;
    const formatedData = {
      // title: 'Subscribers per Plan',
      labels: [],
      values: [],
    };

    if (isEmptyData(chartData[0])) {
      return null;
    }

    chartData[0].data.forEach((node) => {
      formatedData.labels.push(node.name);
      formatedData.values.push(node.count);
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
        return <PieChart width={width} height={height} data={data} options={options} />;
      }
    }
  }

  render() {
    return (<div className="subsPerPlan">{this.renderContent()}</div>);
  }
}

const mapStateToProps = state => ({
  chartData: state.dashboard.get('subsPerPlan'),
});

export default connect(mapStateToProps, { getData })(SubsPerPlan);
