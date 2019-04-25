import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { List, Map } from 'immutable';
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
  addCondition,
  removeCondition,
}) => {
  const actions = [
    { type: 'remove', onClick: onRemove, show: count > 1 },
  ];

  const updateCondition = (path, value) => {
    onUpdate([category, index, ...path], value)
  }

  const header = (
    <div>
      {`Priority ${index + 1}`}
      <div className="pull-right" style={{ marginTop: -5 }}>
        <Actions actions={actions} data={[category, index]} />
      </div>
    </div>
  );
  return (
    <Panel header={header} collapsible={true} className="collapsible">
      { priority.map((condition, idx) => (
        <PriorityCondition
          key={idx}
          index={idx}
          count={priority.size}
          type={type}
          lineKeyOptions={lineKeyOptions}
          paramsKeyOptions={paramsKeyOptions}
          condition={condition}
          updateCondition={updateCondition}
          removeCondition={removeCondition}
        />
      )) }
      <CreateButton onClick={addCondition} label="Add" buttonStyle={{}} />
    </Panel>
  )
}

Priority.defaultProps = {
  priority: List(),
  lineKeyOptions: List(),
  paramsKeyOptions: List(),
  index: 0,
  count: 0,
};

Priority.propTypes = {
  priority: PropTypes.instanceOf(List),
  lineKeyOptions: PropTypes.instanceOf(List),
  paramsKeyOptions: PropTypes.instanceOf(List),
  index: PropTypes.number,
  count: PropTypes.number,
  type: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  onRemove: PropTypes.func.isRequired,
  addCondition: PropTypes.func.isRequired,
  removeCondition: PropTypes.func.isRequired,
};

const mapStateToProps = (state, props) => {
  // console.log("Priority mapStateToProps", props);
  return ({
  });
}

const mapDispatchToProps = (dispatch, props) => ({
  addCondition: () => {
    props.onAdd([props.category, props.index], Map())
  },
  removeCondition: (index) => {
    props.onRemove([props.category, props.index, index]);
  },
});


export default connect(mapStateToProps, mapDispatchToProps)(Priority);
