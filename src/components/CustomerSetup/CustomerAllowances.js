import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { Form, FormGroup, ControlLabel, Col, Row, Panel } from 'react-bootstrap';
import Field from '@/components/Field';
import { getFieldName } from '@/common/Util';



const CustomerAllowances = ({ customer, editable, availableSubscriptionsOptions}) => {

  const getLabel = (items, key) => items
    .find(item => item.get('sid', '') == key, null, Immutable.Map())
    .get('name', key);

  const renderPlanDiscountValue = () => {
    const customerAllowances = customer.get('allowances', Immutable.List());
    return customerAllowances.map((customerAllowance) => {
      const label = getLabel(availableSubscriptionsOptions, customerAllowance.get('sid', ''));
      return (
        <FormGroup key={`sid-${customerAllowance.get('sid', '')}`}>
          <Col componentClass={ControlLabel} sm={3} lg={2}>
            { label }
          </Col>
          <Col sm={8} lg={9}>
              <Field
                value={customerAllowance.get('allowance', '')}
                onChange={onChangeAllowanceValue}
                label="TITLE"
                fieldType="number"
                editable={editable}
              />
          </Col>
        </FormGroup>
      );
    });
  }

  const onChangeSubscriptions = (subscriptions) => {
    console.log("onChangeSubscriptions: ", subscriptions);
  }

  const onChangeAllowanceValue = (value) => {
    console.log("onChangeAllowanceValue: ", value);
  }

  const selectedSubscriptions = customer.get('allowances', Immutable.List())
    .map(allowances => allowances.get('sid', ''))
    .toList()
    .join(',');

  const subscriptionsOptions = availableSubscriptionsOptions
    .map(option => ({value:option.get('sid', ''), label:option.get('name', '')}))
    .toList()
    .toArray();

  return (
    <Row>
      <Col lg={12}>
        <Form horizontal>
        <Panel header={<h3>Title</h3>}>
          <FormGroup>
            <Col componentClass={ControlLabel} sm={3} lg={2}>
              { getFieldName('TITLE', 'Customer')}
            </Col>
            <Col sm={8} lg={9}>
              <Field
                fieldType="select"
                options={subscriptionsOptions}
                value={selectedSubscriptions}
                onChange={onChangeSubscriptions}
                editable={editable}
                multi={true}
              />
            </Col>
          </FormGroup>
          <hr />
          { renderPlanDiscountValue() }
        </Panel>
        </Form>
      </Col>
    </Row>
  )
}

CustomerAllowances.defaultProps = {
  customer: Immutable.Map({
    allowances: Immutable.List([
      Immutable.Map({sid:123, aid: 234, allowance: 30}),
      Immutable.Map({sid:122, aid: 234, allowance: 31}),
    ])
  }),
  availableSubscriptionsOptions: Immutable.List([
    Immutable.Map({sid: '123', name:'Shani'}),
    Immutable.Map({sid: '122', name:'Yonatan'}),
    Immutable.Map({sid: '666', name:'Ofer'}),
    Immutable.Map({sid: '555', name:'Roman'}),
  ]),
  editable: true,
};

CustomerAllowances.propTypes = {
  customer: PropTypes.instanceOf(Immutable.Map),
  subscriptionsOptions: PropTypes.array,
  editable: PropTypes.bool,
};
export default CustomerAllowances;
