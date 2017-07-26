import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import { Col, Form, Panel, FormGroup, ControlLabel } from 'react-bootstrap';
import Select from 'react-select';
import Field from '../Field';
import UsageTypesSelector from '../UsageTypes/UsageTypesSelector';

const PrepaidInclude = (props) => {
  const { prepaidInclude, chargingByOptions, mode } = props;

  const onSelectChange = id => (value) => {
    if (id === 'charging_by') {
      const usaget = (value === 'total_cost' ? 'total_cost' : '');
      onSelectChange('charging_by_usaget')(usaget);
      if (value !== 'usagev') {
        onSelectChange('charging_by_usaget_unit')('');
      }
    }
    props.onChangeField({ target: { id, value } });
  };

  const checkboxStyle = { marginTop: 10 };

  const editable = (mode !== 'view');

  const renderChargingBy = () => {
    if (editable) {
      return (
        <Select disabled={true} value="All" />
      );
    }
    return (
      <div className="non-editable-field">All</div>
    );
  };

  const renderChargingByUsaget = () => {
    if (editable) {
      return (
        <UsageTypesSelector
          usaget={prepaidInclude.get('charging_by_usaget', '')}
          unit={prepaidInclude.get('charging_by_usaget_unit', '')}
          onChangeUsaget={onSelectChange('charging_by_usaget')}
          onChangeUnit={onSelectChange('charging_by_usaget_unit')}
          showUnits={prepaidInclude.get('charging_by', '') === 'usagev'}
        />
      );
    }
    return (
      <div className="non-editable-field">{prepaidInclude.get('charging_by_usaget', '')}</div>
    );
  };

  return (
    <div className="PrepaidInclude">
      <Panel>
        <Form horizontal>
          { ['clone', 'create'].includes(mode) &&
            <FormGroup>
              <Col lg={2} md={2} componentClass={ControlLabel}>Name</Col>
              <Col lg={7} md={7}>
                <Field id="name" value={prepaidInclude.get('name', '')} onChange={props.onChangeField} editable={editable} />
              </Col>
            </FormGroup>
          }
          <FormGroup>
            <Col lg={2} md={2} componentClass={ControlLabel}>External ID</Col>
            <Col lg={7} md={7}>
              <Field id="external_id" value={prepaidInclude.get('external_id', '')} onChange={props.onChangeField} fieldType="number" editable={mode === 'create'} />
            </Col>
          </FormGroup>
          <FormGroup>
            <Col lg={2} md={2} componentClass={ControlLabel}>Priority</Col>
            <Col lg={7} md={7}>
              <Field id="priority" value={prepaidInclude.get('priority', '')} onChange={props.onChangeField} tooltip="Lower number represents higher priority" fieldType="number" editable={editable} />
            </Col>
          </FormGroup>
          <FormGroup>
            <Col lg={2} md={2} componentClass={ControlLabel}>Charging by</Col>
            <Col lg={7} md={7}>
              {
                editable
                ? <Select name="charging_by" value={prepaidInclude.get('charging_by', '')} options={chargingByOptions} onChange={onSelectChange('charging_by')} />
                : <div className="non-editable-field">{prepaidInclude.get('charging_by', '')}</div>
              }
            </Col>
          </FormGroup>
          <FormGroup>
            <Col lg={2} md={2} componentClass={ControlLabel}>Usage type</Col>
            <Col lg={7} md={7}>
              { prepaidInclude.get('charging_by') === 'total_cost'
                ? renderChargingBy()
                : renderChargingByUsaget()
              }
            </Col>
          </FormGroup>
          <FormGroup>
            <Col lg={2} md={2} componentClass={ControlLabel}>Shared bucket</Col>
            <Col lg={7} md={7} style={checkboxStyle}>
              <Field id="shared" value={prepaidInclude.get('shared', false)} onChange={props.onChangeField} fieldType="checkbox" editable={editable} />
            </Col>
          </FormGroup>
          <FormGroup>
            <Col lg={2} md={2} componentClass={ControlLabel}>Unlimited</Col>
            <Col lg={7} md={7} style={checkboxStyle}>
              <Field id="unlimited" value={prepaidInclude.get('unlimited', false)} onChange={props.onChangeField} fieldType="checkbox" editable={editable} />
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
  mode: 'create',
};

PrepaidInclude.propTypes = {
  onChangeField: React.PropTypes.func.isRequired,
  prepaidInclude: PropTypes.instanceOf(Map),
  chargingByOptions: PropTypes.array,
  mode: PropTypes.string,
};

export default connect()(PrepaidInclude);
