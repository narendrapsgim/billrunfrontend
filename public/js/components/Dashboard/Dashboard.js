import React, { Component } from 'react';
import { connect } from 'react-redux';
import CircularProgress from 'material-ui/CircularProgress';
import FontIcon from 'material-ui/FontIcon';
import moment from 'moment';
import { getData } from '../../actions/dashboardActions';
import TotalSubscribersWidget from './Widgets/TotalSubscribers';
import NewSubscribersWidget from './Widgets/NewSubscribers';
import ChurningSubscribersWidget from './Widgets/ChurningSubscribers';
import ReveneWidget from './Widgets/Revene';
import RevenueAvgPerSubscriberWidget from './Widgets/RevenueAvgPerSubscriber';
import SubsPerPlanWidget from './Widgets/SubsPerPlan';
import SubsPerPlanCurrentMonthWidget from './Widgets/SubsPerPlanCurrentMonth';
import RevenuePerPlanWidget from './Widgets/RevenuePerPlan';
import RevenuePerPlanCurrentMonthWidget from './Widgets/RevenuePerPlanCurrentMonth';
import MapSubscribersWidget from './Widgets/MapSubscribers';
import {getFromDate, getToDate} from './Widgets/helper';


class Dashboard extends Component {

  constructor(props) {
    super(props);
    let today = new Date();
    let fromDate = new Date(moment(today).add(-5,'months').startOf('month').startOf('hour').startOf('minute').startOf('second'));
    this.state = {
      fromDate: fromDate,
      toDate: today,
    }
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
    const {fromDate, toDate} = this.state;

    return (
      <div className="dashboard" >
        <div className="container" style={this.styles.dashboardHeaderContainer}>
          <div className="header" style={this.styles.dashboardHeader}>
            <h3 style={this.styles.dashboardHeaderTitle} className="cursor-default">
              <FontIcon className="material-icons" color={'white'} style={{verticalAlign: 'top', marginRight: '10px'}}>dashboard</FontIcon>
              Dashboard
            </h3>
            {/*<h5 style={this.styles.dashboardHeaderDates} className="cursor-default">
              <FontIcon className="material-icons" color={'white'} style={{verticalAlign: 'bottom', marginRight: '10px'}}>date_range</FontIcon>
              {moment(fromDate).format(globalSetting.dateFormat)} - {moment(toDate).format(globalSetting.dateFormat)}
            </h5>*/}
          </div>
        </div>
        <div className="container" >
          <MapSubscribersWidget fromDate={fromDate} toDate={toDate}/>
          <ReveneWidget fromDate={fromDate} toDate={toDate} width={565}/>
          <RevenueAvgPerSubscriberWidget fromDate={fromDate} toDate={toDate} width={565}/>
          <TotalSubscribersWidget fromDate={fromDate} toDate={toDate} width={370}/>
          <NewSubscribersWidget fromDate={fromDate} toDate={toDate} width={370}/>
          <ChurningSubscribersWidget fromDate={fromDate} toDate={toDate} width={370}/>
          <SubsPerPlanWidget fromDate={fromDate} toDate={toDate} width={565}/>
          <SubsPerPlanCurrentMonthWidget fromDate={fromDate} toDate={toDate} width={565}/>
          <RevenuePerPlanWidget fromDate={fromDate} toDate={toDate} width={565}/>
          <RevenuePerPlanCurrentMonthWidget fromDate={fromDate} toDate={toDate} width={565}/>
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
