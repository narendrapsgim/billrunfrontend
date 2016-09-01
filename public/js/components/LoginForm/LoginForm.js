import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';

import {
  Form,
  Alert,
  FormGroup,
  FormControl,
  Panel,
  Col,
  Row } from 'react-bootstrap';
import { Conflict_409 } from '../Errors';
import { userDoLogin } from '../../actions/userActions';

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      error: ''
    };
  }

  componentWillReceiveProps(nextProps) {
    if(this.state.error !== nextProps.error){
      this.setState({ error: nextProps.error });
    }
  }

  clickLogin = (e) => {
    e.preventDefault()
    const {username, password} = this.state;
    this.props.userDoLogin(username, password);
  }

  onChangeUsername = (e) => {
    const username = e.target.value;
    this.setState({ username, error:'' })
  }

  onChangePassword = (e) => {
    const password = e.target.value;
    this.setState({ password, error:'' })
  }

  renderLoginForm = () => {
    const { error } = this.state;
    return (
      <Col md={4} mdOffset={4}>
        <Panel header="Please Sign In">
            <Form onSubmit={this.clickLogin}>
                <fieldset>
                    <FormGroup validationState={error.length > 0 ? "error" : '' }>
                      <FormControl
                        autoFocus
                        type="text"
                        placeholder="User Name"
                        value={this.state.username}
                        onChange={this.onChangeUsername}
                      />
                    </FormGroup>
                    <FormGroup validationState={error.length > 0 ? "error" : '' }>
                      <FormControl
                        type="password"
                        placeholder="Password"
                        value={this.state.password}
                        onChange={this.onChangePassword}
                      />
                    </FormGroup>
                    { (error.length > 0) ? <Alert bsStyle="danger">{error}</Alert> : ''}
                    <a href="#" className="btn btn-lg btn-success btn-block" onClick={this.clickLogin}>Login</a>
                </fieldset>
            </Form>
        </Panel>
      </Col>
    );
  }

  renderAlreadyLogin = () => {
    return ( <Conflict_409 /> );
  }

  render() {
    const { auth } = this.props;
    return ( <Row> { auth ? this.renderAlreadyLogin() : this.renderLoginForm() } </Row> );
  }
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    userDoLogin }, dispatch);
}
function mapStateToProps(state) {
  const error = state.user.get('error');
  return {
      auth: state.user.get('auth'),
      error,
      forceReloadState: (error.length) ? new Date() : '', //force reload state because if the error message is same componentWillReceiveProps will not call
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
