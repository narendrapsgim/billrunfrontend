import React, {Component} from 'react';
import {connect} from 'react-redux';
import {PieChart} from '../../Charts';
import {getData} from '../../../actions/dashboardActions';
import PlaceHolderWidget from '../Widgets/PlaceHolder';
import {drawDataOnPie} from '../Widgets/helper';



class RevenuePerPlan extends Component {

  constructor(props) {
    super(props);
    this.state = {
      width: props.width || 545,
      height: props.height || 400
    }
  }

  componentDidMount() {
    this.props.getData('revenuePerPlan', this.prepereAgrigateQuery());
  }

  prepereAgrigateQuery() {
    const {fromDate, toDate} = this.props;
    const AGGREGATE = 'aggregate';

    let query = [{
  		"$match" : { "type" : "flat", "plan" : { "$exists" : true }, "urt" : { "$gte" : fromDate, "$lte" : toDate } }
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
    var formatedData = {
      title: 'Revenue per Plan',
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
      }
    };
    return owerideOptions;
  }

  renderContent(chartData){
    switch (chartData) {
      case undefined: return <PlaceHolderWidget/>;
      case null: return null;
      default: return <PieChart width={this.state.width} height={this.state.height} data={this.prepareChartData(chartData)} options={this.overrideChartOptions()}/>;
    }
  }

  render() {
    const { chartData } = this.props;

    return (
      <div style={{ display: 'inline-block', margin: '10px', padding: '10px', width: this.state.width, height: this.state.height, backgroundColor: 'white' }}>
        {this.renderContent(chartData)}
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return {chartData: state.dashboard.revenuePerPlan};
}

export default connect(mapStateToProps, { getData })(RevenuePerPlan);
