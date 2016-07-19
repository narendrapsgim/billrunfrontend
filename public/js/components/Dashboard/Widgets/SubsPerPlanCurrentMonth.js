import React, {Component} from 'react';
import {connect} from 'react-redux';
import {PieChart} from '../../Charts';
import {getData} from '../../../actions/dashboardActions';
import PlaceHolderWidget from '../Widgets/PlaceHolder';
import {drawDataOnPie, getMonthName} from '../Widgets/helper';


class SubsPerPlanCurrentMonth extends Component {

  constructor(props) {
    super(props);
    this.state = {
      width: props.width || 545,
      height: props.height || 400
    }
  }

  componentDidMount() {
    this.props.dispatch(getData({type: 'subsPerPlanCurrentMonth', queries: this.prepereAgrigateQuery()}));
  }

  prepereAgrigateQuery() {
    const {toDate} = this.props;

    var query = [{
      "$match" : { "type" : "subscriber", "plan" : { "$exists" : true } }
    },{
      "$group" : { "_id" : "$sid", "plan" : { "$last" : "$plan" }, "creation_time" : { "$last" : "$creation_time" }, "type" : { "$last" : "$type" } }
    },{
      "$project" : { "year" : { "$year" : "$creation_time" }, "month" : { "$month" : "$creation_time" }, "type" : 1, "plan" : 1 }
    },{
      "$match" : { "year" : toDate.getUTCFullYear(), "month" : toDate.getUTCMonth()+1 }
    },{
      "$group" : { "_id" : "$plan", "count" : { "$sum" : 1 } }
    },{
      "$project" : { "name" : "$_id", "count" : 1, "_id" : 0 }
    }];

    var queries = [{
      name: 'subsPerPlan',
      request: {
        api: "aggregate",
        params: [
          { collection: "subscribers" },
          { pipelines: JSON.stringify(query) }
        ]
      }
    }];

    return queries;
  }

  prepareChartData(chartData) {
    const {toDate} = this.props;
    var formatedData = {
      title: 'Subscribers per Plan  from 1 to '+toDate.getUTCDate() + " / " + getMonthName(toDate.getUTCMonth()+1),
      labels: [],
      values: []
    };

    chartData.forEach((dataset, i) => {
      dataset.data.forEach((node, j) => {
        formatedData.labels.push(node.name);
        formatedData.values.push(node.count);
      });
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
      animation: {
        onProgress: drawDataOnPie,
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
      <div style={{ display: 'inline-block', margin: '20px', width: this.state.width, height: this.state.height }}>
        {this.renderContent(chartData)}
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return {chartData: state.dashboard.subsPerPlanCurrentMonth};
}

export default connect(mapStateToProps)(SubsPerPlanCurrentMonth);
