import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Map, List } from 'immutable';
import { Col, Form, Panel, FormGroup, ControlLabel } from 'react-bootstrap';
import Select from 'react-select';
import Field from '../Field';

const PrepaidInclude = (props) => {
  const { usageTypes, prepaidInclude, chargingByOptions } = props;

  const onSelectChange = id => (value) => {
    props.onChangeField({ target: { id, value } });
  };

  const usageTypesOptions = usageTypes
    .map(key => ({ value: key, label: key }))
    .toArray();

  const checkboxStyle = { marginTop: 10 };

  return (
    <div className="PrepaidInclude">
      <Panel>
        <Form horizontal>
          <FormGroup>
            <Col lg={2} md={2} componentClass={ControlLabel}>Name</Col>
            <Col lg={7} md={7}>
              <Field id="name" value={prepaidInclude.get('name', '')} onChange={props.onChangeField} />
            </Col>
          </FormGroup>
          <FormGroup>
            <Col lg={2} md={2} componentClass={ControlLabel}>External ID</Col>
            <Col lg={7} md={7}>
              <Field id="external_id" value={prepaidInclude.get('external_id', '')} onChange={props.onChangeField} fieldType="number" />
            </Col>
          </FormGroup>
          <FormGroup>
            <Col lg={2} md={2} componentClass={ControlLabel}>Priority</Col>
            <Col lg={7} md={7}>
              <Field id="priority" value={prepaidInclude.get('priority', '')} onChange={props.onChangeField} tooltip="Lower number represents higher priority" fieldType="number" />
            </Col>
          </FormGroup>
          <FormGroup>
            <Col lg={2} md={2} componentClass={ControlLabel}>Charging by</Col>
            <Col lg={7} md={7}>
              <Select name="charging_by" value={prepaidInclude.get('charging_by', '')} options={chargingByOptions} onChange={onSelectChange('charging_by')} />
            </Col>
          </FormGroup>
          <FormGroup>
            <Col lg={2} md={2} componentClass={ControlLabel}>Usage type</Col>
            <Col lg={7} md={7}>
              {
                prepaidInclude.get('charging_by') === 'total_cost'
                ? <Select disabled={true} value={prepaidInclude.get('charging_by')} />
                : <Select
                  value={prepaidInclude.get('charging_by_usaget', '')}
                  options={usageTypesOptions}
                  onChange={onSelectChange('charging_by_usaget')}
                  searchable={false}
                />
              }
            </Col>
          </FormGroup>
          <FormGroup>
            <Col lg={2} md={2} componentClass={ControlLabel}>Shared bucket</Col>
            <Col lg={7} md={7} style={checkboxStyle}>
              <Field id="shared" value={prepaidInclude.get('shared', false)} onChange={props.onChangeField} fieldType="checkbox" />
            </Col>
          </FormGroup>
          <FormGroup>
            <Col lg={2} md={2} componentClass={ControlLabel}>Unlimited</Col>
            <Col lg={7} md={7} style={checkboxStyle}>
              <Field id="unlimited" value={prepaidInclude.get('unlimited', false)} onChange={props.onChangeField} fieldType="checkbox" />
            </Col>
          </FormGroup>
        </Form>
      </Panel>
    </div>
  );
};

PrepaidInclude.defaultProps = {
  prepaidInclude: Map(),
  chargingByOptions: [],
  usageTypes: List(),
};

PrepaidInclude.propTypes = {
  onChangeField: React.PropTypes.func.isRequired,
  prepaidInclude: PropTypes.instanceOf(Map),
  usageTypes: PropTypes.instanceOf(List),
  chargingByOptions: PropTypes.array,
};

export default connect()(PrepaidInclude);
