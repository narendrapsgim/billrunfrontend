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
import {
  eventConditionsOperatorsSelectOptionsSelector,
} from '../../../selectors/eventSelectors';


class EventFraudForm extends Component {

  static propTypes = {
    item: PropTypes.instanceOf(Immutable.Map),
    updateField: PropTypes.func.isRequired,
    mode: PropTypes.string,
    conditionsOperators: PropTypes.array,
    propertyTypes: PropTypes.instanceOf(Immutable.List),
    usageTypesData: PropTypes.instanceOf(Immutable.List),
    currency: PropTypes.string,
  };

  static defaultProps = {
    item: Immutable.Map(),
    mode: 'create',
    conditionsOperators: Immutable.List(),
    propertyTypes: Immutable.List(),
    usageTypesData: Immutable.List(),
    currency: '',
  };

  onChangeText = path => (e) => {
    const { value } = e.target;
    this.props.updateField(path, value);
  };

  onChangeSelect = path => (value) => {
    this.props.updateField(path, value);
  }

  onChangePeriod = path => (value) => {
    this.props.updateField([...path, 'type'], value);
    this.props.updateField([...path, 'value'], '');
  }

  onRemoveCondition = index => () => {
    const { item } = this.props;
    const conditions = item.get('conditions', Immutable.List()).delete(index);
    this.props.updateField(['conditions'], conditions);
  }

  onAddCondition = () => {
    const { item } = this.props;
    const conditions = Immutable.List([
      ...item.get('conditions', Immutable.List()),
      Immutable.Map({ field: '', op: '', value: '' }),
    ]);
    this.props.updateField(['conditions'], conditions);
  }

