import React from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';

import { Row, Col, FormGroup, ControlLabel } from 'react-bootstrap';
import Field from '../Field';

const CustomField = (props) => {
  const { field, entity, index, last } = props;

  const onChange = (e) => {
    const { id, value } = e.target;
    props.onChange(entity, index, id, value);
  };

  const onRemove = () => {
    props.onRemove(entity, index);
  };
  
  return (
    <div className="CustomField">
      <Row>
        <Col lg={3} md={3}>
          <FormGroup>
            <ControlLabel>Field Name</ControlLabel>
            <Field
                id="field_name"
                onChange={ onChange }
                value={ field.get('field_name', '') }
            />
          </FormGroup>
        </Col>
        <Col lg={3} md={3}>
          <FormGroup>
            <ControlLabel>Title</ControlLabel>
            <Field
                id="title"
                onChange={ onChange }
                value={ field.get('title', '') }
            />
          </FormGroup>
        </Col>
        <Col lg={1} md={1}>
          <FormGroup>
            <ControlLabel>Unique</ControlLabel>
            <Field
                id="unique"
                onChange={ onChange }
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
                onChange={ onChange }
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
                onChange={ onChange }
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
                onChange={ onChange }
                value={ field.get('display', false) }
                fieldType="checkbox"
            />
          </FormGroup>
        </Col>
        <Col lg={2} md={2}>
            <button type="button" className="btn btn-default btn-sm" onClick={ onRemove }>
              <i className="fa fa-trash-o danger-red" /> Remove
            </button>            
        </Col>
      </Row>
      { !last && <hr style={{ marginTop: 10, marginBottom: 10 }}/> }
    </div>
  );
};

CustomField.propTypes = {
  field: React.PropTypes.instanceOf(Immutable.Map),
  entity: React.PropTypes.string.isRequired,
  index: React.PropTypes.number.isRequired,  
  last: React.PropTypes.bool,
};

CustomField.defaultProps = {
  last: false
};

export default connect()(CustomField);
