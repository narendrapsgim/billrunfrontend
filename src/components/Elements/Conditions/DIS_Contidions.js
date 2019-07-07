import React from 'react';
import PropTypes from 'prop-types';
import { Col, FormGroup } from 'react-bootstrap';
import { Map, List } from 'immutable';
import { CreateButton } from '@/components/Elements';
import Condition from './Condition';


const Conditions = ({
  conditions,
  onAddCondition,
  onRemoveCondition,
  onChangeField,
  onChangeOperator,
  onChangeValue,
  operators,
  fields,
  isError,
  addNewLabel,
  disabled,
}) => (
  <div className="conditions-list">
    {!conditions.isEmpty() && (
    <Col sm={12} className="form-inner-edit-rows">
      <FormGroup className="form-inner-edit-row">
        <Col sm={4} xsHidden><label htmlFor="field">Field</label></Col>
        <Col sm={2} xsHidden><label htmlFor="operator">Operator</label></Col>
        <Col sm={4} xsHidden><label htmlFor="value">Value</label></Col>
      </FormGroup>
    </Col>
    )}
    <Col sm={12}>
      {conditions.isEmpty() && (
        <small>No conditions found</small>
      )}
      {conditions.map((condition, index) => (
        <Condition
          key={index}
          condition={condition}
          index={index}
          fields={fields}
          operators={operators}
          onChangeField={onChangeField}
          onChangeOperator={onChangeOperator}
          onChangeValue={onChangeValue}
          onRemove={onRemoveCondition}
          error={isError.get(`${index}`, '')}
          disabled={disabled}
        />
      ))}
    </Col>
    <Col sm={12} className="pl0 pr0">
      <CreateButton
        onClick={onAddCondition}
        label={addNewLabel}
      />
    </Col>
  </div>
);

Conditions.defaultProps = {
  conditions: List(),
  conditionsOperators: List(),
  fields: List(),
  operators: List(),
  isError: Map(),
  disabled: false,
  addNewLabel: 'Add Condition',
  onChangeField: () => {},
  onChangeOperator: () => {},
  onChangeValue: () => {},
  onAddCondition: () => {},
  onRemoveCondition: () => {},
};

Conditions.propTypes = {
  conditions: PropTypes.instanceOf(List),
  conditionsOperators: PropTypes.instanceOf(List),
  operators: PropTypes.instanceOf(List),
  fields: PropTypes.instanceOf(List),
  isError: PropTypes.instanceOf(Map),
  disabled: PropTypes.bool,
  addNewLabel: PropTypes.string,
  onChangeField: PropTypes.func,
  onChangeOperator: PropTypes.func,
  onChangeValue: PropTypes.func,
  onAddCondition: PropTypes.func,
  onRemoveCondition: PropTypes.func,
};


export default Conditions;
