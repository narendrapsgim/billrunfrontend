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
          <Col lg={1} md={1}>
            <FormGroup>
              <ControlLabel>Unique</ControlLabel>
              <Field
                  id="unique"
                  onChange={ this.onChange }
                  value={ field.get('unique', false) }
                  fieldType="checkbox"
              />
            </FormGroup>
          </Col>
          <Col lg={1} md={1}>
            <FormGroup>
              <ControlLabel>Mandatory</ControlLabel>
              <Field
                  id="mandatory"
                  onChange={ this.onChange }
                  value={ field.get('mandatory', false) }
                  fieldType="checkbox"
              />
            </FormGroup>
          </Col>
          <Col lg={1} md={1}>
            <FormGroup>
              <ControlLabel>Editable</ControlLabel>
              <Field
                  id="editable"
                  onChange={ this.onChange }
                  value={ field.get('editable', false) }
                  fieldType="checkbox"
              />
            </FormGroup>
          </Col>        
          <Col lg={1} md={1}>
            <FormGroup>
              <ControlLabel>Display</ControlLabel>
              <Field
                  id="display"
                  onChange={ this.onChange }
                  value={ field.get('display', false) }
                  fieldType="checkbox"
              />
            </FormGroup>
          </Col>
          <Col lg={2} md={2}>
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
        { !last && <hr style={{ marginTop: 10, marginBottom: 10 }}/> }
      </div>
    );
  }
}

export default connect()(CustomField);
