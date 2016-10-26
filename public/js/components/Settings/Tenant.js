import React, { Component } from 'react';
import { Form, FormGroup, Col, FormControl, ControlLabel} from 'react-bootstrap';

export default class Tenant extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { onChange, data } = this.props;


    return (
      <div>
        <Form horizontal>
          <FormGroup controlId='customer-name' key='customer-name'>
            <Col componentClass={ControlLabel} md={3}>
              Company Name
            </Col>
            <Col sm={6}>
              <FormControl type="text"
                           id="customer-name"
                           onChange={ onChange }
                           value={data.get('customerName', '')} />
            </Col>
          </FormGroup>
        </Form>
      </div>
    );
  }
}
