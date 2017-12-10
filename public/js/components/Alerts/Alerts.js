import React, { Component } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { Button } from 'react-bootstrap';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { hideAlert, hideAllAlerts } from '../../actions/alertsActions';
import Alert from './Alert';

class Alerts extends Component {

  static defaultProps = {
    alerts: Immutable.List(),
    clearAllButtobLabel: 'Clear All',
    showClearAllButton: true,
    enterTimeout: 500,
    exitTimeout: 300,
  };

  static propTypes = {
    alerts: React.PropTypes.instanceOf(Immutable.List),
    clearAllButtobLabel: React.PropTypes.string,
    showClearAllButton: React.PropTypes.bool,
    hideAllAlerts: React.PropTypes.func.isRequired,
    hideAlert: React.PropTypes.func.isRequired,
    enterTimeout: React.PropTypes.number,
    exitTimeout: React.PropTypes.number,
  };

  handleAlertsDismiss = () => {
    this.props.hideAllAlerts();
  }

  handleAlertDismiss = (id) => {
    this.props.hideAlert(id);
  }

  renderClearAll = () => (
    <div style={{ textAlign: 'right' }}>
      <Button onClick={this.handleAlertsDismiss}>{this.props.clearAllButtobLabel}</Button>
    </div>
  );

  renderAlert = (alert) => {
    const { enterTimeout, exitTimeout } = this.props;
    return (
      <Alert
        alert={alert}
        handleAlertDismiss={this.handleAlertDismiss}
        key={alert.get('id')}
        transitioTime={(enterTimeout + exitTimeout)}
      />
    );
  }

  render() {
    const { enterTimeout, exitTimeout, alerts: items, showClearAllButton } = this.props;
    const alerts = items.map(this.renderAlert);
    return (
      <div className="alert-notifier-container">
        <ReactCSSTransitionGroup transitionName="alerts" transitionEnterTimeout={enterTimeout} transitionLeaveTimeout={exitTimeout}>
          { alerts }
          { showClearAllButton && alerts.size > 1 && this.renderClearAll()}
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}

const mapDispatchToProps = (
  { hideAllAlerts, hideAlert }
);
const mapStateToProps = state => (
  { alerts: state.alerts }
);
export default connect(mapStateToProps, mapDispatchToProps)(Alerts);
