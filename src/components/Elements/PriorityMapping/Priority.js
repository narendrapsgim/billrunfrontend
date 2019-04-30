import React, { memo, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { titleCase } from 'change-case';
import { List } from 'immutable';
import { Panel, Col, FormGroup } from 'react-bootstrap';
import PriorityCondition from './PriorityCondition';
import { CreateButton, Actions } from '@/components/Elements';
import Field from '@/components/Field';

const createBtnStyle = { marginTop: 5 };

const Priority = ({
  priority,
  index,
  type,
  category,
  count,
  paramsKeyOptions,
  lineKeyOptions,
  conditionFieldsOptions,
  valueWhenOptions,
  onUpdate,
  onRemove,
  onAddCondition,
}) => {
  const updateCondition = useCallback((path, value) => {
    if (value === null) {
      onUpdate([category, index], priority.deleteIn(path));
    } else {
      onUpdate([category, index, ...path], value);
    }
  }, [onUpdate, category, index, priority]);

  const removeCondition = useCallback((idx) => {
    onRemove([category, index, idx]);
  }, [onRemove, category, index]);

  const updateUseHintDoc = useCallback((e) => {
    const { value } = e.target;
    onUpdate([category, index, 0, 'use_hint_doc'], value)
  }, [onUpdate, category, index]);

  const updateDefaultFallback = useCallback((e) => {
    const { value } = e.target;
    onUpdate([category, index, 0, 'default_fallback'], value)
  }, [onUpdate, category, index]);

  const actionsData = useMemo(() => [category, index], [category, index]);

  const allowRemove = useMemo(() => ![count, count - 1].includes(index + 1), [count, index]);

  const actions = useMemo(() => [
    { type: 'remove', onClick: onRemove, show: allowRemove, helpText: `Remove Priority ${index + 1}`, actionClass: 'pr0 pl0 pt0' },
  ], [onRemove, index, allowRemove]);

  if (priority.first().has('use_hint_doc')) {
    return (
      <Panel header={`Priority ${index + 1}`}>
        <Field
          fieldType="checkbox"
          value={priority.first().get('use_hint_doc', false)}
          onChange={updateUseHintDoc}
          label="Use tax rate referenced by product/service/plan"
          disabled={true}
        />
      </Panel>
    );
  }
  if (priority.first().has('default_fallback')) {
    return (
      <Panel header={`Priority ${index + 1}`}>
        <Field
          fieldType="checkbox"
          value={priority.first().get('default_fallback', false)}
          onChange={updateDefaultFallback}
          label="Use default tax rate"
        />
      </Panel>
    );
  }

  const header = (
    <div>
      {`Priority ${index + 1}`}
      <div className="pull-right">
        <Actions actions={actions} data={actionsData} />
      </div>
    </div>
  );
  return (
    <Panel header={header} collapsible={true} className="collapsible" defaultExpanded={true}>
      <div className="priority-conditions">
        <Col sm={12} className="form-inner-edit-rows">
          {priority.isEmpty() && (
            <small>No conditions found</small>
          )}
          {!priority.isEmpty() && (
            <FormGroup className="form-inner-edit-row">
              <Col sm={4} xsHidden><label className="ml5 mb0">CDR Field</label></Col>
              <Col sm={3} xsHidden><label className="mb0">Operator</label></Col>
              <Col sm={4} xsHidden><label className="mb0">{titleCase(type)} Parameter</label></Col>
              <Col sm={1} xsHidden></Col>
            </FormGroup>
          )}
          { priority.map((condition, idx) => (
            <PriorityCondition
              key={idx}
              index={idx}
              priorityIndex={index}
              count={priority.size}
              type={type}
              lineKeyOptions={lineKeyOptions}
              paramsKeyOptions={paramsKeyOptions}
              conditionFieldsOptions={conditionFieldsOptions}
              valueWhenOptions={valueWhenOptions}
              condition={condition}
              onUpdate={updateCondition}
              onRemove={removeCondition}
            />
          )) }
        </Col>
        <Col sm={12} className="ml5 pl0">
          <CreateButton
            onClick={onAddCondition}
            data={actionsData}
            label="Add Condition"
            buttonStyle={createBtnStyle}
          />
        </Col>
      </div>
    </Panel>
  )

}

Priority.defaultProps = {
  priority: List(),
  lineKeyOptions: [],
  paramsKeyOptions: [],
  conditionFieldsOptions: [],
  valueWhenOptions: [],
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
  index: PropTypes.number,
  count: PropTypes.number,
  type: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  onRemove: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onAddCondition: PropTypes.func.isRequired,
};

export default memo(Priority);
