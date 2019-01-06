import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import { FormGroup, Col, ControlLabel, InputGroup, DropdownButton, MenuItem } from 'react-bootstrap';
import Field from '../../Field';
import {
  gitTimeOptions,
  gitPeriodLabel,
} from '../EventsUtil';


const FraudEventDetails = ({ item, eventsSettings, onUpdate }) => {
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
  const onChaneEventDescription = (e) => {
    const { value } = e.target;
    onUpdate(['event_description'], value);
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
  const onChangeActive = (e) => {
    const { value } = e.target;
    onUpdate(['active'], value === 'yes');
  };

  const onChangeNotifyByEmailAdresses = (emails) => {
    const emailsList = Immutable.List((emails.length) ? emails.split(',') : []);
    if (emailsList.includes('global')) {
      onUpdate(['notify_by_email', 'use_global_addresses'], true);
    } else {
      onUpdate(['notify_by_email', 'use_global_addresses'], false);
    }
    const globalIndex = emailsList.findIndex(email => email === 'global');
    const emailsListWithoutGlobal = (globalIndex === -1)
      ? emailsList
      : emailsList.remove(globalIndex);
    onUpdate(['notify_by_email', 'additional_addresses'], emailsListWithoutGlobal);
  };

  const onChangeNotifyByEmailStatus = (e) => {
    const { value } = e.target;
    onUpdate(['notify_by_email', 'notify'], value);
    onUpdate(['notify_by_email', 'use_global_addresses'], value);
    if (!value) {
      onUpdate(['notify_by_email', 'additional_addresses'], Immutable.List());
    }
  };

  const prepareEmailAddressesValue = () => {
    const emails = item.getIn(['notify_by_email', 'additional_addresses'], Immutable.List());
    const useGlobalAddresses = item.getIn(['notify_by_email', 'use_global_addresses'], false);
    if (useGlobalAddresses) {
      return emails.insert(0, 'global').toArray();
    }
    return emails.toArray();
  };

  const globalAddresses = eventsSettings.getIn(['email', 'global_addresses'], Immutable.List()).join(', ');
  const emailAddressesSelectOptions = [
    { value: 'global', label: `Global emails (${globalAddresses})` },
  ];
  const emailAdderssesValue = prepareEmailAddressesValue();
  const isNotifyByEmail = item.getIn(['notify_by_email', 'notify'], false);
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
          Description
        </Col>
        <Col sm={7}>
          <Field
            onChange={onChaneEventDescription}
            value={item.get('event_description', '')}
          />
        </Col>
      </FormGroup>
      <FormGroup>
        <Col componentClass={ControlLabel} sm={3}>
          Notify also by email
        </Col>
        <Col sm={7}>
          <InputGroup>
            <InputGroup.Addon>
              <Field
                fieldType="checkbox"
                id="computed-must-met"
                value={isNotifyByEmail}
                onChange={onChangeNotifyByEmailStatus}
                label=""
              />
            </InputGroup.Addon>
            <Field
              allowCreate={true}
              multi={true}
              placeholder={isNotifyByEmail ? 'Select or add new email address' : 'No'}
              addLabelText="Add {label}?"
              noResultsText="Type email address..."
              clearable={true}
              fieldType="select"
              options={emailAddressesSelectOptions}
              value={emailAdderssesValue}
              onChange={onChangeNotifyByEmailAdresses}
              disabled={!isNotifyByEmail}
            />
          </InputGroup>
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
        <Col componentClass={ControlLabel} sm={3}>Status</Col>
        <Col sm={7}>
          <span>
            <span style={{ display: 'inline-block', marginRight: 20 }}>
              <Field
                fieldType="radio"
                onChange={onChangeActive}
                name="step-active-status"
                value="yes"
                label="Active"
                checked={item.get('active', true)}
              />
            </span>
            <span style={{ display: 'inline-block' }}>
              <Field
                fieldType="radio"
                onChange={onChangeActive}
                name="step-active-status"
                value="no"
                label="Not Active"
                checked={!item.get('active', true)}
              />
            </span>
          </span>
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
  eventsSettings: PropTypes.instanceOf(Immutable.Map),
  onUpdate: PropTypes.func.isRequired,
};

FraudEventDetails.defaultProps = {
  item: Immutable.Map(),
  eventsSettings: Immutable.Map(),
};


export default FraudEventDetails;
