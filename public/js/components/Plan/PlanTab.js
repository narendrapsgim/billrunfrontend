import React, { Component } from 'react';
import Immutable from 'immutable';
import { Form, FormGroup, ControlLabel, FormControl, Col, Row, Panel, Button } from 'react-bootstrap';
import { PlanDescription } from '../../FieldDescriptions';
import Help from '../Help';
import Field from '../Field';
import PlanPrice from './components/PlanPrice';


export default class Plan extends Component {

  static propTypes = {
    plan: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    mode: React.PropTypes.string.isRequired,
    onChangeFieldValue: React.PropTypes.func.isRequired,
    onPlanCycleUpdate: React.PropTypes.func.isRequired,
    onPlanTariffAdd: React.PropTypes.func.isRequired,
    onPlanTariffRemove: React.PropTypes.func.isRequired,
  }

  componentWillMount() {
    const { plan } = this.props;
    const count = plan.get('price', Immutable.List()).size
    if(count === 0){
      this.props.onPlanTariffAdd(false);
    }
  }

  onPlanTrailTariffInit = (e) => {
    this.props.onPlanTariffAdd(true);
  }

  onPlanTariffInit = (e) => {
    this.props.onPlanTariffAdd(false);
  }

  onChangePlanName = (e) => {
    const { value } = e.target;
    this.props.onChangeFieldValue(['name'], value);
  }

  onChangePlanCode = (e) => {
    const { value } = e.target;
    this.props.onChangeFieldValue(['code'], value);
  }

  onChangePlanDescription = (e) => {
    const { value } = e.target;
    this.props.onChangeFieldValue(['description'], value);
  }

  onChangePlanEach = (e) => {
    let value = parseInt(e.target.value);
    value = isNaN(value) ? '' : value;
    this.props.onChangeFieldValue(['recurrence', 'unit'], value);
  }

  onChangePeriodicity = (e) => {
    const { value } = e.target;
    this.props.onChangeFieldValue(['recurrence', 'periodicity'], value);
  }

  onPlanPriceUpdate = (index, value) => {
    this.props.onChangeFieldValue(['price', index, 'price'], value);
  }

  onChangeUpfront = (e) => {
    let value = e.target.value;
    if(value === 'true' || value === 'TRUE'){
      value = true;
    } else if(value === 'false' || value === 'FALSE'){
      value = false;
    }
    this.props.onChangeFieldValue(['upfront'], value);
  }

  getPeriodicityOptions = () => {
    const periodicity_options = {'':'Select...', 'month': 'Monthly', 'year': 'Yearly'};
    return Object.keys(periodicity_options).map( (key, i) =>
      <option value={key} key={i}>{periodicity_options[key]}</option>
    );
  }

  getAddPriceButton = (trial = false) => {
    const onclick = trial ? this.onPlanTrailTariffInit : this.onPlanTariffInit;
    return ( <Button bsSize="xsmall" className="btn-primary" onClick={onclick} > <i className="fa fa-plus" />&nbsp;Add New </Button> );
  }

  getTrialPrice = () => {
    const { plan } = this.props;
    const trial = (plan.getIn(['price', 0, 'trial']) == true) ? plan.getIn(['price',0]) : null;
    if(trial){
      return(
        <PlanPrice
            index={0}
            count={plan.get('price', Immutable.List()).size}
            item={trial}
            onPlanPriceUpdate={this.onPlanPriceUpdate}
            onPlanCycleUpdate={this.props.onPlanCycleUpdate}
            onPlanTariffAdd={this.props.onPlanTariffAdd}
            onPlanTariffRemove={this.props.onPlanTariffRemove}
        />);
    }
    return this.getAddPriceButton(true);
  }

  getPrices = () => {
    const { plan } = this.props;
    const count = plan.get('price', Immutable.List()).size;
    const prices = [];

    plan.get('price', Immutable.List()).forEach( (price, i) => {
      if (price.get('trial') !== true){
        prices.push(
          <PlanPrice key={i}
              index={i}
              count={count}
              item={price}
              onPlanPriceUpdate={this.onPlanPriceUpdate}
              onPlanCycleUpdate={this.props.onPlanCycleUpdate}
              onPlanTariffRemove={this.props.onPlanTariffRemove}
          />
        );
      }
    });
    return prices;
  }

  render() {
    let { plan, mode } = this.props;
    const periodicity = plan.getIn(['recurrence', 'periodicity']) || '';
    const upfront = typeof plan.get('upfront') !== 'boolean' ? '' : plan.get('upfront');

    return (
      <Row>
        <Col lg={8}>
          <Form>
            <Panel>
                <Col lg={6} md={6}>
                  <FormGroup>
                    <ControlLabel>Name <Help contents={PlanDescription.name} /></ControlLabel>
                    <Field id="PlanName" onChange={this.onChangePlanName} value={plan.get('name', '')} required={true} disabled={mode === 'update'}/>
                  </FormGroup>
                </Col>

                <Col lg={6} md={6}>
                  <FormGroup>
                    <ControlLabel>Code</ControlLabel>
                    <Field onChange={this.onChangePlanCode} value={plan.get('code', '')}/>
                  </FormGroup>
                </Col>

                <Col lg={12} md={12}>
                  <FormGroup>
                    <ControlLabel>Description</ControlLabel>
                    <Field fieldType="textarea" value={plan.get('description', '')} onChange={this.onChangePlanDescription} />
                  </FormGroup>
                </Col>

		{/* <Col lg={4} md={4}>
                    <FormGroup>
                    <ControlLabel>Recurrence</ControlLabel>
                    <Field min="1" fieldType="number" value={plan.getIn(['recurrence', 'unit'], '')} onChange={this.onChangePlanEach} />
                    </FormGroup>
		    </Col>
		  */}
              <Col lg={4} md={4}>
                <FormGroup>
                  <ControlLabel>&nbsp;</ControlLabel>
                  <FormControl componentClass="select" placeholder="select" value={periodicity} onChange={this.onChangePeriodicity}>
                    { this.getPeriodicityOptions() }
                  </FormControl>
                </FormGroup>
              </Col>

              <Col lg={4} md={4}>
                <FormGroup>
                  <ControlLabel>Charging Mode</ControlLabel>
                  <FormControl componentClass="select" placeholder="select" value={upfront} onChange={this.onChangeUpfront}>
                    <option value="">Select...</option>
                    <option value={true}>Upfront</option>
                    <option value={false}>Arrears</option>
                  </FormControl>
                </FormGroup>
              </Col>

            </Panel>

            <Panel header={<h3>Trial Period</h3>}>
              { this.getTrialPrice() }
            </Panel>

            <Panel header={<h3>Recurring Charges</h3>}>
              { this.getPrices() }
              { this.getAddPriceButton(false) }
            </Panel>

          </Form>
        </Col>
      </Row>
    );
  }
}
