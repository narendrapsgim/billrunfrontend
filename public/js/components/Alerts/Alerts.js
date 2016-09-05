import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button } from 'react-bootstrap';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import Alert from './Alert';
import { hideAlert, hideAllAlerts } from '../../actions/alertsActions';

class Alerts extends Component {

  handleAlertsDismiss = () => {
    this.props.hideAllAlerts();
  }

  handleAlertDismiss = (id) => {
    this.props.hideAlert(id);
  }

  renderClearAll = () => {
    return (
      <div style={{textAlign: 'right'}}>
        <Button onClick={this.handleAlertsDismiss}>Clear All</Button>
      </div>
    )
  }

  render(){
		const enterTimeout = 500;
		const exitTimeout = 300;

    const alerts = this.props.alerts.map( (alert) =>
      <Alert
        id={alert.get('id')}
        key={alert.get('id')}
        type={alert.get('type')}
        message={alert.get('message')}
        timeout={alert.get('timeout')}
        transitioTime={(enterTimeout + exitTimeout)}
        handleAlertDismiss={this.handleAlertDismiss}
      />
    );

    return (
      <div className="alert-notifier-container" style={{ width: '50%', position: 'fixed', zIndex: 99999, top: 0, right: 0, padding: 5}}>
        <ReactCSSTransitionGroup transitionName="alerts" transitionEnterTimeout={enterTimeout} transitionLeaveTimeout={exitTimeout}>
          { alerts }
          { alerts.size > 1 ? this.renderClearAll() : null}
        </ReactCSSTransitionGroup>
      </div>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ hideAllAlerts, hideAlert }, dispatch);
}
function mapStateToProps(state) {
  return { alerts: state.alerts }
}
export default connect(mapStateToProps, mapDispatchToProps)(Alerts);
