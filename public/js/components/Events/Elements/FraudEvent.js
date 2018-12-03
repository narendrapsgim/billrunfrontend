import React, { PropTypes, Component } from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { Form, FormGroup, Row, Col, HelpBlock, ControlLabel, Button, Panel, InputGroup, DropdownButton, MenuItem } from 'react-bootstrap';
import { titleCase } from 'change-case';
import { CreateButton } from '../../Elements';
import Field from '../../Field';
import {
  usageTypesDataSelector,
  propertyTypeSelector,
  currencySelector,
} from '../../../selectors/settingsSelector';
import ConditionValue from '../../Report/Editor/ConditionValue';

import {
  eventConditionsFilterOptionsSelector,
  eventConditionsOperatorsSelectOptionsSelector,
  eventConditionsFieldsSelectOptionsSelector,
  eventThresholdOperatorsSelector,
  eventThresholdOperatorsSelectOptionsSelector,
  eventThresholdFieldsSelectOptionsSelector,
} from '../../../selectors/eventSelectors';
import { getSettings } from '../../../actions/settingsActions';

class FraudEvent extends Component {

  static propTypes = {
    item: PropTypes.instanceOf(Immutable.Map),
    updateField: PropTypes.func.isRequired,
    mode: PropTypes.string,
    conditionsFieldSelectOptions: PropTypes.array,
    conditionsOperatorsSelectOptions: PropTypes.array,
    thresholdFieldsSelectOptions: PropTypes.array,
    thresholdOperatorsSelectOptions: PropTypes.array,
    conditionsFields: PropTypes.instanceOf(Immutable.List),
    conditionsOperators: PropTypes.instanceOf(Immutable.List),
    propertyTypes: PropTypes.instanceOf(Immutable.List),
    usageTypesData: PropTypes.instanceOf(Immutable.List),
    currency: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
  };

  static defaultProps = {
    item: Immutable.Map(),
    mode: 'create',
    conditionsOperatorsSelectOptions: Immutable.List(),
    thresholdOperatorsSelectOptions: Immutable.List(),
    conditionsFieldSelectOptions: Immutable.List(),
    thresholdFieldsSelectOptions: Immutable.List(),
    conditionsFields: Immutable.List(),
    conditionsOperators: Immutable.List(),
    propertyTypes: Immutable.List(),
    usageTypesData: Immutable.List(),
    currency: '',
  };

  componentDidMount() {
    this.props.dispatch(getSettings(['lines.fields']));
  }

  onChangeText = path => (e) => {
    const { value } = e.target;
    this.props.updateField(path, value);
  };

  onChangeSelect = path => (value) => {
    this.props.updateField(path, value);
  }

  onChangeConditionsField = index => (field) => {
    const condition = Immutable.Map({
      field,
      op: '',
      value: Immutable.List(),
    });
    this.props.updateField(['conditions', 0, index], condition);
  }

  onChangeConditionsValue = index => (value) => {
    const values = Immutable.List((value.length) ? value.split(',') : []);
    this.props.updateField(['conditions', 0, index, 'value'], values);
  }

  onChangePeriod = path => (value) => {
    this.props.updateField([...path, 'type'], value);
    this.props.updateField([...path, 'value'], '');
  }

  onRemoveCondition = index => () => {
    const { item } = this.props;
    const conditions = item.getIn(['conditions', 0], Immutable.List()).delete(index);
    this.props.updateField(['conditions', 0], conditions);
  }

  onAddCondition = () => {
    const { item } = this.props;
    const conditions = Immutable.List([
      ...item.getIn(['conditions', 0], Immutable.List()),
      Immutable.Map({ field: '', op: '', value: Immutable.List() }),
    ]);
    this.props.updateField(['conditions', 0], conditions);
  }

  gitPeriodLabel = (value) => {
    switch (value) {
      case 'minutely':
        return 'Minutes';
      case 'hourly':
        return 'Hours';
      default:
        return 'Select unit...';
    }
  }

  gitTimeOptions = (value) => {
    if (value === 'minutely') {
      return [{ value: 15, label: '15' }, { value: 30, label: '30' }];
    }
    if (value === 'hourly') {
      return Array.from(new Array(24), (v, k) => k + 1).map(v => ({ value: v, label: v }));
    }
    return [];
  }