  onChangeFields = (fields) => {
    const { item } = this.props;
    const fieldsList = Immutable.List((fields.length) ? fields.split(',') : []);
    if (fieldsList.isEmpty()) {
      return this.props.updateField('conditions', Immutable.List());
    }
    const curentFields = item.getIn(['conditions'], Immutable.List()).map(condition => condition.get('field'));
    const newConditions = fieldsList.map(condition => (curentFields.includes(condition)
      ? item.getIn(['conditions']).find(cond => cond.get('field', '') === condition)
      : Immutable.Map({ field: condition, op: '' })
    ));
    return this.props.updateField(['conditions'], newConditions);
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
    const { item, conditionsOperators } = this.props;
    const conditionFilterOptions = [
      { value: 'rate', label: 'Product' },
      { value: 'inpu_processor', label: 'Input Processor' },
    ];
    return (
      <FormGroup className="form-inner-edit-row">
        <Col smHidden mdHidden lgHidden>
          <label htmlFor="condition_filter">Filter</label>
        </Col>
        <Col sm={4}>
          <Field
            id="condition_field"
            fieldType="select"
            options={conditionFilterOptions}
            onChange={this.onChangeSelect(['conditions', index, 'field'])}
            value={item.getIn(['conditions', index, 'field'], '')}
          />
        </Col>

        <Col smHidden mdHidden lgHidden>
          <label htmlFor="condition_operator">Operator</label>
        </Col>
        <Col sm={3}>
          <Field
            id="condition_operator"
            fieldType="select"
            options={conditionsOperators}
            onChange={this.onChangeSelect(['conditions', index, 'op'])}
            value={item.getIn(['conditions', index, 'op'], '')}
          />
        </Col>

        <Col smHidden mdHidden lgHidden>
          <label htmlFor="condition_value">Value</label>
        </Col>
        <Col sm={3}>
          <Field
            id="condition_value"
            onChange={this.onChangeText(['conditions', index, 'value'])}
            value={item.getIn(['conditions', index, 'value'], '')}
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
    const conditionsRows = item.get('conditions', Immutable.List()).map(this.renderCondition);
    const disableAdd = false; // fieldsOptions.isEmpty();
    const disableCreateNewtitle = disableAdd ? 'No more filter options' : '';
    return (
      <Row className="report-editor-conditions">
        <Col sm={12}>
          { !conditionsRows.isEmpty() ? (
            <FormGroup className="form-inner-edit-row">
              <Col sm={4} xsHidden><label htmlFor="field_field">Filter</label></Col>
              <Col sm={3} xsHidden><label htmlFor="operator_field">Operator</label></Col>
              <Col sm={3} xsHidden><label htmlFor="value_field">Value</label></Col>
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
    const { item } = this.props;
    const thresholdOptions = [
      { value: 'usagev', label: 'Usagev' },
      { value: 'aprice', label: 'Aprice' },
    ];
    const thresholdOperatorOptions = [
      { value: '$gt', label: 'Greater then' },
      { value: '$gte', label: 'Greater then or equal' },
    ];
    const thresholdUomOptions = [
      { value: 'min', label: 'Minutes' },
      { value: 'sec', label: 'Seconds' },
    ];
    return (
      <Col sm={12}>
        <FormGroup className="form-inner-edit-row">
          <Col sm={3} xsHidden><label htmlFor="threshold_field">Field</label></Col>
          <Col sm={3} xsHidden><label htmlFor="threshold_operator">Operator</label></Col>
          <Col sm={4} xsHidden><label htmlFor="threshold_value">Value</label></Col>
          <Col sm={2} xsHidden><label htmlFor="threshold_uof">UOM</label></Col>
        </FormGroup>
        <FormGroup className="form-inner-edit-row">
          <Col smHidden mdHidden lgHidden>
            <label htmlFor="field_field">Field</label>
          </Col>
          <Col sm={3}>
            <Field
              id="threshold_field"
              fieldType="select"
              options={thresholdOptions}
              onChange={this.onChangeSelect(['threshold_conditions', 0, 'field'])}
              value={item.getIn(['threshold_conditions', 0, 'field'], '')}
            />
          </Col>

          <Col smHidden mdHidden lgHidden>
            <label htmlFor="threshold_operator">Operator</label>
          </Col>
          <Col sm={3}>
            <Field
              id="threshold_operator"
              fieldType="select"
              options={thresholdOperatorOptions}
              onChange={this.onChangeSelect(['threshold_conditions', 0, 'op'])}
              value={item.getIn(['threshold_conditions', 0, 'op'], '')}
            />
          </Col>

          <Col smHidden mdHidden lgHidden>
            <label htmlFor="threshold_value">Value</label>
          </Col>
          <Col sm={4}>
            <Field
              id="threshold_value"
              onChange={this.onChangeText(['threshold_conditions', 0, 'value'])}
              value={item.getIn(['threshold_conditions', 0, 'value'], '')}
            />
          </Col>

          <Col smHidden mdHidden lgHidden>
            <label htmlFor="threshold_operator">UOM</label>
          </Col>
          <Col sm={2}>
            <Field
              id="threshold_uom"
              fieldType="select"
              options={thresholdUomOptions}
              onChange={this.onChangeSelect(['threshold_conditions', 0, 'uom'])}
              value={item.getIn(['threshold_conditions', 0, 'uom'], '')}
            />
          </Col>
        </FormGroup>
      </Col>
    );
  }


  renderDetails = () => {
    const { item } = this.props;
    const recurrenceUnit = item.getIn(['recurrence', 'type'], '');
    const recurrenceUnitTitle = (recurrenceUnit === '')
      ? 'Select unit...'
      : titleCase(recurrenceUnit);
    const recurrenceOptions = this.gitTimeOptions(recurrenceUnit);
    const dateRangeUnit = item.getIn(['date_range', 'type'], '');
    const dateRangeUnitTitle = (dateRangeUnit === '')
      ? 'Select unit...'
      : titleCase(dateRangeUnit);
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
              <DropdownButton
                id="balance-period-unit"
                componentClass={InputGroup.Button}
                title={recurrenceUnitTitle}
              >
                <MenuItem eventKey="minutely" onSelect={this.onChangePeriod(['recurrence'])}>Minutely</MenuItem>
                <MenuItem eventKey="hourly" onSelect={this.onChangePeriod(['recurrence'])}>Hourly</MenuItem>
              </DropdownButton>
              <Field
                fieldType="select"
                options={recurrenceOptions}
                value={item.getIn(['recurrence', 'value'], '')}
                onChange={this.onChangeSelect(['recurrence', 'value'])}
              />
            </InputGroup>
          </Col>
        </FormGroup>
        <FormGroup>
          <Col componentClass={ControlLabel} sm={3}>
            For the previous
          </Col>
          <Col sm={7}>
            <InputGroup>
              <DropdownButton
                id="balance-period-unit"
                componentClass={InputGroup.Button}
                title={dateRangeUnitTitle}
              >
                <MenuItem eventKey="minutely" onSelect={this.onChangePeriod(['date_range'])}>Minutely</MenuItem>
                <MenuItem eventKey="hourly" onSelect={this.onChangePeriod(['date_range'])}>Hourly</MenuItem>
              </DropdownButton>
              <Field
                fieldType="select"
                options={dateRangeOptions}
                value={item.getIn(['date_range', 'value'], '')}
                onChange={this.onChangeSelect(['date_range', 'value'])}
              />
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
  conditionsOperators: eventConditionsOperatorsSelectOptionsSelector(null, { eventType: 'fraud' }),
});

export default connect(mapStateToProps)(EventFraudForm);
