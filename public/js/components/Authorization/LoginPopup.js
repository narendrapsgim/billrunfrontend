import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Form,
  FormGroup,
  FormControl,
  Col,
  ControlLabel,
  Button,
  Modal } from 'react-bootstrap/lib';

import {closeLoginPopup, userDoLogin} from '../../actions'

class LoginPopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      showLoginForm: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    // Hide popup after sucess login complete
    if(this.props.auth === false && nextProps.auth == true){
      this.setState({
        showLoginForm: false,
      });
    }
    // change popup display state if action require to change display state
    else if(typeof nextProps.displayPopup !== 'undefined' && nextProps.displayPopup !== this.state.showLoginForm){
      this.setState({ showLoginForm: nextProps.displayPopup });
    }
  }

  handleClose = () => {
    this.props.closeLoginPopup();
  }

  clickLogin = () => {
    const {username, password} = this.state;
    this.props.userDoLogin({username, password});
  }

  onChangeUsername = (e) => {
    const username = e.target.value;
    this.setState({ username })
  }

  onChangePassword = (e) => {
    const password = e.target.value;
    this.setState({ password })
  }

  renderLoginForm = () => {
    return(
      <Form horizontal onSubmit={this.clickLogin}>
        <FormGroup controlId="formHorizontalEmail">
          <Col componentClass={ControlLabel} sm={2}>
            Email
          </Col>
          <Col sm={10}>
            <FormControl autoFocus type="text" placeholder="UserName" value={this.state.username} onChange={this.onChangeUsername}/>
          </Col>
        </FormGroup>

        <FormGroup controlId="formHorizontalPassword">
          <Col componentClass={ControlLabel} sm={2}>
            Password
          </Col>
          <Col sm={10}>
            <FormControl type="password" placeholder="Password" value={this.state.password} onChange={this.onChangePassword} />
          </Col>
        </FormGroup>

      </Form>
    );
  }

  render() {
    const { displayPopup, auth } = this.props;
    if(auth){
      return null;
    }
    return (
      <div>
        <Modal show={displayPopup} onHide={this.handleClose} backdrop='static'>

          <Modal.Header closeButton>
            <Modal.Title>Please Sign In</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {this.renderLoginForm()}
          </Modal.Body>

          <Modal.Footer>
            <Button onClick={this.handleClose}>Close</Button>
            <Button bsStyle="primary" onClick={this.clickLogin}>Sign in</Button>
          </Modal.Footer>

        </Modal>
      </div>
    );
  }
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    closeLoginPopup,
    userDoLogin }, dispatch);
}
function mapStateToProps(state) {
  return {
    auth: state.users.get('auth'),
    displayPopup: state.login.displayPopup,
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(LoginPopup);
