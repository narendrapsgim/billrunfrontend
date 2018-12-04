import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import { FormGroup, Col, ControlLabel, InputGroup, DropdownButton, MenuItem } from 'react-bootstrap';
import Field from '../../Field';
import {
  gitTimeOptions,
  gitPeriodLabel,
} from '../EventsUtil';


const FraudEventDetails = ({ item, onUpdate }) => {
  const recurrenceUnit = item.getIn(['recurrence', 'type'], '');
  const recurrenceUnitTitle = gitPeriodLabel(recurrenceUnit);
  const recurrenceOptions = gitTimeOptions(recurrenceUnit);
  const dateRangeUnit = item.getIn(['date_range', 'type'], '');
  const dateRangeUnitTitle = gitPeriodLabel(dateRangeUnit);
  const dateRangeOptions = gitTimeOptions(dateRangeUnit);

  const onChaneEventCode = (e) => {
    const { value } = e.target;
    onUpdate(['event_code'], value);
  };
  const onChangeLinesOverlap = (e) => {
    const { value } = e.target;
    onUpdate(['lines_overlap'], value);
  };
  const onChangeRecurrenceValue = (value) => {
    onUpdate(['recurrence', 'value'], value);
  };
  const onChangeRecurrenceType = (value) => {
    onUpdate(['recurrence', 'type'], value);
    onUpdate(['recurrence', 'value'], '');
  };
  const onChangeDateRangeType = (value) => {
    onUpdate(['date_range', 'type'], value);
    onUpdate(['date_range', 'value'], '');
  };
  const onChangeDateRangeValue = (value) => {
    onUpdate(['date_range', 'value'], value);
  };
  return (
    <Col sm={12}>
      <FormGroup>
        <Col componentClass={ControlLabel} sm={3}>
          Event Code
        </Col>
        <Col sm={7}>
          <Field
            onChange={onChaneEventCode}
            value={item.get('event_code', '')}
          />
        </Col>
      </FormGroup>
      <FormGroup>
        <Col componentClass={ControlLabel} sm={3}>
          Run every
        </Col>
        <Col sm={7}>
          <InputGroup>
            <Field
              fieldType="select"
              options={recurrenceOptions}
              value={item.getIn(['recurrence', 'value'], '')}
              onChange={onChangeRecurrenceValue}
            />
            <DropdownButton
              id="balance-period-unit"
              componentClass={InputGroup.Button}
              title={recurrenceUnitTitle}
            >
              <MenuItem eventKey="minutely" onSelect={onChangeRecurrenceType}>Minutes</MenuItem>
              <MenuItem eventKey="hourly" onSelect={onChangeRecurrenceType}>Hours</MenuItem>
            </DropdownButton>
          </InputGroup>
        </Col>
      </FormGroup>
      <FormGroup>
        <Col componentClass={ControlLabel} sm={3}>
          For the previous
        </Col>
        <Col sm={7}>
          <InputGroup>
            <Field
              fieldType="select"
              options={dateRangeOptions}
              value={item.getIn(['date_range', 'value'], '')}
              onChange={onChangeDateRangeValue}
            />
            <DropdownButton
              id="balance-period-unit"
              componentClass={InputGroup.Button}
              title={dateRangeUnitTitle}
            >
              <MenuItem eventKey="minutely" onSelect={onChangeDateRangeType}>Minutely</MenuItem>
              <MenuItem eventKey="hourly" onSelect={onChangeDateRangeType}>Hourly</MenuItem>
            </DropdownButton>
          </InputGroup>
        </Col>
      </FormGroup>
      <FormGroup>
        <Col componentClass={ControlLabel} sm={3}>
          &nbsp;
        </Col>
        <Col sm={7} style={{ marginTop: 10, paddingLeft: 18 }}>
          <Field
            fieldType="checkbox"
            id="computed-must-met"
            value={item.get('lines_overlap', '')}
            onChange={onChangeLinesOverlap}
            label={'Events\' lines overlap is allowed'}
          />
        </Col>
      </FormGroup>
    </Col>
  );
};

FraudEventDetails.propTypes = {
  item: PropTypes.instanceOf(Immutable.Map),
  onUpdate: PropTypes.func.isRequired,
};

FraudEventDetails.defaultProps = {
  item: Immutable.Map(),
};


export default FraudEventDetails;
