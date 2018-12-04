import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { FormGroup, Col } from 'react-bootstrap';
import Field from '../../Field';
import {
  eventThresholdOperatorsSelectOptionsSelector,
  eventThresholdFieldsSelectOptionsSelector,
} from '../../../selectors/eventSelectors';

const FraudEventThreshold = (props) => {
  const {
    threshold,
    index,
    thresholdOperatorsSelectOptions,
    thresholdFieldsSelectOptions,
    onUpdate,
  } = props;
  const thresholdUomOptions = [
    { value: 'min', label: 'Minutes' },
    { value: 'sec', label: 'Seconds' },
  ];
  const onChangeThresholdField = (value) => {
    onUpdate(['threshold_conditions', 0, index, 'field'], value);
  };
  const onChangeThresholdOperator = (value) => {
    onUpdate(['threshold_conditions', 0, index, 'op'], value);
  };
  const onChangeThresholdValue = (e) => {
    const { value } = e.target;
    onUpdate(['threshold_conditions', 0, index, 'op'], value);
  };
  const onChangeThresholdUnit = (value) => {
    onUpdate(['threshold_conditions', 0, index, 'unit'], value);
  };
  return (
    <FormGroup className="form-inner-edit-row">
      <Col smHidden mdHidden lgHidden>
        <label htmlFor="field_field">Field</label>
      </Col>
      <Col sm={3}>
        <Field
          id="threshold_field"
          fieldType="select"
          options={thresholdFieldsSelectOptions}
          onChange={onChangeThresholdField}
          value={threshold.getIn(['field'], '')}
        />
      </Col>

      <Col smHidden mdHidden lgHidden>
        <label htmlFor="threshold_operator">Operator</label>
      </Col>
      <Col sm={3}>
        <Field
          id="threshold_operator"
          fieldType="select"
          options={thresholdOperatorsSelectOptions}
          onChange={onChangeThresholdOperator}
          value={threshold.getIn(['op'], '')}
        />
      </Col>

      <Col smHidden mdHidden lgHidden>
        <label htmlFor="threshold_value">Value</label>
      </Col>
      <Col sm={4}>
        <Field
          id="threshold_value"
          onChange={onChangeThresholdValue}
          value={threshold.getIn(['value'], '')}
        />
      </Col>

      <Col smHidden mdHidden lgHidden>
        <label htmlFor="threshold_operator">Unit of measure</label>
      </Col>
      <Col sm={2}>
        <Field
          id="threshold_uom"
          fieldType="select"
          options={thresholdUomOptions}
          onChange={onChangeThresholdUnit}
          value={threshold.getIn(['unit'], '')}
        />
      </Col>
    </FormGroup>
  );
};


FraudEventThreshold.propTypes = {
  threshold: PropTypes.instanceOf(Immutable.Map),
  index: PropTypes.number.isRequired,
  thresholdFieldsSelectOptions: PropTypes.array,
  thresholdOperatorsSelectOptions: PropTypes.array,
  onUpdate: PropTypes.func.isRequired,
};

FraudEventThreshold.defaultProps = {
  threshold: Immutable.Map(),
  thresholdFieldsSelectOptions: [],
  thresholdOperatorsSelectOptions: [],
};

const mapStateToProps = (state, props) => ({
  thresholdFieldsSelectOptions: eventThresholdFieldsSelectOptionsSelector(state, { ...props, eventType: 'fraud' }),
  thresholdOperatorsSelectOptions: eventThresholdOperatorsSelectOptionsSelector(null, { eventType: 'fraud' }),
});

export default connect(mapStateToProps)(FraudEventThreshold);
