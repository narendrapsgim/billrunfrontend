import React, {Component} from 'react';
import {connect} from 'react-redux';
import {LineChart} from '../../Charts';
import {getData} from '../../../actions/dashboardActions';
import PlaceHolderWidget from '../Widgets/PlaceHolder';


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
    let today = new Date();
    today.setUTCDate(1);
    today.setUTCHours(0);
    today.setUTCMinutes(0);
    today.setUTCSeconds(0);
    var tempDate = new Date(today);
    let dDate = new Date(tempDate.setUTCMonth(tempDate.getUTCMonth()-5));

    var matchActiveSibscribersAfterDDate = {
      "$match": { "type": "subscriber", "creation_time": { "$gte": dDate }, "to": { "$gte": today } }
    };
    var groupBySID = {
      "$group": { "_id": "$sid", "creation_time": { "$first": "$creation_time" } }
    };
    var groupByCreated = {
      "$group": { "_id": { "year": { "$year": "$creation_time" }, "month": { "$month": "$creation_time" } }, "count": { "$sum": 1 } }
    };
    var projectDate = {
      "$project": { "year": "$_id.year", "month": "$_id.month", "_id": 0, "count": "$count" }
    };
    var sortByYearMonth = {
      "$sort": { "year": 1, "month": 1 }
    };

    var queryUrl = {
      name: 'new_subscribers',
      request: {
        api: "aggregate",
        params: [
          { collection: "subscribers" },
          { pipelines: JSON.stringify([matchActiveSibscribersAfterDDate, groupBySID, groupByCreated, projectDate, sortByYearMonth]) }
        ]
      }
    };

    var matchActiveBeforeDDate = {
      "$match" : {"to":{"$gte": today},"creation_time":{"$lte": dDate }  }
    };
    var sortByCreated = {
      "$sort" : {"creation_time" : 1}
    };
    var groupBySID = {
      "$group": {"_id" : "$sid"}
    };
    var groupCount = {
      "$group":{"_id":null, "count" : {"$sum":1}}
    };
    var projectCount = {
      "$project" : {"count":1, "_id":0}
    };

    var queryUrlTotal = {
      name: 'total_subscribers',
      request: {
        api: "aggregate",
        params: [
          { collection: "subscribers" },
          { pipelines: JSON.stringify([matchActiveBeforeDDate, sortByCreated, groupBySID, groupCount, projectCount]) }
        ]
      }
    };

    return [queryUrl, queryUrlTotal];
  }

  componentWillReceiveProps(nextProps) {
    //console.log('TotalSubscribers componentWillReceiveProps : ', nextProps);
  }

  prepareChartData(chartData) {
    let monthsNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let today = new Date();
    let monthsToShow = Array.from(Array(6), (v, k) => new Date(today.setMonth(today.getMonth() - 1)).getMonth() + 2).reverse();

    let total = 0
    let formatedData = {
      title: 'Total Subscribers',
      x: [ { label : 'Subsctibers', values : [] } ],
      y: []
    };

    chartData.forEach((dataset, i) => {
      if(dataset.name == 'total_subscribers') {
        if(dataset.data[0] && dataset.data[0].count){
          total = dataset.data[0].count;
        }
      }
    });

    chartData.forEach((dataset, i) => {
      if(dataset.name == 'new_subscribers') {

        monthsToShow.forEach((monthNumber, k) => {

          var point = dataset.data.filter((node, i) => {
            return (monthNumber  == node.month)
          });

          let month = monthsNames[monthNumber-1];
          if(point.length > 0 ){
            total += point[0].count;
          }
          formatedData.x[i].values.push(total);
          formatedData.y.push( month );
        })
      }
    });

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
      <div style={{ display: 'inline-block', margin: '20px', width: this.state.width, height: this.state.height }}>
        {this.renderContent(chartData)}
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return {chartData: state.dashboard.totalSubscribers};
}

export default connect(mapStateToProps)(TotalSubscribers);
