import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { FormGroup, Col, ControlLabel, InputGroup } from 'react-bootstrap';
import { upperCaseFirst } from 'change-case'
import Field from '@/components/Field';
import UsageTypesSelector from '../../UsageTypes/UsageTypesSelector';
import { getGroupsOptions } from '@/actions/reportsActions';
import {
  groupsOptionsSelector,
  groupsDataSelector,
  servicesDataSelector,
  propertyTypesSelector,
} from '@/selectors/listSelectors';
import { currencySelector } from '@/selectors/settingsSelector';
import {
  eventConditionsOperatorsSelectOptionsSelector,
} from '@/selectors/eventSelectors';
import {
  getBalanceConditionData,
  getPathParams,
  buildBalanceConditionPath,
  getUnitTitle,
  createGroupOption,
 } from '../EventsUtil';
import {
  getGroupUsaget,
  getUsagePropertyType,
} from '@/common/Util';

class BalanceEventCondition extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    item: PropTypes.instanceOf(Immutable.Map),
    index: PropTypes.number,
    onChangeField: PropTypes.func,
    trigger: PropTypes.string,
    limitation: PropTypes.string,
    activityType: PropTypes.string,
    groupNames: PropTypes.string,
    overGroup: PropTypes.string,
    conditionsOperators: PropTypes.array,
    groupsOptions: PropTypes.instanceOf(Immutable.List),
    propertyTypes: PropTypes.instanceOf(Immutable.List),
    usageTypesData: PropTypes.instanceOf(Immutable.List),
    groupsData: PropTypes.instanceOf(Immutable.Map),
    servicesData: PropTypes.instanceOf(Immutable.Map),
    propertyTypeOptions: PropTypes.instanceOf(Immutable.Set),
    currency: PropTypes.string,
  }

  static defaultProps = {
    item: Immutable.Map(),
    index: -1,
    onChangeField: () => {},
    trigger: '',
    limitation: '',
    activityType: '',
    groupNames: '',
    overGroup: 'none',
    conditionsOperators: [],
    groupsOptions: Immutable.List(),
    propertyTypes: Immutable.List(),
    usageTypesData: Immutable.List(),
    groupsData: Immutable.Map(),
    servicesData: Immutable.Map(),
    propertyTypeOptions: Immutable.Set(),
    currency: '',
  }

  state = {
    unitLabel: '',
  };

  componentDidMount() {
    this.props.dispatch(getGroupsOptions());
  }

  onChangeTrigger = (e) => {
    const { onChangeField, item, index, limitation, servicesData } = this.props;
    const { value } = e.target;
    const limitationToSave = (value === 'usagev' && limitation === 'none' ? 'group' : limitation);
    const paths = buildBalanceConditionPath(value, limitationToSave, { activityType: '', groupNames: '', overGroup: '', servicesData });
    const condition = item.withMutations((itemWithMutation) => {
      itemWithMutation.set('paths', paths);
      itemWithMutation.set('unit', '');
      itemWithMutation.set('usaget', '');
      itemWithMutation.set('property_type', '');
    });
    onChangeField(['conditions', index], condition);
  };

  onChangeOverGroup = (e) => {
    const { onChangeField, index, trigger, activityType, groupNames, limitation, servicesData } = this.props;
    const { value } = e.target;
    const paths = buildBalanceConditionPath(trigger, limitation,
      { activityType, groupNames, overGroup: value, servicesData }
    );
    onChangeField(['conditions', index, 'paths'], paths);
  }

  onChangeLimitation = (e) => {
    const { onChangeField, index, trigger, activityType, groupNames, servicesData } = this.props;
    const { value } = e.target;
    const params = { activityType, groupNames, overGroup: '', servicesData };
    const paths = buildBalanceConditionPath(trigger, value, params);
    onChangeField(['conditions', index, 'paths'], paths);
    onChangeField(['conditions', index, 'property_type'], '');
  };

  onChangePropertyType = (propertyType) => {
    const { onChangeField, item, index, trigger, limitation, servicesData } = this.props;
    const paths = buildBalanceConditionPath(trigger, limitation, { activityType: '', groupNames: '', overGroup: '', servicesData });
    const condition = item.withMutations((itemWithMutation) => {
      itemWithMutation.set('property_type', propertyType);
      itemWithMutation.set('paths', paths);
      itemWithMutation.set('unit', '');
      itemWithMutation.set('usaget', '');
    });
    onChangeField(['conditions', index], condition);
  };

  onChangeActivityType = (value) => {
    const { onChangeField, item, index, trigger, limitation, overGroup, servicesData } = this.props;
    const paths = buildBalanceConditionPath(trigger, limitation, { activityType: value, groupNames: '', overGroup, servicesData });
    const condition = item.withMutations((itemWithMutation) => {
      itemWithMutation.set('paths', paths);
      itemWithMutation.set('unit', '');
      itemWithMutation.set('usaget', value);
    });
    onChangeField(['conditions', index], condition);
  };

  onChangeGroupNames = (value) => {
    const { onChangeField, item, index, trigger, limitation, servicesData } = this.props;
    const paths = buildBalanceConditionPath(trigger, limitation, { activityType: '', groupNames: value, servicesData });
    const unit = value !== '' ? this.getGroupUnit(value.split(',').pop()) : '';
    const usaget = value !== '' ? this.getGroupActivityType(value.split(',').pop()) : '';

    const condition = item.withMutations((itemWithMutation) => {
      itemWithMutation.set('paths', paths);
      itemWithMutation.set('unit', unit);
      itemWithMutation.set('usaget', usaget);
    });
    onChangeField(['conditions', index], condition);
  };

  onChangeType = (value) => {
    const { onChangeField, index, item } = this.props;
    if (value === 'reached_percentage') {
      const convertedCondition = item.set('type', value).set('unit', '');
      onChangeField(['conditions', index], convertedCondition);
    } else {
      onChangeField(['conditions', index, 'type'], value);
    }
  };

  onChangeValue = (e) => {
    const { onChangeField, index } = this.props;
    const { value } = e.target;
    onChangeField(['conditions', index, 'value'], value);
  };

  onChangeTagValue = (e) => {
    const { onChangeField, index } = this.props;
    onChangeField(['conditions', index, 'value'], e);
  };

  onChangeUnit = (unit) => {
    const { onChangeField, index } = this.props;
    onChangeField(['conditions', index, 'unit'], unit);
  };

  filterRelevantGroups = (group) => {
    const { trigger, usageTypesData, item, groupsData } = this.props;
    const isRelevant = item.get('property_type', '') === getUsagePropertyType(usageTypesData, groupsData.getIn([group, 'usage_types']).keySeq().first());
    return (trigger === 'usagev' && !this.props.groupsData.hasIn([group, 'cost']) && isRelevant) ||
      (trigger === 'cost' && !this.props.groupsData.hasIn([group, 'cost']) && isRelevant);
  }

  getGroupNamesOptions = () => this.props.groupsOptions
    .filter(this.filterRelevantGroups)
    .map(group => createGroupOption(group, this.props.servicesData))
    .toArray();

  getPropertyTypesOptions = () => this.props.propertyTypeOptions
    .map(propType => ({ value: propType, label: upperCaseFirst(propType) }))
    .toArray();

  getGroupUnit = group => this.props.groupsData.getIn([group, 'unit'], '');
  
  getGroupActivityType = group => getGroupUsaget(this.props.groupsData.get(group, Immutable.Map()));

  onChangeMultiValues = (e) => {
    if (Array.isArray(e)) {
      this.onChangeTagValue(e.join(','));
    } else {
      this.onChangeTagValue('');
    }
  };
  renderCustomInputNumber =({ addTag, onChange, value, ...other }) => (
    <input type="number" onChange={onChange} value={value} {...other} />
  );

  render() {
    const {
      item,
      index,
      conditionsOperators,
      trigger,
      limitation,
      activityType,
      groupNames,
      overGroup,
      propertyTypes,
      usageTypesData,
      currency,
    } = this.props;

    const usaget = (limitation === 'group' ? item.get('usaget', '') : activityType);
    const propertyType = item.get('property_type', '');
    const unitLabel = getUnitTitle(item.get('unit', ''), trigger, usaget, propertyTypes, usageTypesData, currency, item.get('type', ''))
    const selectedConditionData = getBalanceConditionData(item.get('type', ''));
    const UomEnabled = trigger === 'usagev' && limitation === 'group' && groupNames !== '' && item.get('type', '') !== 'reached_percentage';
    return (
      <Col sm={12}>

        <FormGroup>
          <Col sm={4} smOffset={1} className="text-left" componentClass={ControlLabel}>Condition Trigger: </Col>
          <Col sm={7} className="pl30">
            <Col sm={12}>
              <span className="inline mr40">
                <Field
                  fieldType="radio"
                  name={`condition-trigger-${index}`}
                  id={`condition-trigger-monetary-${index}`}
                  value="cost"
                  checked={trigger === 'cost'}
                  onChange={this.onChangeTrigger}
                  label="Monetary"
                />
              </span>
              <span className="inline">
                <Field
                  fieldType="radio"
                  name={`condition-trigger-${index}`}
                  id={`condition-trigger-usagev-${index}`}
                  value="usagev"
                  checked={trigger === 'usagev'}
                  onChange={this.onChangeTrigger}
                  label="Usage"
                />
              </span>
            </Col>
          </Col>
        </FormGroup>

        <FormGroup>
          <Col sm={11} smOffset={1} className="text-left" componentClass={ControlLabel}>Condition Limitations: </Col>
          <Col sm={10} smOffset={2}>
            <Field
              fieldType="radio"
              name={`condition-limitation-${index}`}
              id={`condition-limitation-none-${index}`}
              value="none"
              checked={limitation === 'none'}
              onChange={this.onChangeLimitation}
              disabled={trigger === 'usagev'}
              label="Total Amount"
            />
          </Col>
          <Col sm={10} smOffset={2}>
            <Field
              fieldType="radio"
              name={`condition-limitation-${index}`}
              id={`condition-limitation-group-${index}`}
              value="group"
              checked={limitation === 'group'}
              onChange={this.onChangeLimitation}
              label="Limit to any of the Groups"
            />
          </Col>
          <Col sm={10} smOffset={2}>
            <Col sm={4} componentClass={ControlLabel}> Property Type </Col>
            <Col sm={8} className="form-inner-edit-row">
              <Field
                fieldType="select"
                id={`condition-limitation-property-type-${index}`}
                onChange={this.onChangePropertyType}
                value={propertyType}
                options={this.getPropertyTypesOptions()}
                disabled={limitation !== 'group'}
              />
            </Col>

            <Col sm={4} componentClass={ControlLabel}> Groups Included </Col>
            <Col sm={8} className="form-inner-edit-row">
              <Field
                fieldType="select"
                onChange={this.onChangeGroupNames}
                value={groupNames}
                options={this.getGroupNamesOptions()}
                disabled={limitation !== 'group' || propertyType === ''}
                multi={true}
              />
            </Col>
            { limitation === 'group' && <Col sm={4} componentClass={ControlLabel}> Units of Measure </Col> }
            <Col sm={8} className="form-inner-edit-row">
              <UsageTypesSelector
                usaget={usaget}
                unit={groupNames !== '' ? item.get('unit', '') : ''}
                onChangeUsaget={this.onChangeActivityType}
                onChangeUnit={this.onChangeUnit}
                enabled={UomEnabled}
                showUnits={limitation === 'group'}
                showAddButton={false}
                showSelectTypes={false}
              />
            </Col>
          </Col>
          <Col sm={3} smOffset={2}>
            <Field
              fieldType="radio"
              name={`condition-limitation-${index}`}
              id={`condition-limitation-activity-${index}`}
              value="activity_type"
              checked={limitation === 'activity_type'}
              onChange={this.onChangeLimitation}
              label="Limit to Activity Type"
            />
          </Col>
          <Col sm={7} className="form-inner-edit-row pl40 pr30">
            <Col sm={12}>
              <UsageTypesSelector
                usaget={activityType}
                unit={item.get('unit', '')}
                onChangeUsaget={this.onChangeActivityType}
                onChangeUnit={this.onChangeUnit}
                enabled={limitation === 'activity_type'}
                showUnits={trigger === 'usagev' && limitation === 'activity_type'}
              />
            </Col>
          </Col>
          { trigger === 'usagev' && limitation === 'activity_type' && (
            <Col sm={10} smOffset={2}>
              <Col sm={8} smOffset={4} className="form-inner-edit-row">
              <Col sm={12}>
                <span className="inline mr40">
                  <Field
                    fieldType="radio"
                    name={`condition-over-group-${index}`}
                    id={`condition-over-group-all-units-${index}`}
                    value="none"
                    checked={overGroup !== 'over_group'}
                    onChange={this.onChangeOverGroup}
                    label="All units"
                    enabled={limitation === 'activity_type'}
                  />
                </span>
                <span className="inline">
                  <Field
                    fieldType="radio"
                    name={`condition-over-group-${index}`}
                    id={`condition-over-group-exceeding-units-${index}`}
                    value="over_group"
                    checked={overGroup === 'over_group'}
                    onChange={this.onChangeOverGroup}
                    label="Exceeding units"
                    disabled={limitation !== 'activity_type'}
                  />
                </span>
              </Col>
            </Col>
            </Col>
          )}

          <Col sm={10} smOffset={2}>
            <Col sm={4} componentClass={ControlLabel}>Type</Col>
            <Col sm={8} className="form-inner-edit-row">
              <Field
                fieldType="select"
                onChange={this.onChangeType}
                value={item.get('type', '')}
                options={conditionsOperators}
              />
            </Col>
          </Col>

          { selectedConditionData.get('extra_field', true) && (
            <Col sm={10} smOffset={2}>
              <Col sm={4} componentClass={ControlLabel}>Value</Col>
              <Col sm={8} className="form-inner-edit-row">
                <InputGroup className="full-width">
                  {selectedConditionData.get('type', 'text') !== 'tags' ? (
                    <Field
                      id={`cond-value-${index}`}
                      onChange={this.onChangeValue}
                      value={item.get('value', '')}
                      fieldType={selectedConditionData.get('type', 'text')}
                    />
                  ) : (
                    <Field
                      fieldType="tags"
                      id={`cond-value-${index}`}
                      onChange={this.onChangeMultiValues}
                      value={String(item.get('value', '')).split(',').filter(val => val !== '')}
                      renderInput={this.renderCustomInputNumber}
                      onlyUnique={selectedConditionData.get('type', '') === 'tags'}
                    />
                  )}
                  { unitLabel !== '' && (
                    <InputGroup.Addon>{unitLabel}</InputGroup.Addon>
                  )}
                </InputGroup>
              </Col>
            </Col>
          )}
        </FormGroup>
      </Col>
    );
  }
}

const mapStateToProps = (state, props) => {
  const { trigger, limitation, activityType, groupNames, overGroup } = getPathParams(props.item.get('paths', Immutable.List()));
  return {
    trigger,
    limitation,
    activityType,
    groupNames,
    propertyTypeOptions: propertyTypesSelector(state, props) || Immutable.Set(),
    overGroup,
    groupsOptions: groupsOptionsSelector(state, props) || Immutable.List(),
    groupsData: groupsDataSelector(state, props) || Immutable.Map(),
    currency: currencySelector(state, props),
    servicesData: servicesDataSelector(state, props) || Immutable.Map(),
    conditionsOperators: eventConditionsOperatorsSelectOptionsSelector(null, { eventType: 'balance' }),
  };
};

export default connect(mapStateToProps)(BalanceEventCondition);
