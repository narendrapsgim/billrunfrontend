import React, { Component } from 'react';
import { Alert as BootstrapAlert } from 'react-bootstrap';
import { SUCCESS, DANGER, INFO, WARNING } from '../../actions/alertsActions';


export default class Alert extends Component {

  static defaultProps = {
    transitioTime: 0,
  };

  static propTypes = {
    alert: React.PropTypes.shape({
      id: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.number,
      ]).isRequired,
      message: React.PropTypes.string.isRequired,
      type: React.PropTypes.string.isRequired,
      timeout: React.PropTypes.number,
    }).isRequired,
    handleAlertDismiss: React.PropTypes.func.isRequired,
    transitioTime: React.PropTypes.number,
  }

  constructor(props) {
    super(props);
    this.autoHideTimer = null;
  }

  componentDidMount() {
    const { alert: { timeout }, transitioTime } = this.props;
    if (timeout > 0) {
      clearTimeout(this.autoHideTimer);
      this.autoHideTimer = setTimeout(this.handleAlertDismiss, timeout + transitioTime);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.autoHideTimer);
  }

  handleAlertDismiss = () => {
    const { alert: { id } } = this.props;
    this.props.handleAlertDismiss(id);
  }

  render() {
    const { alert: { type, message } } = this.props;
    const alertType = [SUCCESS, DANGER, INFO, WARNING].includes(type) ? type : INFO;
    return (
      <BootstrapAlert bsStyle={alertType} onDismiss={this.handleAlertDismiss}>
        <div>{message}</div>
      </BootstrapAlert>
    );
  }
}
