import React, { Component } from 'react';
import { connect } from 'react-redux';
import CircularProgress from 'material-ui/CircularProgress';
import DashboardIcon from 'material-ui/svg-icons/action/dashboard'
import moment from 'moment';
import { getData } from '../../actions/dashboardActions';
import TotalSubscribersWidget from './Widgets/TotalSubscribers'
import NewSubscribersWidget from './Widgets/NewSubscribers'
import ChurningSubscribersWidget from './Widgets/ChurningSubscribers'
import ReveneWidget from './Widgets/Revene'
import RevenueAvgPerSubscriberWidget from './Widgets/RevenueAvgPerSubscriber'
import SubsPerPlanWidget from './Widgets/SubsPerPlan'
import SubsPerPlanCurrentMonthWidget from './Widgets/SubsPerPlanCurrentMonth'
import RevenuePerPlanWidget from './Widgets/RevenuePerPlan'
import RevenuePerPlanCurrentMonthWidget from './Widgets/RevenuePerPlanCurrentMonth'
import {getFromDate, getToDate} from './Widgets/helper';

class Dashboard extends Component {

  constructor(props) {
    super(props);
    this.state = {}
    this.styles = this.getStyles();
  }

  getStyles() {
    return {
      chartWrapper : {display:'inline-block', margin:'20px'},
      dashboardHeaderContainer: {margin: '-20px auto 10px auto', backgroundColor:'#007666'},
      dashboardHeader: {padding: '15px 50px', justifyContent: 'space-between', display: 'flex', alignItems: 'center'},
      dashboardHeaderTitle: {color: 'white', padding: 0, margin: 0},
      dashboardHeaderDates: {color: 'white', padding: 0, margin: 0},
      chartLoadingPlaceholder: {textAlign: 'center', display: 'table-cell', verticalAlign: 'middle'}
    }
  };

  render() {
    let fromDate = getFromDate(5, 'months');
    let toDate = getToDate();

    return (
      <div className="dashboard" >
        <div className="container" style={this.styles.dashboardHeaderContainer}>
          <div className="header" style={this.styles.dashboardHeader}>
            <h3 style={this.styles.dashboardHeaderTitle}><DashboardIcon color={'white'} style={{verticalAlign: 'top', marginRight: '10px'}}/>Dashboard</h3>
            <h5 style={this.styles.dashboardHeaderDates}>{moment(fromDate).format(globalSetting.dateFormat)} - {moment(toDate).format(globalSetting.dateFormat)}</h5>
          </div>
        </div>
        <div className="container" >
          <ReveneWidget fromDate={fromDate} toDate={toDate}/>
          <RevenueAvgPerSubscriberWidget fromDate={fromDate} toDate={toDate}/>
          <TotalSubscribersWidget fromDate={fromDate} toDate={toDate}/>
          <NewSubscribersWidget fromDate={fromDate} toDate={toDate}/>
          <ChurningSubscribersWidget fromDate={fromDate} toDate={toDate}/>
          <SubsPerPlanWidget fromDate={fromDate} toDate={toDate}/>
          <SubsPerPlanCurrentMonthWidget fromDate={fromDate} toDate={toDate}/>
          <RevenuePerPlanWidget fromDate={fromDate} toDate={toDate}/>
          <RevenuePerPlanCurrentMonthWidget fromDate={fromDate} toDate={toDate}/>
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
