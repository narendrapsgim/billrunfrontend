import React from 'react';
import { connect } from 'react-redux';

import { Panel, Row, Col, FormGroup, Form, ControlLabel } from 'react-bootstrap';
import Field from '../Field';

const ChargingPlanInclude = (props) => {
  const { include, type } = props;

  const onUpdateField = (e) => {
    const { id, value } = e.target;
    props.onUpdateField(type, id, value);
  };

  const header = (
    <h3>{ type }</h3>
  );
  
  return (
    <div className="ChargingPlanInclude">
      <Form horizontal>
        <Panel header={ header }>
          <FormGroup>
            <Col componentClass={ ControlLabel } md={2}>
              Volume
            </Col>
            <Col md={9}>
              <Field
                  id="usagev"
                  value={ include.get('usagev', 0) }
                  onChange={ onUpdateField }
                  fieldType="number"
              />
            </Col>
          </FormGroup>
        </Panel>
      </Form>
    </div>
  );
};

export default connect()(ChargingPlanInclude);
