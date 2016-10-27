import React, { Component } from 'react';
import moment from 'moment';
import Immutable from 'immutable';
import { Button, FormGroup, Col, Row, ControlLabel, HelpBlock } from 'react-bootstrap';

import Field from '../../Field';

const planCycleUnlimitedValue = globalSetting.planCycleUnlimitedValue;

export default class PlanPrice extends Component {

  static propTypes = {
    onPlanTariffRemove: React.PropTypes.func.isRequired,
    onPlanCycleUpdate: React.PropTypes.func.isRequired,
    onPlanPriceUpdate: React.PropTypes.func.isRequired,
    index: React.PropTypes.number.isRequired,
    count: React.PropTypes.number.isRequired,
    isTrialExist: React.PropTypes.bool.isRequired,
    item: React.PropTypes.instanceOf(Immutable.Map),
  }

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

  render() {
    const { cycleError, priceError } = this.state;
    const { item, index, count, isTrialExist } = this.props;
    const price = item.get('price', '');
    const trial = item.get('trial', false);
    const from = item.get('from', '');
    const to = item.get('to', '');

    const cycle = (to === planCycleUnlimitedValue) ? planCycleUnlimitedValue : ( (to === '' ? '' : to - from));
    const isFirst = (index === 0 || (isTrialExist && index == 1) );
    const isLast = ((count === 0) || (count-1 === index));
    const showRemoveButton = trial || isLast ;

    return (
      <Row>
        <Col lg={1} md={1} className="text-center">
          { isFirst && <ControlLabel >Period</ControlLabel>}
          <p style={{marginTop: 9}}>{index+1}</p>
        </Col>
        <Col lg={4} md={4}>
          <FormGroup validationState={cycleError.length ? "error" : null} style={{margin: 0}}>
            { isFirst && <ControlLabel>Cycles</ControlLabel>}
            { isLast
              ? <Field onChange={this.onCycleUpdateValue} value={cycle} fieldType="unlimited" unlimitedValue={planCycleUnlimitedValue}/>
              : <Field onChange={this.onCycleUpdateEvent} value={cycle} fieldType="number" min="0"/>
            }
            { cycleError.length > 0 && <HelpBlock>{cycleError}.</HelpBlock>}
          </FormGroup>
        </Col>

        <Col lg={4} md={4}>
          <FormGroup validationState={priceError.length ? "error" : null} style={{margin: 0}}>
          { isFirst && <ControlLabel>Price</ControlLabel>}
              <Field onChange={this.onPlanPriceUpdate} value={price} />
              { priceError.length > 0 && <HelpBlock>{priceError}.</HelpBlock>}
          </FormGroup>
        </Col>

        <Col lg={1} md={1} sm={1} xs={1}>
          { showRemoveButton &&
            <FormGroup style={{margin: 0}}>
              { isFirst && <ControlLabel>&nbsp;</ControlLabel>}
              <Button onClick={this.onPlanTariffRemove} bsSize="small" className="pull-left"><i className="fa fa-trash-o danger-red"/>&nbsp;Remove</Button>
            </FormGroup>
          }
        </Col>
        { !isLast && !trial && <Col lg={12} md={12} sm={12} xs={12}><hr style={{marginTop: 6, marginBottom: 8}}/></Col> }
      </Row>
    );
  }
}
