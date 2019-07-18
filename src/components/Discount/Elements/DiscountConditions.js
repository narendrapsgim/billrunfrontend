import React, { useCallback, useMemo, memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { Panel } from 'react-bootstrap';
import { CreateButton, Actions } from '@/components/Elements';
import DiscountCondition from './DiscountCondition';
import { getConfig } from '@/common/Util';
import {
  discountSubscriberFieldsSelector,
  discountAccountFieldsSelector,
  discountSubscriberServicesFieldsSelector,
} from '@/selectors/discountSelectors';
import { showConfirmModal } from '@/actions/guiStateActions/pageActions';


const createBtnStyle = { marginTop: 0 };
const defaultNewConditionsGroup = Immutable.Map();
const defaultNewServiceConditionsGroup = Immutable.Map({
  fields: Immutable.List([
    defaultNewConditionsGroup
  ])
});
const defaultNewCondition = Immutable.Map({
  field: '',
  op: '',
  value: '',
});

const DiscountConditions = ({
  discount,
  editable,
  conditionsOperators,
  valueOptions,
  onChangeConditionField,
  onChangeConditionOp,
  onChangeConditionValue,
  addCondition,
  removeCondition,
  conditionsPath,
  accountConditionsPath,
  subscriberConditionsPath,
  servicesConditionsPath,
  servicesAnyConditionsPath,
  subscriberConditionFields,
  accountConditionFields,
  subscriberServicesConditionFields,
  dispatch,
}) => {

  const addConditions = useCallback((newConditions) => {
    addCondition(conditionsPath, newConditions);
  }, [addCondition, conditionsPath]);

  const addAccountConditions = useCallback((idx) => {
    addCondition([...conditionsPath, idx, ...accountConditionsPath], defaultNewCondition);
  }, [addCondition, conditionsPath, accountConditionsPath]);

  const addSubscriberConditions = useCallback((idx) => {
    addCondition([...conditionsPath, idx, ...subscriberConditionsPath], defaultNewCondition);
  }, [addCondition, conditionsPath, subscriberConditionsPath]);

  const addServiceConditionsGroup = useCallback((idx) => {
    const path = [...conditionsPath, idx, ...servicesConditionsPath];
    addCondition(path, defaultNewServiceConditionsGroup);
  }, [addCondition, conditionsPath, servicesConditionsPath]);

  const removeServiceConditionsGroup = useCallback(({idx, anyIdx}) => {
    const path = [...conditionsPath, idx, ...servicesConditionsPath];
    const allEmpty = discount.getIn(path, Immutable.List())
      .every(anyCondition => anyCondition.getIn(servicesAnyConditionsPath, Immutable.List()).isEmpty());
    if (allEmpty){
      removeCondition(path, anyIdx);
    } else {
      const confirm = {
        message: `Are you sure you want to remove service conditions group ${anyIdx + 1} from condition group ${idx+1} ?`,
        onOk: () => removeCondition(path, anyIdx),
        labelOk: 'Delete',
        type: 'delete',
      };
      dispatch(showConfirmModal(confirm));
    }
  }, [discount, removeCondition, conditionsPath, servicesConditionsPath, servicesAnyConditionsPath, dispatch]);

  const removeServiceCondition = useCallback((path, idx) => {
    if (discount.getIn(path, Immutable.List()).size === 1) {
      const tmpPath = [...path];
      tmpPath.pop(); // remove 'field'
      const index = tmpPath.pop();
      removeCondition(tmpPath, index);
    } else {
      removeCondition(path, idx);
    }
  }, [removeCondition, discount]);

  const removeConditionsGroup = useCallback((idx) => {
    const path = [...conditionsPath, idx];
    const isAccountEmpty = discount.getIn([...path, ...accountConditionsPath], Immutable.List()).isEmpty();
    const isSubscriberEmpty = discount.getIn([...path, ...subscriberConditionsPath], Immutable.List()).isEmpty();
    const isServicesEmpty = discount.getIn([...path, ...servicesConditionsPath], Immutable.List()).isEmpty();
    if (isAccountEmpty && isSubscriberEmpty && isServicesEmpty){
      removeCondition(conditionsPath, idx);
    } else {
      const confirm = {
        message: `Are you sure you want to remove conditions group ${idx+1} ?`,
        onOk: () => removeCondition(conditionsPath, idx),
        labelOk: 'Delete',
        type: 'delete',
      };
      dispatch(showConfirmModal(confirm));
    }
  }, [
    discount,
    removeCondition,
    conditionsPath,
    accountConditionsPath,
    subscriberConditionsPath,
    servicesConditionsPath,
    dispatch,
  ]);

  const conditionAddActions = useMemo(() => [{
    type: 'add',
    label: 'Customer',
    showIcon: false,
    onClick: addAccountConditions,
  }, {
    type: 'add',
    label: 'Subscriber',
    showIcon: false,
    onClick: addSubscriberConditions,
  }, {
    type: 'add',
    label: 'Service group',
    showIcon: false,
    onClick: addServiceConditionsGroup,
  }], [addAccountConditions, addSubscriberConditions, addServiceConditionsGroup]);

  const conditionAddActionsBtns = useMemo(() => [{
    type: 'add',
    label: 'Add Customer condition',
    actionSize: 'xsmall',
    actionStyle: 'primary',
    onClick: addAccountConditions,
  }, {
    type: 'add',
    label: 'Add Subscriber condition',
    actionSize: 'xsmall',
    actionStyle: 'primary',
    onClick: addSubscriberConditions,
  }, {
    type: 'add',
    label: 'Add Service condition group',
    actionSize: 'xsmall',
    actionStyle: 'primary',
    onClick: addServiceConditionsGroup,
  }], [addAccountConditions, addSubscriberConditions, addServiceConditionsGroup]);

  const removeGroupHelpText = idx => `Remove conditions group ${idx + 1}`;

  const conditionActions = useMemo(() => [{
    type: 'remove',
    helpText: removeGroupHelpText,
    showIcon: true,
    actionStyle: 'danger',
    actionSize: 'xsmall',
    onClick: removeConditionsGroup,
  }], [removeConditionsGroup]);

  const removeServiceGroupHelpText = ({idx, anyIdx}) => `Remove Service group ${anyIdx + 1} from condition group ${idx + 1}`;

  const conditionServiceGroupActions = useMemo(() => [{
    type: 'remove',
    helpText: removeServiceGroupHelpText,
    showIcon: true,
    actionStyle: 'danger',
    actionSize: 'xsmall',
    onClick: removeServiceConditionsGroup,
  }], [removeServiceConditionsGroup]);

  const conditionServicesActions = useMemo(() => [{
    type: 'add',
    label: 'Add group',
    helpText: 'Add Service group',
    showIcon: true,
    actionStyle: 'primary',
    actionSize: 'xsmall',
    onClick: addServiceConditionsGroup,
  }], [addServiceConditionsGroup]);

  const isConditoinsExists = useMemo(() => !discount.getIn(conditionsPath, Immutable.List())
    .every(groupConditions => !groupConditions.getIn(accountConditionsPath, Immutable.List()).isEmpty()
      && !groupConditions.getIn(subscriberConditionsPath, Immutable.List()).isEmpty()
      && !groupConditions.getIn(servicesConditionsPath, Immutable.List()).isEmpty()
  ), [discount, conditionsPath, accountConditionsPath, subscriberConditionsPath, servicesConditionsPath]);

  const getConditionHeader = useCallback((idx) => (
    <div>
      {`Condition Group ${idx+1}`}
      <div className="pull-right">
        <Actions actions={conditionAddActions} data={idx} type='dropdown' doropDownLabel="Add condition" />
        <div className="inline ml5">
          <Actions actions={conditionActions} data={idx} />
        </div>
      </div>
    </div>
  ), [conditionAddActions, conditionActions]);

  const getConditionServicesHeader = useCallback((idx) => (
    <div>
      Services
      <div className="pull-right">
        <Actions actions={conditionServicesActions} data={idx} />
      </div>
    </div>
  ), [conditionServicesActions]);

  const getConditionServiceGroupHeader = useCallback(({idx, anyIdx}) => (
    <div>
      {`Service Group ${anyIdx+1}`}
      <div className="pull-right">
        <Actions actions={conditionServiceGroupActions} data={{idx, anyIdx}} />
      </div>
    </div>
  ), [conditionServiceGroupActions]);

  const addNewConditionsBtn = useMemo(() => (
    <CreateButton
      onClick={addConditions}
      data={defaultNewConditionsGroup}
      label="Add conditions group"
      buttonStyle={createBtnStyle}
    />
  ), [addConditions]);

  const conditionsHeaderDescription = useMemo(() => (isConditoinsExists
    ? "Any of the following conditions must be fulfilled"
    : "No conditions"
  ), [isConditoinsExists]);

  const conditionsHeader = useMemo(() => (
    <div>
      <h4 className="inline mt0 mb0">Conditions<small> | {conditionsHeaderDescription}</small></h4>
      <div className="pull-right">{addNewConditionsBtn}</div>
    </div>
  ), [addNewConditionsBtn, conditionsHeaderDescription]);

  return (
    <Panel header={conditionsHeader}>
      {discount.getIn(conditionsPath, Immutable.List()).map((conditions, idx) => (
        <Panel header={getConditionHeader(idx)} key={idx}>
          { conditions.getIn(accountConditionsPath, Immutable.List()).isEmpty()
          && conditions.getIn(subscriberConditionsPath, Immutable.List()).isEmpty()
          && conditions.getIn(servicesConditionsPath, Immutable.List()).isEmpty()
          && (
            <div className="text-center">
              <Actions actions={conditionAddActionsBtns} data={idx} />
            </div>
          )}
          {!conditions.getIn(accountConditionsPath, Immutable.List()).isEmpty() && (
            <Panel header="Customer">
              <DiscountCondition
                path={[...conditionsPath, idx, ...accountConditionsPath]}
                conditions={conditions.getIn(accountConditionsPath, Immutable.List())}
                editable={editable}
                fields={accountConditionFields}
                operators={conditionsOperators}
                valueOptions={valueOptions}
                onChangeField={onChangeConditionField}
                onChangeOp={onChangeConditionOp}
                onChangeValue={onChangeConditionValue}
                onAdd={addCondition}
                onRemove={removeCondition}
              />
            </Panel>
          )}
          {!conditions.getIn(subscriberConditionsPath, Immutable.List()).isEmpty() && (
            <Panel header="Subscriber">
              <DiscountCondition
                path={[...conditionsPath, idx, ...subscriberConditionsPath]}
                conditions={conditions.getIn(subscriberConditionsPath, Immutable.List())}
                editable={editable}
                fields={subscriberConditionFields}
                operators={conditionsOperators}
                valueOptions={valueOptions}
                onChangeField={onChangeConditionField}
                onChangeOp={onChangeConditionOp}
                onChangeValue={onChangeConditionValue}
                onAdd={addCondition}
                onRemove={removeCondition}
              />
            </Panel>
          )}
          {!conditions.getIn(servicesConditionsPath, Immutable.List()).isEmpty() && (
            <Panel header={getConditionServicesHeader(idx)}>
              {conditions.getIn(servicesConditionsPath, Immutable.List()).map((anyConditions, anyIdx) => (
                <Panel header={getConditionServiceGroupHeader({idx, anyIdx})} key={`service_condition_${idx}_any_${anyIdx}`}>
                  {!anyConditions.getIn(servicesAnyConditionsPath, Immutable.List()).isEmpty() && (
                    <DiscountCondition
                      path={[...conditionsPath, idx, ...servicesConditionsPath, anyIdx, ...servicesAnyConditionsPath]}
                      conditions={anyConditions.getIn(servicesAnyConditionsPath, Immutable.List())}
                      editable={editable}
                      fields={subscriberServicesConditionFields}
                      operators={conditionsOperators}
                      onChangeField={onChangeConditionField}
                      onChangeOp={onChangeConditionOp}
                      onChangeValue={onChangeConditionValue}
                      onAdd={addCondition}
                      onRemove={removeServiceCondition}
                    />
                  )}
                </Panel>
              ))}
            </Panel>
          )}
        </Panel>
      ))}
      {!discount.getIn(conditionsPath, Immutable.List()).isEmpty() && (addNewConditionsBtn)}
    </Panel>
  )
};

DiscountConditions.propTypes = {
  discount: PropTypes.instanceOf(Immutable.Map),
  conditionsOperators: PropTypes.instanceOf(Immutable.List),
  valueOptions: PropTypes.instanceOf(Immutable.List),
  editable: PropTypes.bool,
  conditionsPath: PropTypes.array,
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
  conditionsPath: ['params', 'conditions'],
  accountConditionsPath: ['account', 'fields'],
  subscriberConditionsPath: ['subscriber', 0, 'fields'],
  servicesConditionsPath: ['subscriber', 0, 'service', 'any'],
  servicesAnyConditionsPath: ['fields'],
  conditionsOperators: getConfig(['discount', 'conditions', 'operators'], Immutable.List()),
  valueOptions: getConfig(['discount', 'conditions', 'valueOptions'], Immutable.List()),
  subscriberConditionFields: Immutable.List(),
  accountConditionFields: Immutable.List(),
  subscriberServicesConditionFields: Immutable.List(),
};

const mapStateToProps = (state, props) => ({
  subscriberConditionFields: discountSubscriberFieldsSelector(state, props, 'subscriber'),
  accountConditionFields: discountAccountFieldsSelector(state, props, 'account'),
  subscriberServicesConditionFields: discountSubscriberServicesFieldsSelector(state, props, 'subscriber_services'),
});

export default connect(mapStateToProps)(memo(DiscountConditions));
