import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { FormGroup, Col } from 'react-bootstrap';
import isNumber from 'is-number';
import Field from '../../Field';
import UsageTypesSelector from '../../UsageTypes/UsageTypesSelector';
import {
  currencySelector,
  usageTypesDataSelector,
} from '../../../selectors/settingsSelector';


class FraudEventThreshold extends Component {

  static propTypes = {
    threshold: PropTypes.instanceOf(Immutable.Map),
    index: PropTypes.number.isRequired,
    eventPropertyType: PropTypes.instanceOf(Immutable.Set),
    thresholdFieldsSelectOptions: PropTypes.array,
    thresholdOperatorsSelectOptions: PropTypes.array,
    currency: PropTypes.string,
    usageTypesData: PropTypes.instanceOf(Immutable.List),
    onUpdate: PropTypes.func.isRequired,
  }

  static defaultProps = {
    threshold: Immutable.Map(),
    eventPropertyType: Immutable.Set(),
    thresholdFieldsSelectOptions: [],
    thresholdOperatorsSelectOptions: [],
    currency: '',
    usageTypesData: Immutable.List(),
  }

  componentWillReceiveProps(nextProps) {
    const { index, eventPropertyType } = this.props;
    if (!Immutable.is(eventPropertyType, nextProps.eventPropertyType)) {
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
    const { index, eventPropertyType } = this.props;
    this.props.onUpdate([index, 'unit'], value);
    this.props.onUpdate([index, 'usaget'], eventPropertyType.first());
  }

  render() {
    const {
      threshold,
      eventPropertyType,
      thresholdFieldsSelectOptions,
      thresholdOperatorsSelectOptions,
      usageTypesData,
    } = this.props;
    const usaget = eventPropertyType.size === 1
      ? usageTypesData.find(
          usageTypeData => usageTypeData.get('property_type', '') === eventPropertyType.first(),
          null, Immutable.Map(),
        ).get('usage_type', '')
      : '';
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

        {eventPropertyType.size === 1 && (
          <span>
            <Col smHidden mdHidden lgHidden>
              <label htmlFor="threshold_operator">Unit of measure</label>
            </Col>
            <Col sm={2}>
              <UsageTypesSelector
                usaget={usaget}
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

const mapStateToProps = (state, props) => ({
  currency: currencySelector(state, props),
  usageTypesData: usageTypesDataSelector(state, props),
});

export default connect(mapStateToProps)(FraudEventThreshold);
