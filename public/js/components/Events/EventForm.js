import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import { Form, FormGroup, Col, ControlLabel, Button } from 'react-bootstrap';
import Select from 'react-select';
import Field from '../Field';
import { ModalWrapper } from '../Elements';
import { getConfig } from '../../common/Util';

const EventForm = (props) => {
  const { item, onCancel, onSave, onUpdateField } = props;

  const onChangeField = path => (e) => {
    const { value } = e.target;
    onUpdateField(path, value);
  };

  const onChangeSelectField = path => (value) => {
    onUpdateField(path, value);
  };

  const getConditionTypes = () => (getConfig(['events', 'conditions'], Immutable.Map()).map(condType => (
    { value: condType.get('key', ''), label: condType.get('title', '') })).toArray()
  );

  const addCondition = () => {
    const conditions = item.get('conditions', Immutable.List()).push(Immutable.Map());
    onUpdateField(['conditions'], conditions);
  };

  const removeCondition = index => () => {
    const conditions = item.get('conditions', Immutable.List()).delete(index);
    onUpdateField(['conditions'], conditions);
  };

  const renderCondition = (condition, index) => (
    <FormGroup className="form-inner-edit-row" key={index}>
      <Col sm={4}>
        <Field
          id={`cond-path-${index}`}
          onChange={onChangeField(['conditions', index, 'path'])}
          value={condition.get('path', '')}
        />
      </Col>
      <Col sm={4}>
        <Select
          id={`cond-type-${index}`}
          onChange={onChangeSelectField(['conditions', index, 'type'])}
          value={condition.get('type', '')}
          options={getConditionTypes()}
        />
      </Col>
      <Col sm={3}>
        <Field
          id={`cond-value-${index}`}
          onChange={onChangeField(['conditions', index, 'value'])}
          value={condition.get('value', '')}
        />
      </Col>
      <Col sm={1}>
        <Button onClick={removeCondition(index)} bsStyle="link">
          <i className="fa fa-fw danger-red fa-trash-o" />
        </Button>
      </Col>
    </FormGroup>
  );

  const renderAddConditionButton = () => (
    <Button className="btn-primary" onClick={addCondition}><i className="fa fa-plus" />&nbsp;Add New Condition</Button>
  );

  const renderConditions = () => (
    item.get('conditions', Immutable.List()).map(renderCondition).toArray()
  );

  const renderConditionsHeader = () => (
    <FormGroup className="form-inner-edit-row">
      <Col sm={4}>
        <strong>Path</strong>
      </Col>
      <Col sm={4}>
        <strong>Type</strong>
      </Col>
      <Col sm={3}>
        <strong>Value</strong>
      </Col>
    </FormGroup>
  );

  return (
    <ModalWrapper title={`Event ${item.get('event_code', '')}`} show={true} onOk={onSave} onCancel={onCancel} labelOk="Save" >
      <Form horizontal>

        <FormGroup>
          <Col componentClass={ControlLabel} md={4}>
            Event Code
          </Col>
          <Col sm={5}>
            <Field id="label" onChange={onChangeField(['event_code'])} value={item.get('event_code', '')} />
          </Col>
        </FormGroup>

        <FormGroup>
          <Col sm={12}>
            { renderConditionsHeader() }
          </Col>
          <Col sm={12}>
            { renderConditions() }
          </Col>
          <Col sm={12}>
            { renderAddConditionButton() }
          </Col>
        </FormGroup>

      </Form>
    </ModalWrapper>
  );
};

EventForm.propTypes = {
  item: PropTypes.instanceOf(Immutable.Map),
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onUpdateField: PropTypes.func.isRequired,
};

EventForm.defaultProps = {
  item: Immutable.Map(),
};

export default EventForm;
