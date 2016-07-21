import React, {Component} from 'react';
import {connect} from 'react-redux';
import moment from 'moment';
import {MapChart} from '../../Charts';
import {getData} from '../../../actions/dashboardActions';
import PlaceHolderWidget from '../Widgets/PlaceHolder';
import {getCountryKeyByCountryName} from '../Widgets/helper';


class MapSubscribers extends Component {

  constructor(props) {
    super(props);
    this.state = {}
  }

  componentDidMount() {
    this.props.dispatch(getData({type: 'mapSubscribers', queries: this.prepereAgrigateQuery()}));
  }

  prepereAgrigateQuery() {
    const {fromDate, toDate} = this.props;
    var query = [{
    		"$match" : { "type" : "subscriber", "country" : { "$exists" : true },
    			"creation_time" : { "$lte" : toDate, "$gte" : fromDate },
    			"to" : { "$gte" : toDate }
    		}
    	}, {
    		"$group" : { "_id" : "$sid", "country" : { "$last" : "$country" } }
    	}, {
    		"$group" : { "_id" : "$country", "count" : { "$sum" : 1 } }
    	}, {
    		"$project" : { "country" : "$_id", "_id" : 0, "count" : "$count" }
    	}, {
    		"$sort" : { "count" : 1 }
  	}];
    var queries = [{
      name: 'map_subscribers',
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
    let dataset = chartData.find((dataset, i) => dataset.name == "map_subscribers");
    if(!dataset.data || dataset.data.length == 0){
      return null;
    }
    let notFoundCountries = [];
    let min = dataset.data[0].count;
    let max = dataset.data[dataset.data.length-1].count;
    let babbleScale = d3.scale.linear().domain([min,max]).range([0,10]);
    let formatedData = dataset.data.map((node, j) => {
      let ISOcode = getCountryKeyByCountryName(node.country);
      if(!ISOcode){
        notFoundCountries.push(node.country)
      }
      return {
        name: node.country,
        centered: ISOcode,
        count: node.count,
        radius: babbleScale(node.count),
        fillKey: 'point',
      }
    });
    console.log("notFoundCountries", notFoundCountries);
    return formatedData;
  }

  overrideChartOptions() {
    let owerideOptions = {
      fills: {'point': '#EA4379', defaultFill: '#485A65' },
      responsive: true,
      geographyConfig: {popupOnHover: false, highlightOnHover: false, borderColor: '#485A65' },
      scope: "world",
      projection: 'mercator',
      bubblesConfig: {
        borderWidth: 0,
        fillOpacity: 1,
        popupOnHover: true,
        highlightFillColor: '#EA4379',
        highlightBorderWidth: 0,
        popupTemplate: function(geography, data) {
          return '<div class="hoverinfo"><span style="color:#1596FA"><strong>' + data.name + '</strong></span>' + " " + '<span>' + data.count + '</span></div>';
        },
      }
    };
    return owerideOptions;
  }

  renderContent(chartData){
    switch (chartData) {
      case undefined: return <PlaceHolderWidget/>;
      case null: return null;
      default:
        let bubbles = this.prepareChartData(chartData);
        return <MapChart bubbles={bubbles} {...this.overrideChartOptions()} />;
    }
  }

  render() {
    const { chartData } = this.props;
    return (
      <div style={{ width:1130, height:650, margin: '10px', padding: '10px', backgroundColor: '#2B2E3C' }}>
          {this.renderContent(chartData)}
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return {chartData: state.dashboard.mapSubscribers};
}

export default connect(mapStateToProps)(MapSubscribers);
