import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, FormControl, FormGroup, Col, ControlLabel, HelpBlock, Button } from 'react-bootstrap';
import { ModalWrapper } from '@/components/Elements';


class ResetPassword extends Component {

  static propTypes = {
    show: PropTypes.bool,
    sending: PropTypes.bool,
    onCancel: PropTypes.func.isRequired,
    updateSending: PropTypes.func.isRequired,
    onResetPass: PropTypes.func.isRequired,
  };

  static defaultProps = {
    show: false,
    sending: false,
  };

  state = {
    email: null,
  }

  onChangeEmail = (e) => {
    this.setState({ email: e.target.value });
  }

  onResetPass = () => {
    const { email } = this.state;
    this.props.updateSending(true);
    this.props.onResetPass(email);
  }

  render() {
    const { show, sending } = this.props;
    const label = sending ? 'Sending' : 'Reset';

    return (
      <ModalWrapper title={'Reset Password'} show={show} closeButton onHide={this.props.onCancel}>
        <Form horizontal>
          <FormGroup controlId="username" key="username">
            <Col componentClass={ControlLabel} md={2}>
              Email
            </Col>
            <Col sm={6}>
              <FormControl type="text" name="name" onChange={this.onChangeEmail} value={this.state.email} disabled={sending} />
            </Col>
            <HelpBlock>{'The email you registered as username' }</HelpBlock>
          </FormGroup>
          <Button type="submit" bsStyle="success" bsSize="lg" block onClick={this.onResetPass} disabled={sending}>
            { !sending && (<span><i className="fa fa-envelope-o" /> &nbsp;</span>) }
            { sending && (<span><i className="fa fa-spinner fa-pulse" /> &nbsp;</span>) }
            {label}
          </Button>
        </Form>
      </ModalWrapper>
    );
  }
}

export default ResetPassword;
