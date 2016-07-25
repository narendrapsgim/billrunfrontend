import React, {Component} from 'react';
import {connect} from 'react-redux';
import moment from 'moment';
import {LineChart} from '../../Charts';
import {getData} from '../../../actions/dashboardActions';
import PlaceHolderWidget from '../Widgets/PlaceHolder';
import {getMonthName, getMonthsToDisplay} from '../Widgets/helper';


class NewSubscribers extends Component {

  constructor(props) {
    super(props);
    this.state = {
      width: props.width || 350,
      height: props.height || 400
    }
  }

  componentDidMount() {
    this.props.dispatch(getData({type: 'newSubscribers', queries: this.prepereAgrigateQuery()}));
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
    },{
      "$sort": { "year": 1, "month": 1 }
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
    }];

    return queries;
  }

  prepareChartData(chartData) {
    const {fromDate, toDate} = this.props;
    let monthes = parseInt(moment(toDate).diff(moment(fromDate), 'months', true)) + 1;
    let monthsToDisplay = getMonthsToDisplay(monthes);

    var formatedData = {
      title: 'New Subscribers',
      x: [ { label : 'Subsctibers', values : [] } ],
      y: []
    };

    let newSubscribersDataset = chartData.find((dataset, i) => dataset.name == "new_subscribers");
    if(!newSubscribersDataset.data || newSubscribersDataset.data.length == 0){
      return null;
    }
    //TODO - fix check YEAR
    monthsToDisplay.forEach((monthNumber, k) => {
      var point = newSubscribersDataset.data.find((node, i) => monthNumber == node.month );
      let data = (point) ? point.count : 0 ;
      formatedData.x[0].values.push(data);
      formatedData.y.push( getMonthName(monthNumber) );
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
      <div style={{ display: 'inline-block', margin: '10px', padding: '10px', width: this.state.width, height: this.state.height, backgroundColor: 'white' }}>
        {this.renderContent(chartData)}
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return {chartData: state.dashboard.newSubscribers};
}

export default connect(mapStateToProps)(NewSubscribers);
