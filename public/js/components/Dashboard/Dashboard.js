import React, { Component } from 'react';
import { connect } from 'react-redux';
import CircularProgress from 'material-ui/CircularProgress';
import {
  LineChart,
  LineAreaChart,
  LineAreaStackedChart,
  BarChart,
  BarStackedChart,
  BarHorizontalChart,
  BarHorizontalStrackedChart,
  PieChart,
  DoughnutChart,
  PolarAreaChart,
  BubbleChart } from '../Charts';
import { getData } from '../../actions/dashboardActions';
import TotalSubscribersWidget from './Widgets/TotalSubscribers'
import NewSubscribersWidget from './Widgets/NewSubscribers'
import ChurningSubscribersWidget from './Widgets/ChurningSubscribers'

class Dashboard extends Component {

  constructor(props) {
    super(props);
    this.state = {}
    this.styles = this.getStyles();
  }

  componentDidMount(){
    // this.props.dispatch(getData({type: 'newSubscribers'}));
    // this.props.dispatch(getData({type: 'leavingSubscribers'}));
    // this.props.dispatch(getData({type: 'lineData'}));
    // this.props.dispatch(getData({type: 'pieData'}));
    // this.props.dispatch(getData({type: 'bubbleData'}));
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.dashboard.type){
      this.setState({
        [nextProps.dashboard.type] : (nextProps.dashboard.data) ? nextProps.dashboard.data : {}
      });
    }
  }

  getStyles() {
    return {
      chartWrapper : {display:'inline-block', margin:'20px'},
      dashboardHeaderContainer: {margin: '-20px auto 10px auto', backgroundColor:'#007666'},
      dashboardHeader: {padding: '15px 50px'},
      dashboardHeaderTitle: {color: 'white', padding: 0, margin: 0},
      chartLoadingPlaceholder: {textAlign: 'center', display: 'table-cell', verticalAlign: 'middle'}
    }
  };

  renderLoadElement(width, height){
    let style = Object.assign({}, this.styles.chartLoadingPlaceholder, {width, height});
    return <div style={style}><CircularProgress size={2} /></div>
  }

  render() {
    var width = 545, height = 400, width3 = 350;

    return (
      <div className="dashboard" >
        <div className="container" style={this.styles.dashboardHeaderContainer}>
          <div className="header" style={this.styles.dashboardHeader}>
            <h3 style={this.styles.dashboardHeaderTitle}>Dashboard</h3>
          </div>
        </div>
        <div className="container" >
          <TotalSubscribersWidget />
          <NewSubscribersWidget />
          <ChurningSubscribersWidget />
        </div>
      </div>
    );

    return (
      <div className="dashboard" >
        <div className="container" style={this.styles.dashboardHeaderContainer}>
          <div className="header" style={this.styles.dashboardHeader}>
            <h3 style={this.styles.dashboardHeaderTitle}>Dashboard</h3>
          </div>
        </div>
        <div className="container" >
          <div style={this.styles.chartWrapper}>
            {this.state.lineData ? <LineChart width={width} height={height} data={this.state.lineData} /> : this.renderLoadElement(width, height)}
          </div>
          <div style={this.styles.chartWrapper}>
            {this.state.lineData ? <LineAreaChart width={width} height={height} data={this.state.lineData} /> : this.renderLoadElement(width, height)}
          </div>


          <div style={this.styles.chartWrapper}>
            {this.state.totalSubscribers ? <LineChart width={width3} height={height} data={this.state.totalSubscribers} options={totalSubscribersOptions}/> : this.renderLoadElement(width3, height)}
          </div>
          <div style={this.styles.chartWrapper}>
            {this.state.newSubscribers ? <LineChart width={width3} height={height} data={this.state.newSubscribers} options={{legend:{display:false}}}/> : this.renderLoadElement(width3, height)}
          </div>
          <div style={this.styles.chartWrapper}>
            {this.state.leavingSubscribers ? <LineChart width={width3} height={height} data={this.state.leavingSubscribers} options={{legend:{display:false}}}/> : this.renderLoadElement(width3, height)}
          </div>


          <div style={this.styles.chartWrapper}>
            {this.state.pieData ? <PieChart width={width} height={height} data={this.state.pieData} /> : this.renderLoadElement(width, height)}
          </div>
          <div style={this.styles.chartWrapper}>
            {this.state.pieData ? <DoughnutChart width={width} height={height} data={this.state.pieData} /> : this.renderLoadElement(width, height)}
          </div>

          <div style={this.styles.chartWrapper}>
            {this.state.pieData ? <PolarAreaChart width={width} height={height} data={this.state.pieData} /> : this.renderLoadElement(width, height)}
          </div>

          <div style={this.styles.chartWrapper}>
            {this.state.bubbleData ? <BubbleChart width={width} height={height} data={this.state.bubbleData} /> : this.renderLoadElement(width, height)}
          </div>


          <div style={this.styles.chartWrapper}>
            {this.state.lineData ? <BarChart width={width} height={height} data={this.state.lineData} /> : this.renderLoadElement(width, height)}
          </div>
          <div style={this.styles.chartWrapper}>
            {this.state.lineData ? <BarStackedChart width={width} height={height} data={this.state.lineData} /> : this.renderLoadElement(width, height)}
          </div>


          <div style={this.styles.chartWrapper}>
            {this.state.lineData ? <LineAreaStackedChart width={width} height={height} data={this.state.lineData} /> : this.renderLoadElement(width, height)}
          </div>
          <div style={this.styles.chartWrapper}>
            {this.state.lineData ? <BarHorizontalChart width={width} height={height} data={this.state.lineData} /> : this.renderLoadElement(width, height)}
          </div>
          <div style={this.styles.chartWrapper}>
            {this.state.lineData ? <BarHorizontalStrackedChart width={width} height={height} data={this.state.lineData} /> : this.renderLoadElement(width, height)}
          </div>


        </div>
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    dashboard: state.dashboard
  };
}

export default connect(mapStateToProps)(Dashboard);
