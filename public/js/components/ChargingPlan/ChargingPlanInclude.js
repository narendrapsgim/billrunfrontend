import React from 'react';
import { connect } from 'react-redux';

import { Panel, Row, Col, FormGroup, Form, ControlLabel } from 'react-bootstrap';
import Select from 'react-select';
import Field from '../Field';

const ChargingPlanInclude = (props) => {
  const { include, type, prepaid_includes_options } = props;

  const onUpdateField = (e) => {
    const { id, value } = e.target;
    props.onUpdateField(type, id, value);
  };

  const onUpdatePeriodField = (e) => {
    const { id, value } = e.target;
    props.onUpdatePeriodField(type, id, value);
  };

  const onSelectPeriodUnit = (value) => {
    props.onUpdatePeriodField(type, 'unit', value);
  };

  const unit_options = [
    { value: 'days', label: 'Days' },
    { value: 'months', label: 'Months' }
  ];
  
  const header = (
    <h3>{ include.get('pp_includes_name', '') }</h3>
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
          <FormGroup>
            <Col componentClass={ ControlLabel } md={2}>
              Duration
            </Col>
            <Col md={9}>
              <Col md={6} style={{paddingLeft: 0}}>
                <Field
                    id="duration"
                    value={ include.getIn(['period', 'duration'], 0) }
                    onChange={ onUpdatePeriodField }
                    fieldType="number"
                />
              </Col>
              <Col md={6}>
                <Select
                    options={ unit_options }
                    value={ include.getIn(['period', 'unit'], '') }
                    onChange={ onSelectPeriodUnit }
                />
              </Col>
            </Col>
          </FormGroup>
        </Panel>
      </Form>
    </div>
  );
};

export default connect()(ChargingPlanInclude);
