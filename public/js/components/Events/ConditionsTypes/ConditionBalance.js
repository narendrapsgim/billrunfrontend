import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { FormGroup, Col, ControlLabel } from 'react-bootstrap';
import Select from 'react-select';
import Field from '../../Field';
import UsageTypesSelector from '../../UsageTypes/UsageTypesSelector';
import { groupsOptionsSelector, groupsDataSelector } from '../../../selectors/listSelectors';
import { getGroupsOptions } from '../../../actions/reportsActions';
import {
  getConditionTypes,
  getConditionData,
  getPathParams,
  buildBalanceConditionPath,
  getUnitTitle,
 } from '../EventsUtil';
import { getGroupUsaget } from '../../../common/Util';
import { currencySelector } from '../../../selectors/settingsSelector';

class EventFormBalance extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    item: PropTypes.instanceOf(Immutable.Map),
    index: PropTypes.number,
    onChangeField: PropTypes.func,
    trigger: PropTypes.string,
    limitation: PropTypes.string,
    activityType: PropTypes.string,
    groupName: PropTypes.string,
    groupsOptions: PropTypes.instanceOf(Immutable.List),
    propertyTypes: PropTypes.instanceOf(Immutable.List),
    usageTypesData: PropTypes.instanceOf(Immutable.List),
    groupsData: PropTypes.instanceOf(Immutable.Map),
    currency: PropTypes.string,
  }

  static defaultProps = {
    item: Immutable.Map(),
    index: -1,
    onChangeField: () => {},
    trigger: '',
    limitation: '',
    activityType: '',
    groupName: '',
    groupsOptions: Immutable.List(),
    propertyTypes: Immutable.List(),
    usageTypesData: Immutable.List(),
    groupsData: Immutable.Map(),
    currency: '',
  }

  state = {
    unitLabel: '',
  };

  componentDidMount() {
    this.props.dispatch(getGroupsOptions());
  }

  onChangeTrigger = (e) => {
    const { onChangeField, item, index, limitation } = this.props;
    const { value } = e.target;
    const limitationToSave = (value === 'usagev' && limitation === 'none' ? 'group' : limitation);
    const path = buildBalanceConditionPath(value, limitationToSave, { activityType: '', groupName: '' });
    const condition = item.withMutations((itemWithMutation) => {
      itemWithMutation.set('path', path);
      itemWithMutation.set('unit', '');
      itemWithMutation.set('usaget', '');
    });
    onChangeField(['conditions', index], condition);
  };

  onChangeLimitation = (e) => {
    const { onChangeField, index, trigger, activityType, groupName } = this.props;
    const { value } = e.target;
    const path = buildBalanceConditionPath(trigger, value, { activityType, groupName });
    onChangeField(['conditions', index, 'path'], path);
  };

  onChangeActivityType = (value) => {
    const { onChangeField, item, index, trigger, limitation } = this.props;
    const path = buildBalanceConditionPath(trigger, limitation, { activityType: value, groupName: '' });
    const condition = item.withMutations((itemWithMutation) => {
      itemWithMutation.set('path', path);
      itemWithMutation.set('unit', '');
      itemWithMutation.set('usaget', value);
    });
    onChangeField(['conditions', index], condition);
  };

  onChangeGroupName = (value) => {
    const { onChangeField, item, index, trigger, limitation } = this.props;
    const path = buildBalanceConditionPath(trigger, limitation, { activityType: '', groupName: value });
    const unit = this.getGroupUnit(value);
    const usaget = this.getGroupActivityType(value);

    const condition = item.withMutations((itemWithMutation) => {
      itemWithMutation.set('path', path);
      itemWithMutation.set('unit', unit);
      itemWithMutation.set('usaget', usaget);
    });
    onChangeField(['conditions', index], condition);
  };

  onChangeType = (value) => {
    const { onChangeField, index } = this.props;
    onChangeField(['conditions', index, 'type'], value);
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
    const { trigger } = this.props;
    return (trigger === 'usagev' && !this.props.groupsData.hasIn([group, 'cost'])) ||
      (trigger === 'cost' && this.props.groupsData.hasIn([group, 'cost']));
  }

  getGroupNamesOptions = () =>
    this.props.groupsOptions
    .filter(this.filterRelevantGroups)
    .map(group => ({ value: group, label: group })).toArray();

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
      trigger,
      limitation,
      activityType,
      groupName,
      propertyTypes,
      usageTypesData,
      currency,
    } = this.props;

    const usaget = (limitation === 'group' ? item.get('usaget', '') : activityType);
    const unitLabel = getUnitTitle(item.get('unit', ''), trigger, usaget, propertyTypes, usageTypesData, currency);
    const selectedConditionData = getConditionData(item.get('type', ''));
    return (
      <div>

        <FormGroup>
          <Col sm={3} componentClass={ControlLabel}>Condition Trigger</Col>
          <Col sm={4}>
            <Field
              fieldType="radio"
              name={`condition-trigger-${index}`}
              id={`condition-trigger-monetary-${index}`}
              value="cost"
              checked={trigger === 'cost'}
              onChange={this.onChangeTrigger}
              label="Monetary"
            />
          </Col>
          <Col sm={4}>
            <Field
              fieldType="radio"
              name={`condition-trigger-${index}`}
              id={`condition-trigger-usagev-${index}`}
              value="usagev"
              checked={trigger === 'usagev'}
              onChange={this.onChangeTrigger}
              label="Usage"
            />
          </Col>
        </FormGroup>

        <FormGroup>
          <Col sm={3} componentClass={ControlLabel}>Condition Limitations</Col>
        </FormGroup>

        <FormGroup>
          <Col sm={4}>
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
        </FormGroup>
        <FormGroup>
          <Col sm={4}>
            <Field
              fieldType="radio"
              name={`condition-limitation-${index}`}
              id={`condition-limitation-group-${index}`}
              value="group"
              checked={limitation === 'group'}
              onChange={this.onChangeLimitation}
              label="Limit to Group"
            />
          </Col>
          <Col sm={8}>
            <Col sm={7}>
              <Select
                id={`condition-limitation-group_name-${index}`}
                onChange={this.onChangeGroupName}
                value={groupName}
                options={this.getGroupNamesOptions()}
                disabled={limitation !== 'group'}
              />
            </Col>
            <Col sm={5}>
              <UsageTypesSelector
                usaget={usaget}
                unit={item.get('unit', '')}
                onChangeUsaget={this.onChangeActivityType}
                onChangeUnit={this.onChangeUnit}
                enabled={limitation === 'group'}
                showUnits={trigger === 'usagev' && limitation === 'group'}
                showAddButton={false}
                showSelectTypes={false}
              />
            </Col>
          </Col>
        </FormGroup>
        <FormGroup>
          <Col sm={4}>
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
          <Col sm={8}>
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
        </FormGroup>

        <FormGroup>
          <Col sm={3} componentClass={ControlLabel}>Type</Col>
          <Col sm={9}>
            <Select
              id={`cond-type-${index}`}
              onChange={this.onChangeType}
              value={item.get('type', '')}
              options={getConditionTypes()}
            />
          </Col>
        </FormGroup>

        {
          selectedConditionData.get('extra_field', true) && selectedConditionData.get('type', 'text') !== 'tags' &&
          (<FormGroup>
            <Col sm={3} componentClass={ControlLabel}>
              Value { unitLabel !== '' ? `(${unitLabel})` : '' }
            </Col>
            <Col sm={9}>
              <Field
                id={`cond-value-${index}`}
                onChange={this.onChangeValue}
                value={item.get('value', '')}
                fieldType={selectedConditionData.get('type', 'text')}
              />
            </Col>
          </FormGroup>)
      }

        {
        selectedConditionData.get('extra_field', true) && selectedConditionData.get('type', 'text') === 'tags' &&
        (<FormGroup>
          <Col sm={3} componentClass={ControlLabel}>
            Value { unitLabel !== '' ? `(${unitLabel})` : '' }
          </Col>
          <Col sm={9}>
            <Field
              fieldType="tags"
              id={`cond-value-${index}`}
              onChange={this.onChangeMultiValues}
              value={String(item.get('value', '')).split(',').filter(val => val !== '')}
              renderInput={this.renderCustomInputNumber}
              onlyUnique={selectedConditionData.get('type', '') === 'tags'}
            />
          </Col>
        </FormGroup>)
      }

      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  const { trigger, limitation, activityType, groupName } = getPathParams(props.item.get('path', ''));
  return {
    trigger,
    limitation,
    activityType,
    groupName,
    groupsOptions: groupsOptionsSelector(state, props) || Immutable.List(),
    groupsData: groupsDataSelector(state, props) || Immutable.Map(),
    currency: currencySelector(state, props),
  };
};

export default connect(mapStateToProps)(EventFormBalance);
