import React from 'react'
import PropTypes from 'prop-types';
import { Map, List } from 'immutable';
import { FormGroup, Col, Row, InputGroup } from 'react-bootstrap';
import Field from '@/components/Field';
import Help from '../../Help';
import { Actions } from '@/components/Elements';
import { getConfig } from '@/common/Util';


const PriorityCondition = ({
  condition, index, type, updateCondition, removeCondition, count,
  lineKeyOptions, paramsKeyOptions, paramsTypeOptions,
  onEditComputedLineKey,
}) => {
  let selectedRadio = 'byParam';
  if (condition.get('rate_key', '') === 'key') {
    selectedRadio = 'byKey';
  } else if (condition.get('rate_key', '') === 'usaget') {
    selectedRadio = 'byUsaget';
  }
  const onSetRating = (e) => {
    const { value } = e.target;
    updateCondition([index, 'rate_key'], value);
  }

  const onChangeLineKey = (value) => {
    updateCondition([index, 'line_key'], value);
  }

  const onChangeParamKey = (value) => {
    updateCondition([index, 'rate_key'], value);
  }

  const onChangeParamType = (value) => {
    updateCondition([index, 'type'], value);
  }

  const conditionActions = [
    { type: 'remove', onClick: removeCondition, show: count > 1 },
  ];

  const computedLineActions = [
    { type: 'edit', onClick: onEditComputedLineKey},
  ];

  return (
    <Row>
      <Col sm={4} style={{ paddingRight: 0 }}>
        <FormGroup style={{ margin: 0 }}>
          <Field
            fieldType="select"
            options={lineKeyOptions.toJS()}
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

      <Col sm={7} style={{ paddingRight: 0 }}>
        <FormGroup style={{ margin: 0, paddingLeft: 13 }}>
          <Field
            fieldType="radio"
            checked={selectedRadio === 'byKey'}
            value="key"
            onChange={onSetRating}
            labelStyle={{ paddingTop: 10, paddingLeft: 13}}
            label={`By ${type} key`}
          />
          <Field
            fieldType="radio"
            checked={selectedRadio === 'byUsaget'}
            value="usaget"
            onChange={onSetRating}
            label={`By ${type} unit type`}
            labelStyle={{ paddingTop: 10, paddingLeft: 13}}
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
  count: 0,
  lineKeyOptions: List(),
  paramsKeyOptions: List(),
  paramsTypeOptions: List([
    { value: 'match', label: 'Equals' },
    { value: 'equalFalse', label: 'Does Not Equal' },
    { value: 'longestPrefix', label: 'Longest Prefix' },
  ]),
};

PriorityCondition.propTypes = {
  condition: PropTypes.instanceOf(Map),
  type: PropTypes.string.isRequired,
  index: PropTypes.number,
  count: PropTypes.number,
  lineKeyOptions: PropTypes.instanceOf(List),
  paramsKeyOptions: PropTypes.instanceOf(List),
  paramsTypeOptions: PropTypes.instanceOf(List),
  updateCondition: PropTypes.func.isRequired,
  removeCondition: PropTypes.func.isRequired,
};

export default PriorityCondition;
