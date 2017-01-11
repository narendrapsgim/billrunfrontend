import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import Select from 'react-select';
import { Form, FormGroup, ControlLabel, Col, Row, HelpBlock } from 'react-bootstrap';
import Field from '../Field';


export default class User extends Component {

  static propTypes = {
    user: PropTypes.instanceOf(Immutable.Map),
    action: PropTypes.string,
    onUpdateValue: PropTypes.func.isRequired,
    onDeleteValue: PropTypes.func.isRequired,
  }

  static defaultProps = {
    user: Immutable.Map(),
    action: 'new',
  };

  state = {
    enableChangePassword: this.props.action === 'new',
    password: '',
    password1: '',
    errors: {
      password: '',
      password1: '',
    },
  }

  componentDidMount() {
    const { action } = this.props;
    if (action === 'new') {
      this.initDefaultValues();
    } else {
      this.props.onDeleteValue('password'); // remove user hashed password, to not send it back to BE on save
    }
  }

  onPasswordChange = (e) => {
    const { errors } = this.state;
    const value = e.target.value.trim();
    let errorMessage = '';
    if (value.length === 0) {
      errorMessage = 'Password is required';
    }
    this.props.onUpdateValue('password', '');
    this.setState({
      errors: Object.assign({}, errors, { password: errorMessage }),
      password: value,
      password1: '',
    });
  };

  onPassword1Change = (e) => {
    const { errors, password } = this.state;
    const value = e.target.value.trim();

    let errorMessage = '';
    if (value.length === 0) {
      errorMessage = 'Please fill confirm password';
    }
    if (value !== password) {
      errorMessage = 'Passwords do not match';
    }

    if (errorMessage.length === 0) {
      this.props.onUpdateValue('password', value);
    } else {
      this.props.onUpdateValue('password', '');
    }
    this.setState({
      errors: Object.assign({}, errors, { password1: errorMessage }),
      password1: value,
    });
  };

  onUserNameChange = (e) => {
    const { value } = e.target;
    this.props.onUpdateValue('username', value);
  }

  onChangeRoles = (roles) => {
    const userRoles = roles.length > 0 ? roles.split(',') : [];
    this.props.onUpdateValue('roles', userRoles);
  }

  onEnableChangePassword = (e) => {
    const { errors } = this.state;
    const { checked } = e.target;
    if (!checked) {
      this.props.onDeleteValue('password');
      this.setState({
        enableChangePassword: checked,
        errors: Object.assign({}, errors, { password1: '', password: '' }),
        password: '',
        password1: '',
      });
    } else {
      this.props.onUpdateValue('password', '');
      this.setState({ enableChangePassword: checked });
    }
  }

  initDefaultValues = () => {
    this.props.onUpdateValue('roles', ['read']);
  }

  renderChangePassword = () => {
    const { action } = this.props;
    const { password, password1, enableChangePassword, errors } = this.state;
    const hasError = errors.password.length > 0 || errors.password1.length > 0;

    return (
      <span>
        { action !== 'new' &&
        <FormGroup validationState={hasError ? 'error' : null} >
          <Col componentClass={ControlLabel} sm={3} lg={2}>&nbsp;</Col>
          <Col sm={8} lg={9}>
            <label>
              <input type="checkbox" checked={enableChangePassword} onChange={this.onEnableChangePassword} style={{ verticalAlign: 'text-bottom' }} />
              &nbsp;Enable Password Change
            </label>
          </Col>
        </FormGroup>
      }

        <FormGroup validationState={hasError ? 'error' : null} >
          <Col componentClass={ControlLabel} sm={3} lg={2}>Password</Col>
          <Col sm={8} lg={9}>
            <input onChange={this.onPasswordChange} value={password} className="form-control" id="password" type="password" disabled={!enableChangePassword} />
            { errors.password.length > 0 && <HelpBlock>{errors.password}</HelpBlock> }
          </Col>
        </FormGroup>
        <FormGroup validationState={errors.password1.length > 0 ? 'error' : null} >
          <Col componentClass={ControlLabel} sm={3} lg={2}>Confirm Password</Col>
          <Col sm={8} lg={9}>
            <input onChange={this.onPassword1Change} value={password1} className="form-control" id="password1" type="password" disabled={!enableChangePassword} />
            { errors.password1.length > 0 && <HelpBlock>{errors.password1}</HelpBlock> }
          </Col>
        </FormGroup>
      </span>
    );
  }

  render() {
    const { user } = this.props;
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
                <Field onChange={this.onUserNameChange} value={user.get('username', '')} />
              </Col>
            </FormGroup>

            <FormGroup>
              <Col componentClass={ControlLabel} sm={3} lg={2}>Roles</Col>
              <Col sm={8} lg={9}>
                <Select
                  multi={true}
                  value={user.get('roles', []).join(',')}
                  options={availableRoles}
                  onChange={this.onChangeRoles}
                  placeholder="Add role..."
                />
              </Col>
            </FormGroup>

            {this.renderChangePassword()}

          </Form>
        </Col>
      </Row>
    );
  }
}
