import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import { Panel, Col, FormGroup, Form, ControlLabel } from 'react-bootstrap';
import Select from 'react-select';
import Field from '../Field';
import Actions from '../Elements/Actions';

const ChargingPlanInclude = (props) => {
  const { include, index } = props;

  const onUpdateField = (e) => {
    const { id, value } = e.target;
    props.onUpdateField(index, id, value);
  };

  const onUpdatePeriodField = (e) => {
    const { id, value } = e.target;
    props.onUpdatePeriodField(index, id, value);
  };

  const onSelectPeriodUnit = (value) => {
    props.onUpdatePeriodField(index, 'unit', value);
  };

  const unitOptions = [
    { value: 'days', label: 'Days' },
    { value: 'months', label: 'Months' },
  ];

  const onRemoveClick = () => {
    props.onRemove(index);
  };

  const actions = [
    { type: 'remove', showIcon: true, onClick: onRemoveClick },
  ];

  const header = (
    <div>
      { include.get('pp_includes_name', '') }
      <div className="pull-right" style={{ marginTop: -5 }}>
        <Actions actions={actions} />
      </div>
    </div>
  );

  return (
    <div className="ChargingPlanInclude">
      <Form horizontal>
        <Panel header={header}>

          <FormGroup>
            <Col componentClass={ControlLabel} md={2}> Volume </Col>
            <Col md={9}>
              <Field id="usagev" value={include.get('usagev', 0)} onChange={onUpdateField} fieldType="number" editable={props.editable} />
            </Col>
          </FormGroup>

          <FormGroup>
            <Col componentClass={ControlLabel} md={2}> Duration </Col>
            <Col md={9}>
              <Col md={6} style={{ paddingLeft: 0 }}>
                { props.editable
                  ? <Field id="duration" value={include.getIn(['period', 'duration'], 0)} onChange={onUpdatePeriodField} fieldType="number" editable={props.editable} />
                  : <div className="non-editable-field">{`${include.getIn(['period', 'duration'], 0)} ${include.getIn(['period', 'unit'], '')}`}</div>
                }
              </Col>
              <Col md={6}>
                { props.editable &&
                  <Select options={unitOptions} value={include.getIn(['period', 'unit'], '')} onChange={onSelectPeriodUnit} />
                }
              </Col>
            </Col>
          </FormGroup>

        </Panel>
      </Form>
    </div>
  );
};

ChargingPlanInclude.defaultProps = {
  include: Map(),
  index: 0,
  editable: true,
};

ChargingPlanInclude.propTypes = {
  include: PropTypes.instanceOf(Map),
  index: PropTypes.number,
  onUpdatePeriodField: PropTypes.func.isRequired,
  onUpdateField: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  editable: PropTypes.bool,
};

export default connect()(ChargingPlanInclude);
