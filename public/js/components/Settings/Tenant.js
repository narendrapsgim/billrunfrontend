import React, { Component } from 'react';
import { Panel, Form, FormGroup, Col, FormControl, ControlLabel} from 'react-bootstrap';

export default class Tenant extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { onChange, data } = this.props;


    return (
      <div>
        <Panel header="Company Details">
          <Form horizontal>
            <FormGroup controlId='company-name' key='company-name'>
              <Col componentClass={ControlLabel} md={2}>
                Name
              </Col>
              <Col sm={6}>
                <FormControl type="text"
                             name="company-name"
                             onChange={ onChange }
                             value={data.get('companyName', '')}/>
              </Col>
            </FormGroup>

            <FormGroup controlId='company-address' key='company-address'>
              <Col componentClass={ControlLabel} md={2}>
                Address
              </Col>
              <Col sm={6}>
                <FormControl componentClass="textarea"
                             name="company-address"
                             onChange={ onChange }
                             value={data.get('companyAddress', '')}/>

              </Col>
            </FormGroup>

            <FormGroup controlId='company-phone' key='company-phone'>
              <Col componentClass={ControlLabel} md={2}>
                Phone
              </Col>
              <Col sm={6}>
                <FormControl type="text"
                             name="company-phone"
                             onChange={ onChange }
                             value={data.get('phone', '')}/>
              </Col>
            </FormGroup>

            <FormGroup controlId='company-email' key='company-email'>
              <Col componentClass={ControlLabel} md={2}>
                Email
              </Col>
              <Col sm={6}>
                <FormControl type="email"
                             name="company-email"
                             onChange={ onChange }
                             value={data.get('phone', '')}/>
              </Col>
            </FormGroup>

            <FormGroup controlId='company-website' key='company-website'>
              <Col componentClass={ControlLabel} md={2}>
                Website
              </Col>
              <Col sm={6}>
                <FormControl type="email"
                             name="company-website"
                             onChange={ onChange }
                             value={data.get('phone', '')}/>
              </Col>
            </FormGroup>
          </Form>
        </Panel>
      </div>
    );
  }
}
