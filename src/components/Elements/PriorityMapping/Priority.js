import React from 'react';
import PropTypes from 'prop-types';
import { List } from 'immutable';
import { Panel } from 'react-bootstrap';
import PriorityCondition from './PriorityCondition';
import { CreateButton, Actions } from '@/components/Elements';

const Priority = ({
  priority,
  index,
  type,
  category,
  count,
  paramsKeyOptions,
  lineKeyOptions,
  onUpdate,
  onRemove,
  onAddCondition,
}) => {

  const updateCondition = (path, value) => {
    onUpdate([category, index, ...path], value)
  }

  const removeCondition = (idx) => {
    onRemove([category, index, idx]);
  }

  const actions = [
    { type: 'remove', onClick: onRemove, show: count > 1 },
  ];

  const isLast = index + 1 === count;

  const header = (
    <div>
      {`Priority ${index + 1}`}
      <div className="pull-right" style={{ marginTop: -5 }}>
        <Actions actions={actions} data={[category, index]} />
      </div>
    </div>
  );
  return (
    <Panel header={header} collapsible={true} className="collapsible" defaultExpanded={isLast}>
      { priority.map((condition, idx) => (
        <PriorityCondition
          key={idx}
          index={idx}
          count={priority.size}
          type={type}
          lineKeyOptions={lineKeyOptions}
          paramsKeyOptions={paramsKeyOptions}
          condition={condition}
          onUpdate={updateCondition}
          onRemove={removeCondition}
        />
      )) }
      <CreateButton onClick={onAddCondition} label="Add" data={[category, index]} buttonStyle={{}} />
    </Panel>
  )
}

Priority.defaultProps = {
  priority: List(),
  lineKeyOptions: [],
  paramsKeyOptions: [],
  index: 0,
  count: 0,
};

Priority.propTypes = {
  priority: PropTypes.instanceOf(List),
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
  index: PropTypes.number,
  count: PropTypes.number,
  type: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  onRemove: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onAddCondition: PropTypes.func.isRequired,
};

export default Priority;
