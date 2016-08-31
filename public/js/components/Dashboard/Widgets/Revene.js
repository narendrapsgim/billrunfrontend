import React, {Component} from 'react';
import {connect} from 'react-redux';
import moment from 'moment';
import {LineAreaChart} from '../../Charts';
import {getData} from '../../../actions/dashboardActions';
import PlaceHolderWidget from '../Widgets/PlaceHolder';
import {getMonthName, getYearsToDisplay, chartOptionCurrencyAxesLabel, chartOptionCurrencyTooltipLabel} from '../Widgets/helper';


class Revene extends Component {

  constructor(props) {
    super(props);
    this.state = {
      width: props.width || 545,
      height: props.height || 400
    }
  }

  componentDidMount() {
    this.props.getData('revene', this.prepereAgrigateQuery());
  }

  prepereAgrigateQuery() {
    const {fromDate, toDate} = this.props;
    const AGGREGATE = 'aggregate';

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
      api: AGGREGATE,
      params: [
        { collection: "bills" },
        { pipelines: JSON.stringify(revenueQuery) }
      ]
    }];

    return queries;
  }

  prepareChartData(chartData) {
    const {fromDate, toDate} = this.props;
    let yearsToDisplay = getYearsToDisplay(fromDate, toDate);
    let multipleYears = Object.keys(yearsToDisplay).length > 1;

    var formatedData = {
      // title: 'Revenue',
      x: [ { label : 'Revenue', values : [] } ],
      y: []
    };

    let dataset = chartData.find((dataset, i) => dataset.name == "revenue");
    if(!dataset.data || dataset.data.length == 0){
      return null;
    }
    for (var year in yearsToDisplay) {
      yearsToDisplay[year].forEach((month, k) => {
        var point = dataset.data.find((node, i) => { return (month == node.month && year == node.year)} );
        let data = (point) ? point.due : 0 ;
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
      tooltips: {
          enabled: true,
          mode: 'single',
          callbacks: {
            title: function (tooltipItem, data) { return null; },
            label: chartOptionCurrencyTooltipLabel
          }
      },
      scales: {
        yAxes: [
          {
            display: true,
            ticks: {
              beginAtZero: false,
              callback: chartOptionCurrencyAxesLabel
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
    return ( <div> {this.renderContent(chartData)} </div> );
  }
}

function mapStateToProps(state, props) {
  return {chartData: state.dashboard.revene};
}

export default connect(mapStateToProps, { getData })(Revene);
