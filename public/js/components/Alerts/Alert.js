import React, { Component } from 'react';
import { Alert as BootstrapAlert } from 'react-bootstrap';

import { SUCCESS, DANGER, INFO, WARNING } from '../../actions/alertsActions';


export default class Alert extends Component {

  componentDidMount() {
    const { timeout, transitioTime } = this.props;

    if (timeout > 0) {
      clearTimeout(this.autoHideTimer);
      this.autoHideTimer = setTimeout( () => {
        this.handleAlertDismiss();
      }, timeout + transitioTime);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.autoHideTimer);
  }

  handleAlertDismiss = () => {
    const { id } = this.props;
    this.props.handleAlertDismiss(id);
  }

  render() {
    const { type, message } = this.props;
    const alertType = [SUCCESS, DANGER, INFO, WARNING].includes(type) ? type : INFO ;

    return (
      <BootstrapAlert bsStyle={alertType} onDismiss={this.handleAlertDismiss}>
        <div>{message}</div>
      </BootstrapAlert>
    );
  }
}
