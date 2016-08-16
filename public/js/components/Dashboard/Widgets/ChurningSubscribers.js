import React, {Component} from 'react';
import {connect} from 'react-redux';
import moment from 'moment';
import {LineChart} from '../../Charts';
import {getData} from '../../../actions/dashboardActions';
import PlaceHolderWidget from '../Widgets/PlaceHolder';
import {getMonthName, getYearsToDisplay} from '../Widgets/helper';


class ChurningSubscribers extends Component {

  constructor(props) {
    super(props);
    this.state = {
      width: props.width || 350,
      height: props.height || 400
    }
  }

  componentDidMount() {
    this.props.getData('churningSubscribers', this.prepereAgrigateQuery());
  }

  prepereAgrigateQuery() {
    const {fromDate, toDate} = this.props;
    const AGGREGATE = 'aggregate';

    var churningSubscribersQuery = [{
      "$match": { "type": "subscriber", "to": { "$lte": toDate, "$gte": fromDate} }
    },{
      "$group": { "_id": "$sid", "to": { "$last": "$to" } }
    },{
      "$group": { "_id": { "year": { "$year": "$to" }, "month": { "$month": "$to" } }, "count": { "$sum": 1 } }
    },{
      "$project": { "year": "$_id.year", "month": "$_id.month", "_id": 0, "count": "$count" }
    },{
      "$sort": { "year": 1, "month": 1 }
    }];

    var queries = [{
      name: 'churning_subscribers',
      api: AGGREGATE,
      params: [
        { collection: 'subscribers' },
        { pipelines: JSON.stringify(churningSubscribersQuery) }
      ]
    }];

    return queries;
  }

  prepareChartData(chartData) {
    const {fromDate, toDate} = this.props;
    let yearsToDisplay = getYearsToDisplay(fromDate, toDate);
    let multipleYears = Object.keys(yearsToDisplay).length > 1;

    var formatedData = {
      title: 'Churning Subscribers',
      x: [ { label : 'Subsctibers', values : [] } ],
      y: []
    };

    let dataset = chartData.find((dataset, i) => dataset.name == "churning_subscribers");
    if(!dataset.data || dataset.data.length == 0){
      return null;
    }
    for (var year in yearsToDisplay) {
      yearsToDisplay[year].forEach((month, k) => {
        var point = dataset.data.find((node, i) => { return (month == node.month && year == node.year)} );
        let data = (point) ? point.count : 0 ;
        formatedData.x[0].values.push(data);
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
              beginAtZero: true,
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
  return {chartData: state.dashboard.churningSubscribers};
}

export default connect(mapStateToProps, { getData })(ChurningSubscribers);
