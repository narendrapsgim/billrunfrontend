import React, {Component} from 'react';
import {Link} from 'react-router';
import { Form, FormGroup, Col, FormControl, ControlLabel} from 'react-bootstrap';

import Select from 'react-select';

import countries from './countries.data.json';

export default class Customer extends Component {
  constructor(props) {
    super(props);

    this.onCountryChange = this.onCountryChange.bind(this);
  }

  onCountryChange(val) {
    var pseudoE = {};
    pseudoE.target = {id: 'country', value: val};
    this.props.onChange(pseudoE);
  }

  render() {
    const {customer, onChange, settings, action} = this.props;

    let options = [];
    countries.forEach((country) => {
      options.push({value: country.name, label: country.name})
    });

    const fields = settings.filter(field => {
      return field.get('display') !== false &&
        field.get('editable') !== false;
    }).map((setting, key) => (

      <FormGroup controlId={setting.get('field_name')}>
        <Col componentClass={ControlLabel} md={3}>
          {setting.get('title') || setting.get('field_name')}
        </Col>
        <Col sm={9}>
          <FormControl type="text"
                       onChange={ onChange }
                       value={ customer.get(setting.get('field_name')) }
          />
        </Col>
      </FormGroup>
    ));

    return (
      <div>
        <div className="row">
          <div className="col-lg-6">
            <Form horizontal>
              { fields }
            </Form>
          </div>
        </div>

        {(() => {
          if (action === "new") return (null);
          return (
            <div className="row" style={{marginBottom: 5}}>
              <hr />
              <div className="col-lg-6">
                see Customer <Link to={`/usage?base={"aid": ${customer.get('aid')}}`}>Usage</Link>
                <br />
                see Customer <Link to={`/invoices?base={"aid": ${customer.get('aid')}}`}>Invoices</Link>
              </div>
            </div>
          );
        })()}
      </div>
    );
  }
}
