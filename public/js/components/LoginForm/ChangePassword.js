import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Col, FormGroup, HelpBlock, ControlLabel, Row, Form, Panel, Button } from 'react-bootstrap';
import { savePassword } from '../../actions/userActions';
import { showWarning, showSuccess, showDanger } from '../../actions/alertsActions';
import { idSelector, sigSelector, timestampSelector } from '../../selectors/entitySelector';


class ChangePassword extends Component {

  static propTypes = {
    itemId: PropTypes.string,
    signature: PropTypes.string,
    timestamp: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    router: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
  };

  static defaultProps = {
    itemId: '',
    signature: '',
    timestamp: '',
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

  onSavePassword = () => {
    const { itemId, signature, timestamp } = this.props;
    const { password } = this.state;

    if (this.validate()) {
      this.setState({ sending: true });
      this.props.dispatch(savePassword(itemId, signature, timestamp, password, 'changepassword')).then(this.afterSave);
    } else {
      this.props.dispatch(showWarning("Passwords doesn't much or empty"));
    }
  }

  afterSave = () => {
    this.props.router.push('/login');
  }

  renderChangePassword = () => {
    const { password, password1, errors, sending } = this.state;
    const hasError = errors.password.length > 0 || errors.password1.length > 0;

    return (
      <Col md={4} mdOffset={4}>
        <Panel header="Choose New Password">
          <span>
            <FormGroup validationState={hasError ? 'error' : null} >
              <Col componentClass={ControlLabel} sm={3} lg={2}>Password</Col>
              <Col sm={8} lg={9}>
                <input onChange={this.onPasswordChange} value={password} className="form-control" id="password" type="password" disabled={sending} />
                { errors.password.length > 0 && <HelpBlock>{errors.password}</HelpBlock> }
              </Col>
            </FormGroup>
            <FormGroup validationState={errors.password1.length > 0 ? 'error' : null} >
              <Col componentClass={ControlLabel} sm={3} lg={2}>Confirm</Col>
              <Col sm={8} lg={9}>
                <input onChange={this.onPassword1Change} value={password1} className="form-control" id="password1" type="password" disabled={sending} />
                { errors.password1.length > 0 && <HelpBlock>{errors.password1}</HelpBlock> }
              </Col>
            </FormGroup>
            <Button bsStyle="primary" bsSize="lg" block onClick={this.onSavePassword} disabled={sending}>
              { sending && (<span><i className="fa fa-spinner fa-pulse" /> &nbsp;</span>) }
              Save
            </Button>
          </span>
        </Panel>
      </Col>
    );
  }

  render() {
    return (
      <Row>
        <Col lg={12}>
          <Form horizontal>
            {this.renderChangePassword()}
          </Form>
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = (state, props) => ({
  itemId: idSelector(state, props),
  signature: sigSelector(state, props),
  timestamp: timestampSelector(state, props),
});

export default withRouter(connect(mapStateToProps)(ChangePassword));
