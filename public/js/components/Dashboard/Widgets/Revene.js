import React, {Component} from 'react';
import {connect} from 'react-redux';
import moment from 'moment';
import {LineAreaChart} from '../../Charts';
import {getData} from '../../../actions/dashboardActions';
import PlaceHolderWidget from '../Widgets/PlaceHolder';
import {getMonthName, getMonthsToDisplay} from '../Widgets/helper';


class Revene extends Component {

  constructor(props) {
    super(props);
    this.state = {
      width: props.width || 545,
      height: props.height || 400
    }
  }

  componentDidMount() {
    this.props.dispatch(getData({type: 'revene', queries: this.prepereAgrigateQuery()}));
  }

  prepereAgrigateQuery() {
    const {fromDate, toDate} = this.props;

    var revenueQuery = [{
      "$match": {"confirmation_time": {"$gte": fromDate, "$lte": toDate}, "type": "rec"}
    },{
      "$group": { "_id": "$aid", "date": { "$first": "$confirmation_time" }, "due":{"$sum":"$due"} }
    },{
      "$group": { "_id": { "year": { "$year": "$date" }, "month": { "$month": "$date" } }, "due": { "$sum": "$due" } }
    },{
      "$project": { "year": "$_id.year", "month": "$_id.month", "_id": 0, "due": "$due" }
    },{
      "$sort": { "year": 1, "month": 1 }
    }];

    var queries = [{
      name: 'revenue',
      request: {
        api: "aggregate",
        params: [
          { collection: "bills" },
          { pipelines: JSON.stringify(revenueQuery) }
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
      title: 'Revenue',
      x: [ { label : 'Revenue', values : [] } ],
      y: []
    };

    let dataset = chartData.find((dataset, i) => dataset.name == "revenue");
    //TODO - fix check YEAR
    monthsToDisplay.forEach((monthNumber, k) => {
      var point = dataset.data.find((node, i) => monthNumber == node.month );
      let data = (point) ? point.due : 0 ;
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
      default: return <LineAreaChart width={this.state.width} height={this.state.height} data={this.prepareChartData(chartData)} options={this.overrideChartOptions()}/>;
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
  return {chartData: state.dashboard.revene};
}

export default connect(mapStateToProps)(Revene);
