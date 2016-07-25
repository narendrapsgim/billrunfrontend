import React, {Component} from 'react';
import {connect} from 'react-redux';
import moment from 'moment';
import {LineChart} from '../../Charts';
import {getData} from '../../../actions/dashboardActions';
import PlaceHolderWidget from '../Widgets/PlaceHolder';
import {getMonthName, getYearsToDisplay} from '../Widgets/helper';


class TotalSubscribers extends Component {

  constructor(props) {
    super(props);
    this.state = {
      width: props.width || 350,
      height: props.height || 400
    }
  }

  componentDidMount() {
    this.props.dispatch(getData({type: 'totalSubscribers', queries: this.prepereAgrigateQuery()}));
  }

  prepereAgrigateQuery() {
    const {fromDate, toDate} = this.props;

    var newSubscribersQuery = [{
      "$match": { "type": "subscriber", "creation_time": { "$gte": fromDate }, "to": { "$gte": toDate } }
    },{
      "$group": { "_id": "$sid", "creation_time": { "$first": "$creation_time" } }
    },{
      "$group": { "_id": { "year": { "$year": "$creation_time" }, "month": { "$month": "$creation_time" } }, "count": { "$sum": 1 } }
    },{
      "$project": { "year": "$_id.year", "month": "$_id.month", "_id": 0, "count": "$count" }
    }, {
      "$sort": { "year": 1, "month": 1 }
    }];

    var totalSubscribersQuery = [{
      "$match" : {"to":{"$gte": toDate},"creation_time":{"$lte": fromDate }  }
    },{
      "$sort" : {"creation_time" : 1}
    },{
      "$group": {"_id" : "$sid"}
    },{
      "$group":{"_id":null, "count" : {"$sum":1}}
    },{
      "$project" : {"count":1, "_id":0}
    }];

    var queries = [{
      name: 'new_subscribers',
      request: {
        api: "aggregate",
        params: [
          { collection: "subscribers" },
          { pipelines: JSON.stringify(newSubscribersQuery) }
        ]
      }
    },{
      name: 'total_subscribers',
      request: {
        api: "aggregate",
        params: [
          { collection: "subscribers" },
          { pipelines: JSON.stringify(totalSubscribersQuery) }
        ]
      }
    }];

    return queries;
  }

  prepareChartData(chartData) {
    const {fromDate, toDate} = this.props;
    let yearsToDisplay = getYearsToDisplay(fromDate, toDate);
    let multipleYears = Object.keys(yearsToDisplay).length > 1;

    let total = 0;
    let formatedData = {
      title: 'Total Subscribers',
      x: [ { label : 'Subsctibers', values : [] } ],
      y: []
    };

    let totalSubscribersDataset = chartData.find((dataset, i) => dataset.name == "total_subscribers");
    if(totalSubscribersDataset && totalSubscribersDataset.data && totalSubscribersDataset.data[0]){
      total = totalSubscribersDataset.data[0].count;
    }

    let newSubscribersDataset = chartData.find((dataset, i) => dataset.name == "new_subscribers");
    if(!newSubscribersDataset.data || newSubscribersDataset.data.length == 0){
      return null;
    }

    for (var year in yearsToDisplay) {
      yearsToDisplay[year].forEach((month, k) => {
        var point = newSubscribersDataset.data.find((node, i) => { return (month == node.month && year == node.year)} );
        total += (point) ? point.count : 0 ;
        formatedData.x[0].values.push(total);
        let label = getMonthName(month);
        if (multipleYears){
          label += ', ' + year;
        }
        formatedData.y.push(label);
      });
    }


    return formatedData;
  }

  overrideChartOptions() {
    let owerideOptions = {
      legend: {
        display: false
      },
      scales: {
        yAxes: [
          {
            display: true,
            ticks: {
              beginAtZero: false
            }
          }
        ]
      },
    };
    return owerideOptions;
  }

  renderContent(chartData){
    switch (chartData) {
      case undefined: return <PlaceHolderWidget/>;
      case null: return null;
      default: return <LineChart width={this.state.width} height={this.state.height} data={this.prepareChartData(chartData)} options={this.overrideChartOptions()}/>;
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
  return {chartData: state.dashboard.totalSubscribers};
}

export default connect(mapStateToProps)(TotalSubscribers);