  renderCondition = (condition, index) => {
    const {
      conditionsOperatorsSelectOptions,
      conditionsFieldSelectOptions,
      conditionsFields,
      conditionsOperators,
    } = this.props;
    const field = condition.getIn(['field'], '');
    const operator = condition.getIn(['op'], '');
    const disableOp = field === '';
    const disableVal = operator === '' || disableOp;
    const conditionField = conditionsFields.find(condField => condField.get('id', '') === field, null, Immutable.Map());
    const conditionOperator = conditionsOperators.find(condOp => condOp.get('id', '') === operator, null, Immutable.Map());
    const conditionForValue = condition.set('value', condition.get('value', Immutable.List()).join(','));
    return (
      <FormGroup className="form-inner-edit-row" key={`fraud_condition_${index}`}>
        <Col smHidden mdHidden lgHidden>
          <label htmlFor="condition_filter">Filter</label>
        </Col>
        <Col sm={4}>
          <Field
            id="condition_field"
            fieldType="select"
            options={conditionsFieldSelectOptions}
            onChange={this.onChangeConditionsField(index)}
            value={field}
          />
        </Col>

        <Col smHidden mdHidden lgHidden>
          <label htmlFor="condition_operator">Operator</label>
        </Col>
        <Col sm={2}>
          <Field
            id="condition_operator"
            fieldType="select"
            options={conditionsOperatorsSelectOptions}
            onChange={this.onChangeSelect(['conditions', 0, index, 'op'])}
            value={condition.getIn(['op'], '')}
            disabled={disableOp}
          />
        </Col>

        <Col smHidden mdHidden lgHidden>
          <label htmlFor="condition_value">Value</label>
        </Col>
        <Col sm={4}>
          <ConditionValue
            field={conditionForValue}
            config={conditionField}
            operator={conditionOperator}
            disabled={disableVal}
            onChange={this.onChangeConditionsValue(index)}
          />
        </Col>
        <Col sm={2} className="actions">
          <Button onClick={this.onRemoveCondition(index)} bsSize="small" className="pull-left">
            <i className="fa fa-trash-o danger-red" />&nbsp;Remove
          </Button>
        </Col>
      </FormGroup>
    );
  }

  renderConditions = () => {
    const { item } = this.props;
    const conditionsRows = item.getIn(['conditions', 0], Immutable.List()).map(this.renderCondition);
    const disableAdd = false; // fieldsOptions.isEmpty();
    const disableCreateNewtitle = disableAdd ? 'No more filter options' : '';
    return (
      <Row className="report-editor-conditions">
        <Col sm={12}>
          { !conditionsRows.isEmpty() ? (
            <FormGroup className="form-inner-edit-row">
              <Col sm={4} xsHidden><label htmlFor="field_field">Filter</label></Col>
              <Col sm={2} xsHidden><label htmlFor="operator_field">Operator</label></Col>
              <Col sm={4} xsHidden><label htmlFor="value_field">Value</label></Col>
            </FormGroup>
          ) : (
            <HelpBlock>Please add at least one condition</HelpBlock>
          )}
        </Col>
        <Col sm={12}>
          { conditionsRows }
        </Col>
        <Col sm={12}>
          <CreateButton
            onClick={this.onAddCondition}
            label="Add Condition"
            disabled={disableAdd}
            title={disableCreateNewtitle}
          />
        </Col>
      </Row>
    );
  }

  renderThreshold = () => {
    const { item, thresholdOperatorsSelectOptions, thresholdFieldsSelectOptions } = this.props;
    const thresholdUomOptions = [
      { value: 'min', label: 'Minutes' },
      { value: 'sec', label: 'Seconds' },
    ];
    const threshold = item.getIn(['threshold_conditions', 0, 0], Immutable.Map());
    return (
      <Col sm={12}>
        <FormGroup className="form-inner-edit-row">
          <Col sm={3} xsHidden><label htmlFor="threshold_field">Field</label></Col>
          <Col sm={3} xsHidden><label htmlFor="threshold_operator">Operator</label></Col>
          <Col sm={4} xsHidden><label htmlFor="threshold_value">Value</label></Col>
          <Col sm={2} xsHidden><label htmlFor="threshold_uof">Unit of measure</label></Col>
        </FormGroup>
        <FormGroup className="form-inner-edit-row">
          <Col smHidden mdHidden lgHidden>
            <label htmlFor="field_field">Field</label>
          </Col>
          <Col sm={3}>
            <Field
              id="threshold_field"
              fieldType="select"
              options={thresholdFieldsSelectOptions}
              onChange={this.onChangeSelect(['threshold_conditions', 0, 0, 'field'])}
              value={threshold.getIn(['field'], '')}
            />
          </Col>

          <Col smHidden mdHidden lgHidden>
            <label htmlFor="threshold_operator">Operator</label>
          </Col>
          <Col sm={3}>
            <Field
              id="threshold_operator"
              fieldType="select"
              options={thresholdOperatorsSelectOptions}
              onChange={this.onChangeSelect(['threshold_conditions', 0, 0, 'op'])}
              value={threshold.getIn(['op'], '')}
            />
          </Col>

          <Col smHidden mdHidden lgHidden>
            <label htmlFor="threshold_value">Value</label>
          </Col>
          <Col sm={4}>
            <Field
              id="threshold_value"
              onChange={this.onChangeText(['threshold_conditions', 0, 0, 'value'])}
              value={threshold.getIn(['value'], '')}
            />
          </Col>

          <Col smHidden mdHidden lgHidden>
            <label htmlFor="threshold_operator">Unit of measure</label>
          </Col>
          <Col sm={2}>
            <Field
              id="threshold_uom"
              fieldType="select"
              options={thresholdUomOptions}
              onChange={this.onChangeSelect(['threshold_conditions', 0, 0, 'uom'])}
              value={threshold.getIn(['uom'], '')}
            />
          </Col>
        </FormGroup>
      </Col>
    );
  }


