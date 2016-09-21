import React, { Component } from 'react';
import moment from 'moment';
import Immutable from 'immutable';
import { FormGroup, Col } from 'react-bootstrap';

import Field from '../../Field';

const planCycleUnlimitedValue = globalSetting.planCycleUnlimitedValue;

export default class PlanPrice extends Component {

  shouldComponentUpdate(nextProps, nextState){
    //if count was changed and this is last item
    const isLastAdded = this.props.count < nextProps.count && this.props.index === (this.props.count - 1);
    const isLastremoved = this.props.count > nextProps.count && this.props.index === (this.props.count - 2);
    return !Immutable.is(this.props.price, nextProps.price) || this.props.index !== nextProps.index || isLastAdded || isLastremoved;
  }

  onUnlimitedCycleUpdate = (value) => {
    const { index } = this.props;
    this.props.onPlanCycleUpdate(index, value);
  }

  onNumberCycleUpdate = (e) => {
    const { index } = this.props;
    const { value } = e.target
    this.props.onPlanCycleUpdate(index, value);
  }

  onPlanPriceUpdate = (e) => {
    const { index } = this.props;
    let value = parseFloat(e.target.value);
    value = isNaN(value) ? '' : value;
    this.props.onPlanPriceUpdate(index, value);
  }

  onPlanTariffRemove = () => {
    const { index } = this.props;
    this.props.onPlanTariffRemove(index);
  }

  onPlanTariffAdd = () => {
    const trial = this.props.price.get('trial', false);
    this.props.onPlanTariffAdd(trial);
  }

  render() {
    const { price, index, count } = this.props;
    const priceValue = price.get('price', '');
    const trial = price.get('trial', false);
    const from = price.get('from', '');
    const to = price.get('to', '');

    const cycle = (to === planCycleUnlimitedValue) ? planCycleUnlimitedValue : ( (to === '' ? '' : to - from));
    const isLast = ((count === 0) || (count-1 === index));
    const showAddButton = !trial && isLast;
    const showRemoveButton = trial || isLast ;

    return (
      <FormGroup>
        <Col lg={5} md={5}>
          <label htmlFor="cycle">Cycles</label>
          { isLast
            ? <Field id="cycle" onChange={this.onUnlimitedCycleUpdate} value={cycle} fieldType="unlimited" unlimitedValue={planCycleUnlimitedValue}/>
            : <Field id="cycle" onChange={this.onNumberCycleUpdate} value={cycle} fieldType="text" />
          }
        </Col>

        <Col lg={5} md={5}>
          <label htmlFor="price">Price</label>
          <Field id="price" onChange={this.onPlanPriceUpdate} value={price.get('price', '')} />
        </Col>

        <Col lg={1} md={1} sm={1} xs={2} lgOffset={0} mdOffset={0} smOffset={10} xsOffset={8} className="text-right">
          { showAddButton && <i className="fa fa-plus-circle fa-lg" onClick={this.onPlanTariffAdd} style={{cursor: "pointer", color: 'green', marginTop: 35}} ></i> }
         </Col>

         <Col lg={1} md={1} sm={1} xs={2} className="text-right">
          { showRemoveButton && <i className="fa fa-minus-circle fa-lg" onClick={this.onPlanTariffRemove} style={{cursor: "pointer", color: 'red', marginTop: 35}} ></i> }
        </Col>
        { !isLast && !trial && <Col lgHidden mdHidden sm={12} xs={12}><hr /></Col> }
      </FormGroup>
    );
  }
}
