import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { FormGroup, Col, Button } from 'react-bootstrap';
import Field from '../../Field';
import ConditionValue from '../../Report/Editor/ConditionValue';
import {
  eventConditionsFilterOptionsSelector,
  eventConditionsOperatorsSelectOptionsSelector,
  eventConditionsFieldsSelectOptionsSelector,
  eventConditionsOperatorsSelector,
} from '../../../selectors/eventSelectors';

const FraudEventCondition = (props) => {
  const {
    condition,
    index,
    conditionField,
    conditionsFieldSelectOptions,
    conditionOperator,
    conditionsOperatorsSelectOptions,
    onUpdate,
    onRemove,
  } = props;

  const onChangeConditionsField = (field) => {
    const resetCondition = Immutable.Map({
      field,
      op: '',
      value: Immutable.List(),
    });
    onUpdate([index], resetCondition);
  };

  const onChangeConditionsOperator = (value) => {
    onUpdate([index, 'op'], value);
  };
  const onChangeConditionsValue = (value) => {
    const values = Immutable.List((value.length) ? value.split(',') : []);
    onUpdate([index, 'value'], values);
  };
  const onRemoveCondition = () => {
    onRemove(index);
  };
  const field = condition.getIn(['field'], '');
  const operator = condition.getIn(['op'], '');
  const disableOp = field === '';
  const disableVal = operator === '' || disableOp;
  const conditionForValue = condition.set('value', condition.get('value', Immutable.List()).join(','));
  return (
    <FormGroup className="form-inner-edit-row" key={`fraud_condition_${index}`}>
      <Col smHidden mdHidden lgHidden>
        <label htmlFor="condition_filter">Filter</label>
      </Col>
      <Col sm={4}>
        <Field
          id="condition_field"
          fieldType="select"
          options={conditionsFieldSelectOptions}
          onChange={onChangeConditionsField}
          value={field}
        />
      </Col>

      <Col smHidden mdHidden lgHidden>
        <label htmlFor="condition_operator">Operator</label>
      </Col>
      <Col sm={2}>
        <Field
          id="condition_operator"
          fieldType="select"
          options={conditionsOperatorsSelectOptions}
          onChange={onChangeConditionsOperator}
          value={condition.getIn(['op'], '')}
          disabled={disableOp}
        />
      </Col>

      <Col smHidden mdHidden lgHidden>
        <label htmlFor="condition_value">Value</label>
      </Col>
      <Col sm={4}>
        <ConditionValue
          field={conditionForValue}
          config={conditionField}
          operator={conditionOperator}
          disabled={disableVal}
          onChange={onChangeConditionsValue}
        />
      </Col>
      <Col sm={2} className="actions">
        <Button onClick={onRemoveCondition} bsSize="small" className="pull-left">
          <i className="fa fa-trash-o danger-red" />&nbsp;Remove
        </Button>
      </Col>
    </FormGroup>
  );
};

FraudEventCondition.propTypes = {
  condition: PropTypes.instanceOf(Immutable.Map),
  index: PropTypes.number.isRequired,
  conditionField: PropTypes.instanceOf(Immutable.Map),
  conditionsFieldSelectOptions: PropTypes.array,
  conditionOperator: PropTypes.instanceOf(Immutable.Map),
  conditionsOperatorsSelectOptions: PropTypes.array,
  onUpdate: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};

FraudEventCondition.defaultProps = {
  condition: Immutable.Map(),
  conditionField: Immutable.Map(),
  conditionsFieldSelectOptions: [],
  conditionOperator: Immutable.Map(),
  conditionsOperatorsSelectOptions: [],
};

const mapStateToProps = (state, props) => ({
  conditionField: eventConditionsFilterOptionsSelector(state, { eventType: 'fraud' })
    .find(condField => condField.get('id', '') === props.condition.getIn(['field'], ''), null, Immutable.Map()),
  conditionsFieldSelectOptions: eventConditionsFieldsSelectOptionsSelector(state, { ...props, eventType: 'fraud' }),
  conditionOperator: eventConditionsOperatorsSelector(state, { eventType: 'fraud' })
    .find(condOp => condOp.get('id', '') === props.condition.getIn(['op'], ''), null, Immutable.Map()),
  conditionsOperatorsSelectOptions: eventConditionsOperatorsSelectOptionsSelector(null, { eventType: 'fraud' }),
});

export default connect(mapStateToProps)(FraudEventCondition);
