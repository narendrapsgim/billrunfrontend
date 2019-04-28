import React, { memo, useCallback, useMemo } from 'react'
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import { FormGroup, Col, Row, InputGroup } from 'react-bootstrap';
import Field from '@/components/Field';
import Help from '../../Help';
import { Actions } from '@/components/Elements';
import { getConfig } from '@/common/Util';

const radioGroupStyle = { margin: 0, paddingLeft: 13 };
const radioStyle = { paddingTop: 10, paddingLeft: 13};

const PriorityCondition = ({
  condition, index, priorityIndex, type, onUpdate, onRemove, count,
  lineKeyOptions, paramsKeyOptions, paramsTypeOptions,
  onEditComputedLineKey,
}) => {

  const selectedRadio = useMemo(() => {
    if (condition.get('rate_key', '') === 'key') {
      return 'byKey';
    } else if (condition.get('rate_key', '') === 'usaget') {
      return 'byUsaget';
    }
    return 'byParam';
  }, [condition]);

  const onSetRating = useCallback((e) => {
    const { value } = e.target;
    onUpdate([index, 'rate_key'], value);
  }, [onUpdate, index]);

  const onChangeLineKey = useCallback((value) => {
    onUpdate([index, 'line_key'], value);
  }, [onUpdate, index]);

  const onChangeParamKey = useCallback((value) => {
    onUpdate([index, 'rate_key'], value);
  }, [onUpdate, index]);

  const onChangeParamType = useCallback((value) => {
    onUpdate([index, 'type'], value);
  }, [onUpdate, index]);

  const conditionActions = useMemo(() => [
    { type: 'remove', onClick: onRemove, show: count > 1, helpText: `Remove Condition ${index + 1} of Priority ${priorityIndex +1 }` },
  ], [onRemove, count, priorityIndex, index]);

  const computedLineActions = useMemo(() => [
    { type: 'edit', onClick: onEditComputedLineKey},
  ], [onEditComputedLineKey]);

  return (
    <Row>
      <Col sm={4} className="pr0">
        <FormGroup className="mt0 mr0 mb0 ml0">
          <Field
            fieldType="select"
            options={lineKeyOptions}
            onChange={onChangeLineKey}
            value={condition.get('line_key', '')}
            clearable={false}
          />
        { condition.get('line_key', '') === 'computed' && (
          <h4>
            <small>
              {`${condition.getIn(['computed', 'line_keys', 0, 'key'], '')}
                ${getConfig(['rates', 'conditions'], Map())
                  .find(cond => (cond.get('key', '') === condition.getIn(['computed', 'operator'], '')), null, Map())
                  .get('title', '')
                }
                ${condition.getIn(['computed', 'line_keys', 1, 'key'], '')}
              `}
              <Actions actions={computedLineActions} data={index} />
            </small>
          </h4>
        ) }
        </FormGroup>
      </Col>

      <Col sm={7} className="pr0">
        <FormGroup style={radioGroupStyle}>
          <Field
            fieldType="radio"
            checked={selectedRadio === 'byKey'}
            value="key"
            onChange={onSetRating}
            labelStyle={radioStyle}
            label={`By ${type} key`}
          />
          <Field
            fieldType="radio"
            checked={selectedRadio === 'byUsaget'}
            value="usaget"
            onChange={onSetRating}
            label={`By ${type} unit type`}
            labelStyle={radioStyle}
          />
          <InputGroup>
            <InputGroup.Addon>
              <Field
                fieldType="radio"
                checked={selectedRadio === 'byParam'}
                value=""
                onChange={onSetRating}
                label={
                  <span>By product param<Help contents={`This field needs to be configured in the 'Additional Parameters' of a ${type}`} /></span>
                }
              />
            </InputGroup.Addon>
            <Field
              fieldType="select"
              value={selectedRadio !== 'byParam' ? '' : condition.get('rate_key', '')}
              onChange={onChangeParamKey}
              options={paramsKeyOptions}
              disabled={selectedRadio !== 'byParam'}
              allowCreate={true}
            />
            <Field
              fieldType="select"
              value={selectedRadio !== 'byParam' ? '' : condition.get('type', '')}
              onChange={onChangeParamType}
              options={paramsTypeOptions}
              disabled={selectedRadio !== 'byParam'}
              className="not-top-border"
            />
          </InputGroup>
        </FormGroup>
      </Col>

      <Col xs={1}>
        <Actions actions={conditionActions} data={index}/>
      </Col>
      <Col xs={12}>
        <hr />
      </Col>
    </Row>
  );
}

PriorityCondition.defaultProps = {
  condition: Map(),
  index: 0,
  priorityIndex: 0,
  count: 0,
  lineKeyOptions: [],
  paramsKeyOptions: [],
  paramsTypeOptions: [
    { value: 'match', label: 'Equals' },
    { value: 'equalFalse', label: 'Does Not Equal' },
    { value: 'longestPrefix', label: 'Longest Prefix' },
  ],
};

PriorityCondition.propTypes = {
  condition: PropTypes.instanceOf(Map),
  type: PropTypes.string.isRequired,
  index: PropTypes.number,
  priorityIndex: PropTypes.number,
  count: PropTypes.number,
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
  paramsTypeOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    }),
  ),
  onUpdate: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default memo(PriorityCondition);
