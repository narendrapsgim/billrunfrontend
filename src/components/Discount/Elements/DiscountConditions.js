import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { Panel } from 'react-bootstrap';
import DiscountCondition from './DiscountCondition';
import { getConfig } from '@/common/Util';
import { discountsServicesFieldsSelector } from '@/selectors/entitySelector';
import {
  reportSubscriberFieldsSelector,
  reportAccountFieldsSelector,
} from '@/selectors/reportSelectors';


const DiscountConditions = ({
  discount,
  editable,
  conditionsOperators,
  onChangeConditionField,
  onChangeConditionOp,
  onChangeConditionValue,
  addCondition,
  removeCondition,
  accountConditionsPath,
  subscriberConditionsPath,
  servicesConditionsPath,
  subscriberConditionFields,
  accountConditionFields,
  servicesConditionFields,
}) => {
  return (
    <Panel header="Conditions">
      <Panel header="Account">
        <DiscountCondition
          path={accountConditionsPath}
          conditions={discount.getIn(accountConditionsPath, Immutable.List())}
          disabled={!editable}
          fields={accountConditionFields}
          operators={conditionsOperators}
          onChangeField={onChangeConditionField}
          onChangeOp={onChangeConditionOp}
          onChangeValue={onChangeConditionValue}
          onAdd={addCondition}
          onRemove={removeCondition}
        />
      </Panel>
      <Panel header="Subscriber">
        <DiscountCondition
          path={subscriberConditionsPath}
          conditions={discount.getIn(subscriberConditionsPath, Immutable.List())}
          disabled={!editable}
          fields={subscriberConditionFields}
          operators={conditionsOperators}
          onChangeField={onChangeConditionField}
          onChangeOp={onChangeConditionOp}
          onChangeValue={onChangeConditionValue}
          onAdd={addCondition}
          onRemove={removeCondition}
        />
      </Panel>
      <Panel header="Services">
        <DiscountCondition
          path={servicesConditionsPath}
          conditions={discount.getIn(servicesConditionsPath, Immutable.List())}
          disabled={!editable}
          fields={servicesConditionFields}
          operators={conditionsOperators}
          onChangeField={onChangeConditionField}
          onChangeOp={onChangeConditionOp}
          onChangeValue={onChangeConditionValue}
          onAdd={addCondition}
          onRemove={removeCondition}
        />
      </Panel>
    </Panel>
  )
}

DiscountConditions.propTypes = {
  discount: PropTypes.instanceOf(Immutable.Map),
  conditionsOperators: PropTypes.instanceOf(Immutable.List),
  editable: PropTypes.bool,
  accountConditionsPath: PropTypes.array,
  subscriberConditionFields: PropTypes.instanceOf(Immutable.List),
  accountConditionFields: PropTypes.instanceOf(Immutable.List),
  servicesConditionFields: PropTypes.instanceOf(Immutable.List),
  subscriberConditionsPath: PropTypes.array,
  servicesConditionsPath: PropTypes.array,
  onChangeConditionField: PropTypes.func.isRequired,
  onChangeConditionOp: PropTypes.func.isRequired,
  onChangeConditionValue: PropTypes.func.isRequired,
  addCondition: PropTypes.func.isRequired,
  removeCondition: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
};

DiscountConditions.defaultProps = {
  discount: Immutable.Map(),
  editable: true,
  accountConditionsPath: ['params', 'conditions', 0, 'account', 'fields'],
  subscriberConditionsPath: ['params', 'conditions', 0, 'subscriber', 0, 'fields'],
  servicesConditionsPath: ['params', 'conditions', 0, 'subscriber', 0, 'service', 'any', 0, 'fields'],
  conditionsOperators: getConfig(['discount', 'conditionsOperators'], Immutable.List()),
  subscriberConditionFields: Immutable.List(),
  accountConditionFields: Immutable.List(),
  servicesConditionFields: Immutable.List(),
};

const mapStateToProps = (state, props) => ({
  subscriberConditionFields: reportSubscriberFieldsSelector(state, props),
  accountConditionFields: reportAccountFieldsSelector(state, props),
  servicesConditionFields: discountsServicesFieldsSelector(state, props),
});

export default connect(mapStateToProps)(DiscountConditions);
