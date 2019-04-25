import React from 'react'
import PropTypes from 'prop-types'
import { List } from 'immutable';
import { CreateButton } from '@/components/Elements';
import Priority from './Priority';


const Priorities = ({
  type, category, priorities, lineKeyOptions, paramsKeyOptions, onUpdate, onAdd, onRemove,
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
        onAdd={onAdd}
        onUpdate={onUpdate}
        onRemove={onRemove}
      />
    ))}
    <CreateButton label="Add Next Priority" onClick={() => onAdd([category], List())} buttonStyle={{}} />
  </div>
);


Priorities.defaultProps = {
  priorities: List(),
  lineKeyOptions: List(),
  paramsKeyOptions: List(),
};


Priorities.propTypes = {
  type: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  priorities: PropTypes.instanceOf(List),
  lineKeyOptions: PropTypes.instanceOf(List),
  paramsKeyOptions: PropTypes.instanceOf(List),
  onUpdate: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};


export default Priorities;
