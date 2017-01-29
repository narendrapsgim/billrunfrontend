import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import { Col, Form, Panel, FormGroup, ControlLabel } from 'react-bootstrap';
import Select from 'react-select';
import Field from '../Field';

const PrepaidInclude = (props) => {
  const onSelectChargingBy = (value) => {
    props.onChangeField({ target: { id: 'charging_by', value } });
    if (value === 'total_cost') {
      props.onChangeField({ target: { id: 'charging_by', value: 'total_cost' } });
    }
  };

  const onSelectUsageType = (value) => {
    props.onChangeField({ target: { id: 'charging_by_usaget', value } });
  };

  // console.log('--',props.usageTypes.map(key => ({ value: key, label: key })).toJS());
  const usageTypesOptions = [
    { value: 'new', label: 'New' },
    { value: 'inc', label: 'Increment' },
    { value: 'set', label: 'Set' },
  ];

  return (
    <div className="PrepaidInclude">
      <Panel>
        <Form horizontal>
          <FormGroup>
            <Col lg={2} md={2} componentClass={ControlLabel}>Name</Col>
            <Col lg={7} md={7}>
              <Field
                id="name"
                value={props.prepaidInclude.get('name', '')}
                onChange={props.onChangeField}
              />
            </Col>
          </FormGroup>
          <FormGroup>
            <Col lg={2} md={2} componentClass={ControlLabel}>External ID</Col>
            <Col lg={7} md={7}>
              <Field
                id="external_id"
                value={props.prepaidInclude.get('external_id', '')}
                onChange={props.onChangeField}
                fieldType="number"
              />
            </Col>
          </FormGroup>
          <FormGroup>
            <Col lg={2} md={2} componentClass={ControlLabel}>Priority</Col>
            <Col lg={7} md={7}>
              <Field
                id="priority"
                value={props.prepaidInclude.get('priority', '')}
                onChange={props.onChangeField}
                tooltip="Lower number represents higher priority"
                fieldType="number"
              />
            </Col>
          </FormGroup>
          <FormGroup>
            <Col lg={2} md={2} componentClass={ControlLabel}>Charging by</Col>
            <Col lg={7} md={7}>
              <Select
                inputProps={{ id: 'charging_by' }}
                name="charging_by"
                value={props.prepaidInclude.get('charging_by', '')}
                options={props.chargingByOptions}
                onChange={onSelectChargingBy}
              />
            </Col>
          </FormGroup>
          <FormGroup>
            <Col lg={2} md={2} componentClass={ControlLabel}>Usage type</Col>
            <Col lg={7} md={7}>
              {
                props.prepaidInclude.get('charging_by') === 'total_cost'
                ? <Select
                  disabled={true}
                  value={props.prepaidInclude.get('charging_by')}
                />
                : <Select
                  value={props.prepaidInclude.get('charging_by_usaget', '')}
                  options={usageTypesOptions}
                  onChange={onSelectUsageType}
                  searchable={false}
                />
              }
            </Col>
          </FormGroup>
          <FormGroup>
            <Col lg={2} md={2} componentClass={ControlLabel}>Shared bucket</Col>
            <Col lg={7} md={7}>
              <Field
                id="shared"
                value={props.prepaidInclude.get('shared', false)}
                onChange={props.onChangeField}
                fieldType="checkbox"
              />
            </Col>
          </FormGroup>
          <FormGroup>
            <Col lg={2} md={2} componentClass={ControlLabel}>Unlimited</Col>
            <Col lg={7} md={7}>
              <Field
                id="unlimited"
                value={props.prepaidInclude.get('unlimited', false)}
                onChange={props.onChangeField}
                fieldType="checkbox"
              />
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
};

PrepaidInclude.propTypes = {
  onChangeField: React.PropTypes.func.isRequired,
  prepaidInclude: PropTypes.instanceOf(Map),
  chargingByOptions: PropTypes.array,
};

export default connect()(PrepaidInclude);
