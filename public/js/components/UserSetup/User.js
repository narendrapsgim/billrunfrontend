import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import Select from 'react-select';
import { Form, FormGroup, ControlLabel, Col, Row, Panel, Checkbox, Button, HelpBlock } from 'react-bootstrap';
import Field from '../Field';


export default class User extends Component {

  static propTypes = {
    user: PropTypes.instanceOf(Immutable.Map),
    action: PropTypes.string,
    onSaveUser: PropTypes.func.isRequired,
    onUsernameChange: PropTypes.func.isRequired,
    onCheckboxClick: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
  }

  static defaultProps = {
    user: Immutable.Map(),
    action: 'new',
  };

  state = {
    disableSave: this.props.action === 'new',
    showPassMessage: false,
    password: '',
    password1: '',
    errors: {
      password: '',
      password1: '',
    },
  }

  onSaveUser = () => {
    this.props.onSaveUser(this.state.password);
  }

  onCancel = () => {
    this.props.onCancel();
  }

  onChangePassword = () => {
    console.log('onChangePassword...');
  }

  onPasswordChange = (e) => {
    const { errors } = this.state;
    const { value } = e.target;
    let errorMessage = '';
    if (!value.trim()) {
      errorMessage = 'Password is required';
    }
    this.setState({
      errors: Object.assign({}, errors, { password: errorMessage }),
      password: value,
    });
  };

  onPassword1Change = (e) => {
    const { errors, password } = this.state;
    const { value } = e.target;
    let errorMessage = '';

    if (!value.trim()) {
      errorMessage = 'Please fill confirm password';
    }
    if (value.trim() !== password) {
      errorMessage = 'Passwords do not match';
    }
    this.setState({
      errors: Object.assign({}, errors, { password1: errorMessage }),
      password1: value,
    });
  };

  renderChangePassword = () => {
    const { password, password1, errors } = this.state;
    const hasError = errors.password.length > 0 || errors.password1.length > 0;
    return (
      <span>
        <FormGroup validationState={hasError ? 'error' : null} >
          <Col componentClass={ControlLabel} sm={3} lg={2}>Password</Col>
          <Col sm={8} lg={9}>
            <input onChange={this.onPasswordChange} value={password} className="form-control" id="password" type="password" />
            { errors.password.length > 0 && <HelpBlock>{errors.password}</HelpBlock> }
          </Col>
        </FormGroup>
        <FormGroup validationState={errors.password1.length > 0 ? 'error' : null} >
          <Col componentClass={ControlLabel} sm={3} lg={2}>Confirm Password</Col>
          <Col sm={8} lg={9}>
            <input onChange={this.onPassword1Change} value={password1} className="form-control" id="password1" type="password" />
            { errors.password1.length > 0 && <HelpBlock>{errors.password1}</HelpBlock> }
          </Col>
        </FormGroup>
      </span>
    );
  }

  render() {
    const { user, action } = this.props;
    const { showPassMessage } = this.state;
    const availableRoles = ['admin', 'read', 'write'].map(role => ({
      value: role,
      label: role,
    }));
    return (
      <Row>
        <Col lg={12}>
          <Form horizontal>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3} lg={2}>User Name</Col>
              <Col sm={8} lg={9}>
                <Field onChange={this.props.onUsernameChange} value={user.get('username', '')} />
              </Col>
            </FormGroup>
            { action === 'new' && this.renderChangePassword() }
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3} lg={2}>Roles</Col>
              <Col sm={8} lg={9}>
                <Select
                  multi={true}
                  value={user.get('roles', []).join(',')}
                  options={availableRoles}
                  onChange={this.props.onCheckboxClick}
                  placeholder="Add role..."
                />
              </Col>
            </FormGroup>
            { showPassMessage && <div className="alert alert-danger">{showPassMessage}</div>}
          </Form>
        </Col>
      </Row>
    );
  }
}
