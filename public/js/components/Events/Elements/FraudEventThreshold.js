import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import { FormGroup, Col } from 'react-bootstrap';
import isNumber from 'is-number';
import Field from '../../Field';
import UsageTypesSelector from '../../UsageTypes/UsageTypesSelector';


class FraudEventThreshold extends Component {

  static propTypes = {
    threshold: PropTypes.instanceOf(Immutable.Map),
    index: PropTypes.number.isRequired,
    eventUsaget: PropTypes.instanceOf(Immutable.Set),
    thresholdFieldsSelectOptions: PropTypes.array,
    thresholdOperatorsSelectOptions: PropTypes.array,
    onUpdate: PropTypes.func.isRequired,
  }

  static defaultProps = {
    threshold: Immutable.Map(),
    eventUsaget: Immutable.Set(),
    thresholdFieldsSelectOptions: [],
    thresholdOperatorsSelectOptions: [],
  }

  componentWillReceiveProps(nextProps) {
    const { index, eventUsaget } = this.props;
    if (!Immutable.is(eventUsaget, nextProps.eventUsaget)) {
      this.props.onUpdate([index], Immutable.Map());
    }
  }

  onChangeThresholdField = (value) => {
    const { index } = this.props;
    this.props.onUpdate([index, 'field'], value);
  }

  onChangeThresholdOperator = (value) => {
    const { index } = this.props;
    this.props.onUpdate([index, 'op'], value);
  }

  onChangeThresholdValue = (e) => {
    const { index } = this.props;
    const { value } = e.target;
    const val = isNumber(value) ? parseFloat(value) : value;
    this.props.onUpdate([index, 'value'], val);
  }

  onChangeThresholdUnit = (value) => {
    const { index, eventUsaget } = this.props;
    this.props.onUpdate([index, 'unit'], value);
    this.props.onUpdate([index, 'usaget'], eventUsaget.first());
  }

  render() {
    const {
      threshold,
      eventUsaget,
      thresholdFieldsSelectOptions,
      thresholdOperatorsSelectOptions,
    } = this.props;
    return (
      <FormGroup className="form-inner-edit-row">
        <Col smHidden mdHidden lgHidden>
          <label htmlFor="field_field">Field</label>
        </Col>
        <Col sm={3}>
          <Field
            id="threshold_field"
            fieldType="select"
            options={thresholdFieldsSelectOptions}
            onChange={this.onChangeThresholdField}
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
            onChange={this.onChangeThresholdOperator}
            value={threshold.getIn(['op'], '')}
          />
        </Col>

        <Col smHidden mdHidden lgHidden>
          <label htmlFor="threshold_value">Value</label>
        </Col>
        <Col sm={4}>
          <Field
            fieldType="number"
            id="threshold_value"
            onChange={this.onChangeThresholdValue}
            value={threshold.getIn(['value'], '')}
          />
        </Col>

        {eventUsaget.size === 1 && (
          <span>
            <Col smHidden mdHidden lgHidden>
              <label htmlFor="threshold_operator">Unit of measure</label>
            </Col>
            <Col sm={2}>
              <UsageTypesSelector
                usaget={eventUsaget.first()}
                unit={threshold.get('unit', '')}
                onChangeUnit={this.onChangeThresholdUnit}
                enabled={true}
                showUnits={true}
                showSelectTypes={false}
              />
            </Col>
          </span>
        )}
      </FormGroup>
    );
  }
}

export default FraudEventThreshold;
