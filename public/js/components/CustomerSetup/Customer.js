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
    const {customer, onChange, settings, action, invalidFields} = this.props;

    //in update mode wait for item before render edit screen
    if(action === 'update' && typeof customer.getIn(['_id', '$id']) === 'undefined'){
      return ( <div> <p>Loading...</p> </div> );
    }

    let options = [];
    countries.forEach((country) => {
      options.push({value: country.name, label: country.name})
    });

    const fields = settings.filter(field => {
      return field.get('display') !== false &&
             field.get('editable') !== false;
    }).map((setting, key) => {
      let invalid = invalidFields
        .filter(invf => invf.get('name') === setting.get('field_name'))
        .size > 0;
      let validationState = invalid ? {validationState: "error"} : {};
      return (
        <FormGroup { ...validationState }
                   controlId={setting.get('field_name')}
                   key={key}>
          <Col componentClass={ControlLabel} md={2}>
            {setting.get('title') || setting.get('field_name')}
          </Col>
          <Col sm={7}>
            <FormControl type="text"
                         onChange={ onChange }
                         value={ customer.get(setting.get('field_name')) }
            />
          </Col>
        </FormGroup>
      );
    });

    return (
      <div className="Customer">
        <Form horizontal>
          { fields }
        </Form>
        {(action !== "new") &&
          <div>
            <hr />
            <p>See Customer <Link to={`/usage?base={"aid": ${customer.get('aid')}}`}>Usage</Link></p>
            <p>See Customer <Link to={`/invoices?base={"aid": ${customer.get('aid')}}`}>Invoices</Link></p>
          </div>
        }
      </div>
    );
  }
}
