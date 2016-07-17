import React, {Component} from 'react';
import {connect} from 'react-redux';
import {LineChart} from '../../Charts';
import {getData} from '../../../actions/dashboardActions';
import PlaceHolderWidget from '../Widgets/PlaceHolder';


class ChurningSubscribers extends Component {

  constructor(props) {
    super(props);
    this.state = {
      width: props.width || 350,
      height: props.height || 400
    }
  }

  componentDidMount() {
    this.props.dispatch(getData({type: 'churningSubscribers', queries: this.prepereAgrigateQuery()}));
  }

  prepereAgrigateQuery() {
    let today = new Date();
    today.setUTCHours(0);
    today.setUTCMinutes(0);
    today.setUTCSeconds(0);
    var tempDate = new Date(today);
    tempDate.setUTCDate(1);
    let dDate = new Date(tempDate.setUTCMonth(tempDate.getUTCMonth()-5));

    var matchActiveSibscribers = {
      "$match": { "type": "subscriber", "to": { "$lte": today, "$gte": dDate} }
    };
    var groupBySID = {
      "$group": { "_id": "$sid", "to": { "$last": "$to" } }
    };
    var groupByCreated = {
      "$group": {
        "_id": { "year": { "$year": "$to" }, "month": { "$month": "$to" } },
        "count": { "$sum": 1 }
      }
    };
    var projectDate = {
      "$project": { "year": "$_id.year", "month": "$_id.month", "_id": 0, "count": "$count" }
    };
    var sortByYearMonth = {
      "$sort": { "year": 1, "month": 1 }
    };

    var queryUrl = {
      name: 'churningSubscribers',
      request: {
        api: "aggregate",
        params: [
          { collection: "subscribers" },
          { pipelines: JSON.stringify([matchActiveSibscribers, groupBySID, groupByCreated, projectDate, sortByYearMonth]) }
        ]
      }
    };

    return [queryUrl];
  }

  componentWillReceiveProps(nextProps) {
    // console.log('TotalSubscribers componentWillReceiveProps : ', nextProps);
  }

  prepareChartData(chartData) {
    let monthsNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let today = new Date();
    let monthsToShow = Array.from(Array(6), (v, k) => new Date(today.setMonth(today.getMonth() - 1)).getMonth() + 2).reverse();

    var formatedData = {
      title: 'Churning Subscribers',
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
  return {chartData: state.dashboard.churningSubscribers};
}

export default connect(mapStateToProps)(ChurningSubscribers);
