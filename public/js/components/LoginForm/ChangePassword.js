import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Col, FormGroup, HelpBlock, InputGroup, Form, Panel, Button } from 'react-bootstrap';
import { savePassword } from '../../actions/userActions';
import { showDanger } from '../../actions/alertsActions';
import { idSelector, sigSelector, timestampSelector, usernameSelector } from '../../selectors/entitySelector';
import Field from '../../components/Field';


class ChangePassword extends Component {

  static propTypes = {
    auth: PropTypes.bool,
    itemId: PropTypes.string,
    signature: PropTypes.string,
    timestamp: PropTypes.string,
    username: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    router: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
  };

  static defaultProps = {
    auth: false,
    itemId: '',
    signature: '',
    timestamp: '',
    username: '',
  };

  state = {
    password: '',
    password1: '',
    errors: {
      password: '',
      password1: '',
    },
    sending: false,
  }

  componentWillMount() {
    if (this.props.auth === true) {
      this.props.router.push('/');
    }
  }

  onPasswordChange = (e) => {
    const { errors } = this.state;
    const value = e.target.value.trim();
    let errorMessage = '';
    if (value.length === 0) {
      errorMessage = 'Password is required';
    }
    this.setState({
      errors: Object.assign({}, errors, { password: errorMessage }),
      password: value,
      password1: '',
    });
  };

  validate = () => {
    const { password, password1 } = this.state;
    return (password === password1 && password !== '');
  }

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
    this.setState({
      errors: Object.assign({}, errors, { password1: errorMessage }),
      password1: value,
    });
  };

  onSavePassword = (e) => {
    e.preventDefault();
    const { itemId, signature, timestamp } = this.props;
    const { password } = this.state;

    if (this.validate()) {
      this.setState({ sending: true });
      this.props.dispatch(savePassword(itemId, signature, timestamp, password, 'changepassword')).then(this.afterSave);
    }
  }

  afterSave = (response) => {
    this.setState({ sending: false });
    if (response.status === 1) {
      this.props.router.push('/login');
    }
  }

  render() {
    const { password, password1, errors, sending } = this.state;
    const { username } = this.props;
    const hasError = errors.password.length > 0 || errors.password1.length > 0;

    return (
      <Col md={4} mdOffset={4}>
        <Panel header="Resset Password" className="login-panel">
          <Form>
            <fieldset>
              <FormGroup>
                <InputGroup>
                  <InputGroup.Addon><i className="fa fa-user fa-fw" /></InputGroup.Addon>
                  <Field value={username} disabled={true} />
                </InputGroup>
              </FormGroup>
              <FormGroup validationState={hasError ? 'error' : null} >
                <InputGroup>
                  <InputGroup.Addon><i className="fa fa-key fa-fw" /></InputGroup.Addon>
                  <Field onChange={this.onPasswordChange} value={password} type="password" disabled={sending} placeholder="New password" />
                </InputGroup>
                { errors.password.length > 0 && <HelpBlock>{errors.password}</HelpBlock> }
              </FormGroup>
              <FormGroup validationState={errors.password1.length > 0 ? 'error' : null} >
                <InputGroup>
                  <InputGroup.Addon><i className="fa fa-key fa-fw" /></InputGroup.Addon>
                  <Field onChange={this.onPassword1Change} value={password1} type="password" disabled={sending} placeholder="Confirm new password" />
                </InputGroup>
                { errors.password1.length > 0 && <HelpBlock>{errors.password1}</HelpBlock> }
              </FormGroup>
            </fieldset>
            <Button type="submit" bsStyle="primary" bsSize="lg" block onClick={this.onSavePassword} disabled={sending}>
              { sending && (<span><i className="fa fa-spinner fa-pulse" /> &nbsp;</span>) }
              Save
            </Button>
          </Form>
        </Panel>
      </Col>
    );
  }

}

const mapStateToProps = (state, props) => ({
  itemId: idSelector(state, props),
  signature: sigSelector(state, props),
  timestamp: timestampSelector(state, props),
  username: usernameSelector(state, props),
  auth: state.user.get('auth'),
});

export default withRouter(connect(mapStateToProps)(ChangePassword));