  renderDetails = () => {
    const { item } = this.props;
    const recurrenceUnit = item.getIn(['recurrence', 'type'], '');
    const recurrenceUnitTitle = this.gitPeriodLabel(recurrenceUnit);
    const recurrenceOptions = this.gitTimeOptions(recurrenceUnit);
    const dateRangeUnit = item.getIn(['date_range', 'type'], '');
    const dateRangeUnitTitle = this.gitPeriodLabel(dateRangeUnit);
    const dateRangeOptions = this.gitTimeOptions(dateRangeUnit);
    return (
      <Col sm={12}>
        <FormGroup>
          <Col componentClass={ControlLabel} sm={3}>
            Event Code
          </Col>
          <Col sm={7}>
            <Field
              onChange={this.onChangeText(['event_code'])}
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
                onChange={this.onChangeSelect(['recurrence', 'value'])}
              />
              <DropdownButton
                id="balance-period-unit"
                componentClass={InputGroup.Button}
                title={recurrenceUnitTitle}
              >
                <MenuItem eventKey="minutely" onSelect={this.onChangePeriod(['recurrence'])}>Minutes</MenuItem>
                <MenuItem eventKey="hourly" onSelect={this.onChangePeriod(['recurrence'])}>Hours</MenuItem>
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
                onChange={this.onChangeSelect(['date_range', 'value'])}
              />
              <DropdownButton
                id="balance-period-unit"
                componentClass={InputGroup.Button}
                title={dateRangeUnitTitle}
              >
                <MenuItem eventKey="minutely" onSelect={this.onChangePeriod(['date_range'])}>Minutely</MenuItem>
                <MenuItem eventKey="hourly" onSelect={this.onChangePeriod(['date_range'])}>Hourly</MenuItem>
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
              onChange={this.onChangeText(['lines_overlap'])}
              label={'Events\' lines overlap is allowed'}
            />

          </Col>
        </FormGroup>
      </Col>
    );
  }

  render() {
    const { mode } = this.props;
    return (
      <Form horizontal>
        <Panel header={<span>Details</span>}>
          { this.renderDetails() }
        </Panel>
        <Panel header={<span>Conditions</span>} collapsible defaultExpanded={['create', 'clone'].includes(mode)} className="collapsible">
          { this.renderConditions() }
        </Panel>
        <Panel header={<span>Threshold</span>}>
          { this.renderThreshold() }
        </Panel>
      </Form>
    );
  }
}

const mapStateToProps = (state, props) => ({
  propertyTypes: propertyTypeSelector(state, props),
  usageTypesData: usageTypesDataSelector(state, props),
  currency: currencySelector(state, props),
  conditionsFields: eventConditionsFilterOptionsSelector(state, { eventType: 'fraud' }),
  conditionsOperators: eventThresholdOperatorsSelector(state, { eventType: 'fraud' }),
  conditionsOperatorsSelectOptions: eventConditionsOperatorsSelectOptionsSelector(null, { eventType: 'fraud' }),
  conditionsFieldSelectOptions: eventConditionsFieldsSelectOptionsSelector(state, { ...props, eventType: 'fraud' }),
  thresholdOperatorsSelectOptions: eventThresholdOperatorsSelectOptionsSelector(null, { eventType: 'fraud' }),
  thresholdFieldsSelectOptions: eventThresholdFieldsSelectOptionsSelector(state, { ...props, eventType: 'fraud' }),
});

export default connect(mapStateToProps)(FraudEvent);
