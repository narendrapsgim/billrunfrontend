import React, { Component } from 'react';
import { Panel, Form, FormGroup, Col, FormControl, ControlLabel } from 'react-bootstrap';
import { saveFile } from '../../actions/settingsActions';

export default class Tenant extends Component {

  state = {
    logo: '',
  }

  onChangeField = (e) => {
    const { id, value } = e.target;
    this.props.onChange('tenant', id, value);
  }

  updateLogoPreview = (input) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.setState({ logo: e.target.result });
    };
    reader.readAsDataURL(input);
  }

  uploadFile = (e) => {
    const { files } = e.target;
    if (files.length > 0) {
      saveFile(files[0], { billtype: 'logo' });
      this.props.onChange('tenant', 'logo', e.target.files[0].name);
      this.updateLogoPreview(e.target.files[0]);
    }
  };

  render() {
    const { data } = this.props;
    const logo = this.state.logo.length > 0 ? this.state.logo : this.props.logo;

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
			     onChange={this.uploadFile}
			    />
        { logo.length > 0 && <img src={logo} style={{ height: 100, marginTop: 20 }} alt="Logo" />}
	      </Col>
	    </FormGroup>
          </Form>
        </Panel>
      </div>
    );
  }
}
