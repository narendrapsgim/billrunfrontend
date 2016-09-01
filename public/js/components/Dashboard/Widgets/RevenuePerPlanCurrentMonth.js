import React, {Component} from 'react';
import {connect} from 'react-redux';
import {DoughnutChart} from '../../Charts';
import {getData} from '../../../actions/dashboardActions';
import PlaceHolderWidget from '../Widgets/PlaceHolder';
import {drawDataOnPie, getMonthName} from '../Widgets/helper';


class RevenuePerPlanCurrentMonth extends Component {

  constructor(props) {
    super(props);
    this.state = {
      width: props.width || 545,
      height: props.height || 400
    }
  }

  componentDidMount() {
    this.props.getData('revenuePerPlanCurrentMonth', this.prepereAgrigateQuery());
  }

  prepereAgrigateQuery() {
    const {toDate} = this.props;
    const AGGREGATE = 'aggregate';

    let query = [{
      "$match" : { "type" : "flat", "plan" : { "$exists" : true } }
    },{
      "$project" : { "year" : { "$year" : "$urt" }, "month" : { "$month" : "$urt" }, "aprice" : 1, "plan" : 1 }
    },{
      "$match" : { "year" : toDate.getUTCFullYear(), "month" : toDate.getUTCMonth()+1 }
    },{
      "$group" : { "_id" : "$plan", "sum" : { "$sum" : "$aprice" } }
    },{
      "$project" : { "_id" : 0, "sum" : 1, "name" : "$_id" }
    }];

    var queries = [{
      name: 'revenue_per_plan',
      api: AGGREGATE,
      params: [
        { collection: "lines" },
        { pipelines: JSON.stringify(query) }
      ]
    }];

    return queries;
  }

  prepareChartData(chartData) {
    const {toDate} = this.props;
    var formatedData = {
      // title: getMonthName(toDate.getUTCMonth()+1) + ", " + '01 to ' + ("0" + toDate.getUTCDate()).slice(-2),
      labels: [],
      values: []
    };

    let dataset = chartData.find((dataset, i) => dataset.name == "revenue_per_plan");
    dataset.data.forEach((node, j) => {
      formatedData.labels.push(node.name);
      formatedData.values.push(Math.ceil(node.sum));
    });
    return formatedData;
  }

  overrideChartOptions() {
    let owerideOptions = {
      tooltips: {
        enabled: false,
      },
      legend: {
        onClick: null,
        position: 'right',
      },
      valueSuffix : " " + globalSetting.currency,
      animation: {
        onProgress: drawDataOnPie
      },
      cutoutPercentage: 20,
    };
    return owerideOptions;
  }

  renderContent(chartData){
    switch (chartData) {
      case undefined: return <PlaceHolderWidget/>;
      case null: return null;
      default: return <DoughnutChart width={this.state.width} height={this.state.height} data={this.prepareChartData(chartData)} options={this.overrideChartOptions()}/>;
    }
  }

  render() {
    const { chartData } = this.props;
    return ( <div> {this.renderContent(chartData)} </div> );
  }
}

function mapStateToProps(state, props) {
  return {chartData: state.dashboard.revenuePerPlanCurrentMonth};
}

export default connect(mapStateToProps, { getData })(RevenuePerPlanCurrentMonth);
