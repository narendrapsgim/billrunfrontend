import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import { Form, FormControl, FormGroup, Col, ControlLabel } from 'react-bootstrap';

const Security = ({ data }) => (
  <div className="Security">
    <Form horizontal>
      <FormGroup controlId="security-key" key="security-key">
        <Col componentClass={ControlLabel} md={2}>
          Secret Key
        </Col>
        <Col sm={6}>
          <FormControl type="text" name="security-key" disabled={true} value={data.get('key', '')} />
        </Col>
      </FormGroup>
    </Form>
  </div>
);

Security.defaultProps = {
  data: Immutable.Map(),
};

Security.propTypes = {
  data: PropTypes.instanceOf(Immutable.Map),
};

export default Security;
