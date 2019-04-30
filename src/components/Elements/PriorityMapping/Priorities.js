import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { List } from 'immutable';
import { Form } from 'react-bootstrap';
import { CreateButton } from '@/components/Elements';
import Priority from './Priority';

const createBtnStyle = {};

const Priorities = ({
  type,
  category,
  priorities,
  lineKeyOptions,
  paramsKeyOptions,
  conditionFieldsOptions,
  valueWhenOptions,
  onAddCondition,
  onAddPriority,
  onUpdate,
  onRemove,
}) => {
  const onCreate = useCallback(() => onAddPriority([category]), [onAddPriority, category]);
  return (
    <Form horizontal>
      { priorities.map((priority, index) => (
        <Priority
          key={index}
          index={index}
          category={category}
          type={type}
          priority={priority}
          count={priorities.size}
          lineKeyOptions={lineKeyOptions}
          paramsKeyOptions={paramsKeyOptions}
          conditionFieldsOptions={conditionFieldsOptions}
          valueWhenOptions={valueWhenOptions}
          onAddCondition={onAddCondition}
          onUpdate={onUpdate}
          onRemove={onRemove}
        />
      ))}
      <CreateButton
        label="Add Next Priority"
        onClick={onCreate}
        buttonStyle={createBtnStyle}
      />
    </Form>
  );
}


Priorities.defaultProps = {
  priorities: List(),
  lineKeyOptions: [],
  paramsKeyOptions: [],
  conditionFieldsOptions: [],
  valueWhenOptions: [],
};


Priorities.propTypes = {
  type: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  priorities: PropTypes.instanceOf(List),
  lineKeyOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    }),
  ),
  paramsKeyOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    }),
  ),
  conditionFieldsOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    }),
  ),
  valueWhenOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    }),
  ),
  onAddCondition: PropTypes.func.isRequired,
  onAddPriority: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};


export default Priorities;
