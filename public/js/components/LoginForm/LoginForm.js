import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Form, FormGroup, FormControl, InputGroup, Button, Alert, Panel, Col, Row } from 'react-bootstrap';
import { Conflict_409 as Conflict409 } from '../Errors';
import { userDoLogin, sendResetMail } from '../../actions/userActions';
import ResetPassword from '../LoginForm/ResetPassword';

class LoginForm extends Component {

  static propTypes = {
    auth: PropTypes.bool,
    error: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
    dispatch: PropTypes.func.isRequired,
  };

  static defaultProps = {
    auth: false,
    error: '',
  };

  state = {
    username: '',
    password: '',
    error: '',
    progress: false,
    resetPassword: false,
    sending: false,
  };

  componentWillReceiveProps(nextProps) {
    if (this.state.error !== nextProps.error) {
      this.setState({ error: nextProps.error });
    }
  }

  componentWillUnmount() {
    this.unmounted = true;
  }


  clickLogin = (e) => {
    const { username, password } = this.state;
    this.setState({ progress: true });
    e.preventDefault();
    this.props.dispatch(userDoLogin(username, password))
      .then(() => {
        if (this.unmounted !== true) {
          this.setState({ progress: false });
        }
      });
  }

  clickResetPassword = () => {
    this.setState({ resetPassword: true });
  }

  onChangeUsername = (e) => {
    const { value } = e.target;
    this.setState({ username: value, error: '' });
  }

  onChangePassword = (e) => {
    const { value } = e.target;
    this.setState({ password: value, error: '' });
  }

  onCancel = () => {
    this.setState({ resetPassword: false });
  }

  updateSending = (sending) => {
    this.setState({ sending });
  }

  onResetPass = (email) => {
    this.props.dispatch(sendResetMail(email)).then(this.afterSendingMail);
  }

  afterSendingMail = () => {
    this.setState({ sending: false });
    this.setState({ resetPassword: false });
  }

  renderLoginForm = () => {
    const { error, progress, resetPassword, sending } = this.state;
    return (
      <Col md={4} mdOffset={4}>
        <Panel header="Please Sign In" className="login-panel">
          <Form onSubmit={this.clickLogin}>
            <fieldset>
              <FormGroup validationState={error.length > 0 ? 'error' : null}>
                <InputGroup>
                  <InputGroup.Addon><i className="fa fa-user fa-fw" /></InputGroup.Addon>
                  <FormControl
                    autoFocus
                    type="text"
                    placeholder="User Name"
                    value={this.state.username}
                    onChange={this.onChangeUsername}
                  />
                </InputGroup>
              </FormGroup>

              <FormGroup validationState={error.length > 0 ? 'error' : null}>
                <InputGroup>
                  <InputGroup.Addon><i className="fa fa-key fa-fw" /></InputGroup.Addon>
                  <FormControl
                    type="password"
                    placeholder="Password"
                    value={this.state.password}
                    onChange={this.onChangePassword}
                  />
                </InputGroup>
              </FormGroup>
              <Button type="submit" bsStyle="success" bsSize="large" block onClick={this.clickLogin} disabled={progress}>
                { progress && (<span><i className="fa fa-spinner fa-pulse" /> &nbsp;&nbsp;&nbsp;</span>) }
                Login
              </Button>
            </fieldset>&nbsp;&nbsp;&nbsp;&nbsp;
            <Button type="button" bsStyle="link" bsSize="small" block onClick={this.clickResetPassword} disabled={progress}>
              Forgot Your Password?
            </Button>
          </Form>
          { (error.length > 0) ? <Alert bsStyle="danger">{error}</Alert> : ''}
        </Panel>
        { <ResetPassword show={resetPassword} sending={sending} updateSending={this.updateSending} onCancel={this.onCancel} onResetPass={this.onResetPass} /> }
      </Col>
    );
  }

  render() {
    const { auth } = this.props;
    if (auth) {
      return (
        <Conflict409 />
      );
    }
    return (
      <Row>{this.renderLoginForm()}</Row>
    );
  }

}


const mapStateToProps = state => ({
  auth: state.user.get('auth'),
  error: state.user.get('error'),
});

export default connect(mapStateToProps)(LoginForm);
