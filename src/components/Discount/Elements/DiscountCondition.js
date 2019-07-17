import React, { useCallback, memo } from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { Conditions } from '@/components/Elements';

const DiscountCondition = ({
  conditions,
  path,
  editable,
  fields,
  operators,
  valueOptions,
  onChangeField,
  onChangeOp,
  onChangeValue,
  onAdd,
  onRemove,
}) => {
  const onChangeConditionField = useCallback((index, value) => {
    onChangeField(path, index, value);
  }, [onChangeField, path]);

  const onChangeConditionOp = useCallback((index, value) => {
    onChangeOp(path, index, value);
  }, [onChangeOp, path]);

  const onChangeConditionValue = useCallback((index, value) => {
    onChangeValue(path, index, value);
  }, [onChangeValue, path]);

  const addCondition = useCallback((condition) => {
    onAdd(path, condition);
  }, [onAdd, path]);

  const removeCondition = useCallback((index) => {
    onRemove(path, index);
  }, [onRemove, path]);

  return (
    <Conditions
      conditions={conditions}
      editable={editable}
      fields={fields}
      operators={operators}
      customValueOptions={valueOptions}
      onChangeField={onChangeConditionField}
      onChangeOperator={onChangeConditionOp}
      onChangeValue={onChangeConditionValue}
      onAdd={addCondition}
      onRemove={removeCondition}
    />
  )
}

DiscountCondition.propTypes = {
  conditions: PropTypes.instanceOf(Immutable.List),
  path: PropTypes.array.isRequired,
  editable: PropTypes.bool,
  fields: PropTypes.instanceOf(Immutable.List),
  operators: PropTypes.instanceOf(Immutable.List),
  valueOptions: PropTypes.instanceOf(Immutable.List),
  onChangeField: PropTypes.func.isRequired,
  onChangeOp: PropTypes.func.isRequired,
  onChangeValue: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};

DiscountCondition.defaultProps = {
  conditions: Immutable.List(),
  editable: true,
  fields: Immutable.List(),
  operators: Immutable.List(),
  valueOptions: Immutable.List(),
};

export default memo(DiscountCondition);
