import React, {Component} from 'react';
import {connect} from 'react-redux';
import {LineChart} from '../../Charts';
import {getData} from '../../../actions/dashboardActions';
import PlaceHolderWidget from '../Widgets/PlaceHolder';


class NewSubscribers extends Component {
  componentDidMount() {
    this.props.dispatch(getData({type: 'newSubscribers', queries: this.prepereAgrigateQuery()}));
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
      name: 'newSubscribers',
      request: {
        api: "aggregate",
        params: [
          { collection: "subscribers" },
          { pipelines: JSON.stringify([matchActiveSibscribersAfterDDate, groupBySID, groupByCreated, projectDate, sortByYearMonth]) }
        ]
      }
    };

    return [queryUrl];
  }

  componentWillReceiveProps(nextProps) {
    // console.log('TotalSubscribers componentWillReceiveProps : ', nextProps);
  }

  prepareChartData() {
    const {chartData} = this.props;

    let monthsNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let today = new Date();
    let monthsToShow = Array.from(Array(6), (v, k) => new Date(today.setMonth(today.getMonth() - 1)).getMonth() + 2).reverse();

    var formatedData = {
      title: 'New Subscribers',
      x: [ { label : 'Subsctibers', values : [] } ],
      y: []
    };

    chartData.forEach((dataset, i) => {

      monthsToShow.forEach((monthNumber, k) => {

        var point = dataset.data.filter((node, i) => {
          return (monthNumber  == node.month)
        });

        let month = monthsNames[monthNumber-1];
        if(point.length > 0 ){
          formatedData.x[i].values.push(point[0].count);
        } else {
          formatedData.x[i].values.push(0);
        }
        formatedData.y.push( month );
      })
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

  renderContent(){
    const { width = 350, height = 400, chartData } = this.props;

    switch (chartData) {
      case undefined: return <PlaceHolderWidget/>;
      case null: return null;
      default: return <LineChart width={width} height={height} data={this.prepareChartData()} options={this.overrideChartOptions()}/>;
    }
  }

  render() {
    const { width = 350, height = 400 } = this.props;

    return (
      <div style={{ display: 'inline-block', margin: '20px', width: width, height: height }}>
        {this.renderContent()}
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return {chartData: state.dashboard.newSubscribers};
}

export default connect(mapStateToProps)(NewSubscribers);
