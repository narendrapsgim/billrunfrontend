import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import isNumber from 'is-number';
import getSymbolFromCurrency from 'currency-symbol-map';
import { Form, FormGroup, ControlLabel, Col, Row, Panel } from 'react-bootstrap';
import { Actions } from '@/components/Elements';
import Field from '@/components/Field';
import { showConfirmModal } from '@/actions/guiStateActions/pageActions';
import { getFieldName } from '@/common/Util';


const CustomerAllowances = ({ customer, editable, allSubscriptions, allAccounts, currency, onChange, dispatch}) => {

  const onAskDeleteSid = useCallback((sid) => {
    const onDeleteSid = () => {
      const allowances = customer.get('allowances', Immutable.List())
        .filter(allowance => allowance.get('sid', '') !== sid);
      return onChange('allowances', allowances);
    }
    const sidLabel = allSubscriptions
      .find(options => options.get('sid', '') === sid, null, Immutable.Map())
      .get('title', '');
    const confirm = {
      message: `Are you sure you want to delete subscriber ${sid} - '${sidLabel}' ?`,
      onOk: onDeleteSid,
      labelOk: 'Delete',
      type: 'delete',
    };
    dispatch(showConfirmModal(confirm));
  }, [customer, allSubscriptions, dispatch, onChange]);

  const onAskDeleteAisSids = useCallback((aid) => {
    const onDeleteAisSids = () => {
      const allowances = customer.get('allowances', Immutable.List())
        .filter(allowance => allowance.get('aid', '') !== aid);
      return onChange('allowances', allowances);
    }
    const aidLabel = allAccounts
      .find(options => options.get('aid', '') === aid, null, Immutable.Map())
      .get('title', '')
    const confirm = {
      message: `Are you sure you want to delete all ${aid} - '${aidLabel}' account subscribers  ?`,
      onOk: onDeleteAisSids,
      labelOk: 'Delete',
      type: 'delete',
    };
    dispatch(showConfirmModal(confirm));
  }, [allAccounts, customer, dispatch, onChange]);

  const aidGroupActions = useMemo(() => [{
    type: 'remove',
    showIcon: true,
    helpText: 'Remove all account subscribres',
    actionStyle: 'danger',
    actionSize: 'xsmall',
    onClick: onAskDeleteAisSids,
  }], [onAskDeleteAisSids]);

  const sidActions = useMemo(() => [{
    type: 'remove',
    showIcon: true,
    helpText: 'Remove all account subscribres',
    actionStyle: 'link',
    actionSize: 'xsmall',
    onClick: onAskDeleteSid,
  }], [onAskDeleteSid]);

  const subscriptionsSelectOptions = useMemo(() => allSubscriptions
    .filter(option => option.get('aid', '') !== customer.get('aid', ''))
    .map(option => ({
      value: `${option.get('sid', '')}`,
      label: `${option.get('sid', '')} - ${option.get('title', '')} (Account: ${option.get('aid', '')})`,
      aid: option.get('aid', ''),
    }))
    .toList()
    .toArray()
  , [customer, allSubscriptions]);

  const renderGroupHeader = (aid, title) => (
    <div>
      {`${aid} - ${title}`}
      <div className="pull-right">
        <Actions actions={aidGroupActions} data={aid} />
      </div>
    </div>
  );

  const onChangeSubscriptions = (sids) => {
    if (sids === '') {
      return onChange('allowances', Immutable.List());
    }
    const subscriptionsSids = sids
      .split(',')
      .filter(sid => sid !== '')
      .map(sid => parseFloat(sid));
    if (subscriptionsSids.length === 0) {
      return onChange('allowances', Immutable.List());
    }
    const allowances = customer.get('allowances', Immutable.List())
      // remove removed items
      .filter(allowance => subscriptionsSids.includes(allowance.get('sid', '')))
      // add new
      .withMutations((allowancesWithMutations) => {
        subscriptionsSids.forEach((sid) => {
          const sidIndex = allowancesWithMutations
            .findIndex(allowanceWithMutation => allowanceWithMutation.get('sid', '') === sid);
          if (sidIndex === -1) {
            const aid = allSubscriptions
              .find(options => options.get('sid', '') === sid, null, Immutable.Map())
              .get('aid', '');
            allowancesWithMutations.push(Immutable.Map({
              sid: isNumber(sid) ? parseFloat(sid) : sid,
              aid: isNumber(aid) ? parseFloat(aid) : aid,
              allowance: ''
            }));
          }
        });
      });
    return onChange('allowances', allowances);
  }

  const onChangeAllowanceValue = (e) => {
    const { id, value } = e.target;
    const sid = isNumber(id) ? parseFloat(id) : id;
    const allowances = customer.get('allowances', Immutable.List())
    const index = allowances.findIndex(allowance => allowance.get('sid', '') === sid, null, Immutable.Map());
    if (index !== -1) {
      const newValue = isNumber(value) ? parseFloat(value) : value;
      return onChange('allowances', allowances.setIn([index, 'allowance'], newValue));
    }
  }

  const selectedSubscriptions = customer.get('allowances', Immutable.List())
    .map(allowances => allowances.get('sid', ''))
    .toList()
    .join(',');

  const renderAllowancesValue = () => {
    const groupsOfAid = customer
      .get('allowances', Immutable.List())
      .groupBy(customerAllowance => customerAllowance.get('aid', ''))
      .sort();
    return groupsOfAid.map((ids, aid) => {
      const aidLabel = allAccounts
        .find(options => options.get('aid', '') === aid, null, Immutable.Map())
        .get('title', '')
      return (
        <Panel header={renderGroupHeader(aid, aidLabel)} key={`aid-${aid}`}>
          {ids.map((customerAllowance) => {
            const sid = customerAllowance.get('sid', '');
            const sidLabel = allSubscriptions
              .find(options => options.get('sid', '') === sid, null, Immutable.Map())
              .get('title', '');
            return(
              <FormGroup key={`sid-${sid}`}>
                <Col componentClass={ControlLabel} sm={3} lg={2}>
                  { `${sid} - ${sidLabel}` }
                </Col>
                <Col sm={8} lg={9}>
                    <Field
                      id={sid}
                      value={customerAllowance.get('allowance', '')}
                      onChange={onChangeAllowanceValue}
                      fieldType="number"
                      editable={editable}
                      suffix={getSymbolFromCurrency(currency)}
                    />
                </Col>
                <Col sm={1} className="input-min-line-height pr0 pl0">
                  <Actions actions={sidActions} data={sid} />
                </Col>
              </FormGroup>
            );
          })}
        </Panel>
      );
    })
    .toList()
    .toArray();
  }

  return (
    <Row>
      <Col lg={12}>
        <Form horizontal>
          <FormGroup>
            <Col componentClass={ControlLabel} sm={3} lg={2}>
              { getFieldName('Select Subscribers', 'Customer')}
            </Col>
            <Col sm={8} lg={9}>
              <Field
                fieldType="select"
                options={subscriptionsSelectOptions}
                value={selectedSubscriptions}
                onChange={onChangeSubscriptions}
                editable={editable}
                multi={true}
                clearable={false}
              />
            </Col>
          </FormGroup>
          <hr />
          { renderAllowancesValue() }
        </Form>
      </Col>
    </Row>
  )
}


CustomerAllowances.defaultProps = {
  customer: Immutable.Map(),
  allSubscriptions: Immutable.List(),
  allAccounts: Immutable.List(),
  currency: '',
  editable: true,
};

CustomerAllowances.propTypes = {
  customer: PropTypes.instanceOf(Immutable.Map),
  allSubscriptions: PropTypes.instanceOf(Immutable.List),
  allAccounts: PropTypes.instanceOf(Immutable.List),
  editable: PropTypes.bool,
  currency: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
};


export default connect(null)(CustomerAllowances);
