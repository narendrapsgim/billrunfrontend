import React, {Component} from 'react';
import {connect} from 'react-redux';
import {PieChart} from '../../Charts';
import {getData} from '../../../actions/dashboardActions';
import PlaceHolderWidget from '../Widgets/PlaceHolder';
import {drawDataOnPie} from '../Widgets/helper';



class SubsPerPlan extends Component {

  constructor(props) {
    super(props);
    this.state = {
      width: props.width || 545,
      height: props.height || 400
    }
  }

  componentDidMount() {
    this.props.getData('subsPerPlan', this.prepereAgrigateQuery());
  }

  prepereAgrigateQuery() {
    const {fromDate, toDate} = this.props;
    const AGGREGATE = 'aggregate';

    let query = [{
      "$match": {"type":"subscriber", "plan": {"$exists": true}, "creation_time": { "$gte": fromDate }, "to": { "$gte": toDate }}
    },{
      "$group": {"_id": "$sid", "plan": {"$last": "$plan"}}
    },{
      "$group": {"_id": "$plan", "count": {"$sum": 1}}
    },{
      "$project": {"name": "$_id", "count": 1, "_id": 0}
    },{
       "$sort": {"count": -1}
    }];

    var queries = [{
      name: 'subs_per_plan',
      api: AGGREGATE,
      params: [
        { collection: "subscribers" },
        { pipelines: JSON.stringify(query) }
      ]
    }];

    return queries;
  }

  prepareChartData(chartData) {
    var formatedData = {
      title: 'Subscribers per Plan',
      labels: [],
      values: []
    };

    let dataset = chartData.find((dataset, i) => dataset.name == "subs_per_plan");
    dataset.data.forEach((node, j) => {
      formatedData.labels.push(node.name);
      formatedData.values.push(node.count);
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
  return {chartData: state.dashboard.subsPerPlan};
}

export default connect(mapStateToProps, { getData })(SubsPerPlan);
