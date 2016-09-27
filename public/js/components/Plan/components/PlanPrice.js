import React, { Component } from 'react';
import moment from 'moment';
import Immutable from 'immutable';
import { FormGroup, Col, Row, ControlLabel, HelpBlock } from 'react-bootstrap';

import Field from '../../Field';

const planCycleUnlimitedValue = globalSetting.planCycleUnlimitedValue;

export default class PlanPrice extends Component {

  state = {
    cycleError: '',
    priceError: ''
  }

  shouldComponentUpdate(nextProps, nextState){
    //if count was changed and this is last item
    const isLastAdded = this.props.count < nextProps.count && this.props.index === (this.props.count - 1);
    const isLastremoved = this.props.count > nextProps.count && this.props.index === (this.props.count - 2);
    const error = nextState.cycleError !== this.state.cycleError || nextState.priceError !== this.state.priceError;
    return !Immutable.is(this.props.item, nextProps.item) || this.props.index !== nextProps.index || isLastAdded || isLastremoved || error;
  }

  onCycleUpdateValue = (value) => {
    const { index } = this.props;
    if(typeof value === 'undefined' || value === null || value == ''){
      this.setState({cycleError: 'Cycle is required'});
      this.props.onPlanCycleUpdate(index, 0);
    } else if(isNaN(value) || !(Math.sign(value) > 0)){
      this.setState({cycleError: 'Value must be positive number'});
      this.props.onPlanCycleUpdate(index, 0);
    } else {
      this.setState({cycleError: ''});
      this.props.onPlanCycleUpdate(index, value);
    }
  }

  onCycleUpdateEvent = (e) => {
    this.onCycleUpdateValue(e.target.value);
  }

  onPlanPriceUpdate = (e) => {
    const { index } = this.props;
    const { value } = e.target;
    if(typeof value === 'undefined' || value === null || value == ''){
      this.setState({priceError: 'Price is required'});
    } else if(isNaN(value) || !(Math.sign(value) >= 0)){
      this.setState({priceError: 'Value must be positive number'});
    } else {
      this.setState({priceError: ''});
    }
    this.props.onPlanPriceUpdate(index, value);
  }

  onPlanTariffRemove = () => {
    const { index } = this.props;
    this.props.onPlanTariffRemove(index);
  }

  onPlanTariffAdd = () => {
    const trial = this.props.item.get('trial', false);
    this.props.onPlanTariffAdd(trial);
  }

  render() {
    const { cycleError, priceError } = this.state;
    const { item, index, count } = this.props;
    const price = item.get('price', '');
    const trial = item.get('trial', false);
    const from = item.get('from', '');
    const to = item.get('to', '');

    const cycle = (to === planCycleUnlimitedValue) ? planCycleUnlimitedValue : ( (to === '' ? '' : to - from));
    const isLast = ((count === 0) || (count-1 === index));
    const showAddButton = !trial && isLast;
    const showRemoveButton = trial || isLast ;

    return (
      <Row>
        <Col lg={5} md={5}>
          <FormGroup validationState={ cycleError.length ? "error" : ''} style={{marginRight: 0, marginLeft: 0}}>
            <ControlLabel>Cycles</ControlLabel>
              { isLast
                ? <Field onChange={this.onCycleUpdateValue} value={cycle} fieldType="unlimited" unlimitedValue={planCycleUnlimitedValue}/>
                : <Field onChange={this.onCycleUpdateEvent} value={cycle} fieldType="number" min="0"/>
              }
              { cycleError.length > 0 && <HelpBlock>{cycleError}.</HelpBlock>}
            </FormGroup>
          </Col>

        <Col lg={5} md={5}>
          <FormGroup validationState={ priceError.length ? "error" : ''} style={{marginRight: 0, marginLeft: 0}}>
          <ControlLabel>Price</ControlLabel>
              <Field onChange={this.onPlanPriceUpdate} value={price} />
              { priceError.length > 0 && <HelpBlock>{priceError}.</HelpBlock>}
          </FormGroup>
        </Col>

        <Col lg={1} md={1} sm={1} xs={2} lgOffset={0} mdOffset={0} smOffset={10} xsOffset={8} className="text-right">
          { showAddButton && <i className="fa fa-plus-circle fa-lg" onClick={this.onPlanTariffAdd} style={{cursor: "pointer", color: 'green', marginTop: 35}} ></i> }
         </Col>

         <Col lg={1} md={1} sm={1} xs={2} className="text-right">
          { showRemoveButton && <i className="fa fa-minus-circle fa-lg" onClick={this.onPlanTariffRemove} style={{cursor: "pointer", color: 'red', marginTop: 35}} ></i> }
        </Col>
        { !isLast && !trial && <Col lgHidden mdHidden sm={12} xs={12}><hr /></Col> }
      </Row>
    );
  }
}
