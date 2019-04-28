import React, { memo, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { List } from 'immutable';
import { Panel } from 'react-bootstrap';
import PriorityCondition from './PriorityCondition';
import { CreateButton, Actions } from '@/components/Elements';

const actionsStyle = { marginTop: -5 };
const createBtnStyle = {};

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
  const updateCondition = useCallback((path, value) => {
    onUpdate([category, index, ...path], value)
  }, [onUpdate, category, index])
  const removeCondition = useCallback((idx) => {
    onRemove([category, index, idx]);
  }, [onRemove, category, index])
  const actions = useMemo(() => [
    { type: 'remove', onClick: onRemove, show: count > 1, helpText: `Remove Priority ${index + 1}` },
  ], [onRemove, count, index]);
  const actionsData = useMemo(() => [category, index], [category, index]);
  const isLast = useMemo(() => index + 1 === count, [index, count]);
  const header = (
    <div>
      {`Priority ${index + 1}`}
      <div className="pull-right" style={actionsStyle}>
        <Actions actions={actions} data={actionsData} />
      </div>
    </div>
  );
  return (
    <Panel header={header} collapsible={true} className="collapsible" defaultExpanded={isLast}>
      { priority.map((condition, idx) => (
        <PriorityCondition
          key={idx}
          index={idx}
          priorityIndex={index}
          count={priority.size}
          type={type}
          lineKeyOptions={lineKeyOptions}
          paramsKeyOptions={paramsKeyOptions}
          condition={condition}
          onUpdate={updateCondition}
          onRemove={removeCondition}
        />
      )) }
      <CreateButton onClick={onAddCondition} label="Add" data={actionsData} buttonStyle={createBtnStyle} />
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

export default memo(Priority);
