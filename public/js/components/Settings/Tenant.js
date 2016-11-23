import React, { Component } from 'react';
import { Panel, Form, FormGroup, Col, FormControl, ControlLabel} from 'react-bootstrap';

import { apiBillRun } from '../../common/Api';

export default class Tenant extends Component {
  constructor(props) {
    super(props);
  }

  onChangeField = (e) => {
    const { id, value } = e.target;
    this.props.onChange('tenant', id, value);
  }

  onSelectLogo = (e) => {
    const file = e.target.files[0],
          reader = new FileReader(),
          url = 'http://billrun/api/logo';
    
    reader.onload = (e) => {
      const formData = new FormData();
      formData.append('query', JSON.stringify({'filename': e.currentTarget.result}));
      formData.append('action', 'save');
      fetch( url, {
        method: 'post',
        headers: {
          "Content-Type": "application/json"
        },
        body: formData
      })
        .then( data => {
          console.log( 'Request succeeded with JSON response', data );
        })
        .catch( error => {
          console.log( 'Request failed', error );
        });
    };
    reader.readAsText( file );
  }

  shitFunction() {
    const formData = new FormData();
    formData.append('action', 'save')
    formData.append('query', JSON.stringify({filename: e.target.files[0].name}));
    const query = {
      api: "logo",
      options: {
        method: "POST",
        body: formData
      },
    };

    apiBillRun(query).then(
      success => {
        console.log("success", success);
      },
      failure => {
        console.log("failure", failure);
      }
    ).catch(
      error => {
        console.log("!CATCH!", error);
      }
    );
  };

  render() {
    const { data } = this.props;

    return (
      <div className="Tenant">
        <Panel header="Company Details">
          <Form horizontal>
            <FormGroup controlId='name' key='name'>
              <Col componentClass={ControlLabel} md={2}>
                Name
              </Col>
              <Col sm={6}>
                <FormControl type="text"
                             name="name"
                             onChange={this.onChangeField}
                             value={data.get('name', '')}/>
              </Col>
            </FormGroup>

            <FormGroup controlId='address' key='address'>
              <Col componentClass={ControlLabel} md={2}>
                Address
              </Col>
              <Col sm={6}>
                <FormControl componentClass="textarea"
                             name="address"
                             onChange={this.onChangeField}
                             value={data.get('address', '')}/>

              </Col>
            </FormGroup>

            <FormGroup controlId='phone' key='phone'>
              <Col componentClass={ControlLabel} md={2}>
                Phone
              </Col>
              <Col sm={6}>
                <FormControl type="text"
                             name="phone"
                             onChange={this.onChangeField}
                             value={data.get('phone', '')}/>
              </Col>
            </FormGroup>

            <FormGroup controlId='email' key='email'>
              <Col componentClass={ControlLabel} md={2}>
                Email
              </Col>
              <Col sm={6}>
                <FormControl type="email"
                             name="email"
                             onChange={this.onChangeField}
                             value={data.get('email', '')}/>
              </Col>
            </FormGroup>

            <FormGroup controlId='website' key='website'>
              <Col componentClass={ControlLabel} md={2}>
                Website
              </Col>
              <Col sm={6}>
                <FormControl type="text"
                             name="website"
                             onChange={this.onChangeField}
                             value={data.get('website', '')}/>
              </Col>
            </FormGroup>
	    <FormGroup>
	      <Col componentClass={ControlLabel} md={2}>
		Logo
	      </Col>
	      <Col sm={6}>
		<FormControl type="file"
			     name="logo"
			     onChange={this.onSelectLogo}
			     value={data.get('logo', '')} />
	      </Col>
	    </FormGroup>
          </Form>
        </Panel>
      </div>
    );
  }
}
