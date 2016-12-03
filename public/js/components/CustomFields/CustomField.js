import React from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';

import { Row, Col, FormGroup, ControlLabel, Button } from 'react-bootstrap';
import Field from '../Field';

class CustomField extends React.Component {
  static propTypes = {
    field: React.PropTypes.instanceOf(Immutable.Map),
    entity: React.PropTypes.string.isRequired,
    index: React.PropTypes.number.isRequired,  
    last: React.PropTypes.bool,
  };

  static defaultProps = {
    last: false
  };

  constructor(props) {
    super(props);
  }

  onChange = (e) => {
    const { entity, index } = this.props;
    const { id, value } = e.target;
    this.props.onChange(entity, index, id, value);
  };

  onRemove = () => {
    const { entity, index } = this.props;
    this.props.onRemove(entity, index);
  };

  render() {
    const { field, entity, index, last } = this.props;

    return (
      <div className="CustomField">
        <Row>
          <Col lg={3} md={3}>
            <FormGroup>
              <ControlLabel>Field Name</ControlLabel>
              <Field
                  id="field_name"
                  onChange={ this.onChange }
                  value={ field.get('field_name', '') }
              />
            </FormGroup>
          </Col>
          <Col lg={3} md={3}>
            <FormGroup>
              <ControlLabel>Title</ControlLabel>
              <Field
                  id="title"
                  onChange={ this.onChange }
                  value={ field.get('title', '') }
              />
            </FormGroup>
          </Col>
          <Col lg={3} md={3}>
            <FormGroup>
              <ControlLabel>Default Value</ControlLabel>
              <Field
                  id="default_value"
                  onChange={ this.onChange }
                  value={ field.get('default_value', '') }
              />
            </FormGroup>
          </Col>
          <Col lgOffset={1} lg={2} md={2}>
            <FormGroup>
              <ControlLabel>&nbsp;</ControlLabel>
              <div>
                <Button onClick={ this.onRemove } bsSize="small">
                  <i className="fa fa-trash-o danger-red"/> Remove
                </Button>
              </div>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col lg={2} md={2}>
            <FormGroup>
              <Field
                  id="unique"
                  onChange={ this.onChange }
                  value={ field.get('unique', false) }
                  fieldType="checkbox"
                  label="Unique"
              />
            </FormGroup>
          </Col>
          <Col lg={2} md={2}>
            <FormGroup>
              <Field
                  id="mandatory"
                  onChange={ this.onChange }
                  value={ field.get('mandatory', false) }
                  fieldType="checkbox"
                  label="Mandatory"
              />
            </FormGroup>
          </Col>
          <Col lg={2} md={2}>
            <FormGroup>
              <Field
                  id="editable"
                  onChange={ this.onChange }
                  value={ field.get('editable', false) }
                  fieldType="checkbox"
                  label="Editable"
              />
            </FormGroup>
          </Col>        
          <Col lg={2} md={2}>
            <FormGroup>
              <Field
                  id="display"
                  onChange={ this.onChange }
                  value={ field.get('display', false) }
                  fieldType="checkbox"
                  label="Display"
              />
            </FormGroup>
          </Col>
          <Col lg={2} md={2}>
            <FormGroup>
              <Field
                  id="show_in_list"
                  onChange={ this.onChange }
                  value={ field.get('show_in_list', false) }
                  fieldType="checkbox"
                  label="Show in list"
              />
            </FormGroup>
          </Col>
          <Col lg={2} md={2}>
            <FormGroup>
              <Field
                  id="select_list"
                  onChange={ this.onChange }
                  value={ field.get('select_list', false) }
                  fieldType="checkbox"
                  label="Select list"
              />
            </FormGroup>
          </Col>
        </Row>
        { !last && <hr style={{ marginTop: 10, marginBottom: 10 }}/> }
      </div>
    );
  }
}

export default connect()(CustomField);
