import React from 'react'
import PropTypes from 'prop-types'
import { List } from 'immutable';
import { CreateButton } from '@/components/Elements';
import Priority from './Priority';


const Priorities = ({
  type, category, priorities, lineKeyOptions, paramsKeyOptions, onAddCondition, onAddPriority, onUpdate, onRemove,
}) => (
  <div>
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
        onAddCondition={onAddCondition}
        onUpdate={onUpdate}
        onRemove={onRemove}
      />
    ))}
    <CreateButton
      label="Add Next Priority"
      onClick={onAddPriority}
      data={[category]}
      buttonStyle={{}}
    />
  </div>
);


Priorities.defaultProps = {
  priorities: List(),
  lineKeyOptions: [],
  paramsKeyOptions: [],
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
  onAddCondition: PropTypes.func.isRequired,
  onAddPriority: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};


export default Priorities;
