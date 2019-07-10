import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { Panel } from 'react-bootstrap';
import DiscountCondition from './DiscountCondition';
import { getConfig } from '@/common/Util';
import {
  discountSubscriberFieldsSelector,
  discountAccountFieldsSelector,
  discountSubscriberServicesFieldsSelector,
} from '@/selectors/discountSelectors';


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
  subscriberServicesConditionFields,
}) => (
  <Panel header="Conditions">
    <Panel header="Customer">
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
        fields={subscriberServicesConditionFields}
        operators={conditionsOperators}
        onChangeField={onChangeConditionField}
        onChangeOp={onChangeConditionOp}
        onChangeValue={onChangeConditionValue}
        onAdd={addCondition}
        onRemove={removeCondition}
      />
    </Panel>
  </Panel>
);

DiscountConditions.propTypes = {
  discount: PropTypes.instanceOf(Immutable.Map),
  conditionsOperators: PropTypes.instanceOf(Immutable.List),
  editable: PropTypes.bool,
  accountConditionsPath: PropTypes.array,
  subscriberConditionFields: PropTypes.instanceOf(Immutable.List),
  accountConditionFields: PropTypes.instanceOf(Immutable.List),
  subscriberServicesConditionFields: PropTypes.instanceOf(Immutable.List),
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
  subscriberServicesConditionFields: Immutable.List(),
};

const mapStateToProps = (state, props) => ({
  subscriberConditionFields: discountSubscriberFieldsSelector(state, props, 'subscriber'),
  accountConditionFields: discountAccountFieldsSelector(state, props, 'account'),
  subscriberServicesConditionFields: discountSubscriberServicesFieldsSelector(state, props, 'subscriber_services'),
});

export default connect(mapStateToProps)(DiscountConditions);
