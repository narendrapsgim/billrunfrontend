import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import { Button, FormGroup, Col, Row, ControlLabel, HelpBlock } from 'react-bootstrap';
import Field from '../../Field';


export default class PlanPrice extends Component {

  static propTypes = {
    onPlanTariffRemove: PropTypes.func.isRequired,
    onPlanCycleUpdate: PropTypes.func.isRequired,
    onPlanPriceUpdate: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
    count: PropTypes.number.isRequired,
    isTrialExist: PropTypes.bool.isRequired,
    item: PropTypes.instanceOf(Immutable.Map),
    planCycleUnlimitedValue: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]).isRequired,
  }

  static defaultProps = {
    planCycleUnlimitedValue: globalSetting.planCycleUnlimitedValue,
  };

  state = {
    cycleError: '',
    priceError: '',
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { props: { count, index }, state: { cycleError, priceError } } = this;
    // if count was changed and this is last item
    const isLastAdded = count < nextProps.count && index === (count - 1);
    const isLastremoved = count > nextProps.count && index === (count - 2);
    const error = nextState.cycleError !== cycleError || nextState.priceError !== priceError;
    return !Immutable.is(this.props.item, nextProps.item)
      || this.props.index !== nextProps.index
      || isLastAdded
      || isLastremoved
      || error;
  }

  onCycleUpdateValue = (value) => {
    const { index } = this.props;
    let cycleError = '';
    let newValue = value;
    if (typeof value === 'undefined' || value === null || value === '') {
      cycleError = 'Cycle is required';
      newValue = 0;
    } else if (isNaN(value) || !(Math.sign(value) > 0)) {
      cycleError = 'Value must be positive number';
      newValue = 0;
    }
    this.props.onPlanCycleUpdate(index, newValue);
    this.setState({ cycleError });
  }

  onCycleUpdateEvent = (e) => {
    this.onCycleUpdateValue(e.target.value);
  }

  onPlanPriceUpdate = (e) => {
    const { index } = this.props;
    const { value } = e.target;
    let priceError = '';
    if (typeof value === 'undefined' || value === null || value === '') {
      priceError = 'Price is required';
    } else if (isNaN(value) || !(Math.sign(value) >= 0)) {
      priceError = 'Value must be positive number';
    }
    this.setState({ priceError });
    this.props.onPlanPriceUpdate(index, value);
  }

  onPlanTariffRemove = () => {
    const { index } = this.props;
    this.props.onPlanTariffRemove(index);
  }

  getCycleDisplayValue = () => {
    const { item, planCycleUnlimitedValue } = this.props;
    const to = item.get('to', '');
    const from = item.get('from', '');
    switch (to) {
      case planCycleUnlimitedValue: return 'Infinite';
      case '': return '';
      default: return (to - from);
    }
  }

  render() {
    const { cycleError, priceError } = this.state;
    const { item, index, count, isTrialExist, planCycleUnlimitedValue } = this.props;
    const price = item.get('price', '');
    const trial = item.get('trial', false);
    const to = item.get('to', '');
    const cycle = this.getCycleDisplayValue();
    const isFirst = (index === 0 || (isTrialExist && index === 1));
    const isLast = ((count === 0) || (count - 1 === index));
    const showRemoveButton = trial || isLast;

    return (
      <Row style={{ marginBottom: 10 }}>
        <Col lg={1} md={1} className="text-center">
          { isFirst && <ControlLabel style={{ marginBottom: 5 }}>Period</ControlLabel>}
          <p style={{ marginTop: 9 }}>{ index + 1 }</p>
        </Col>
        <Col lg={4} md={4} style={{ paddingRight: 0 }}>
          <FormGroup validationState={cycleError.length ? 'error' : null} style={{ margin: 0 }}>
            { isFirst && <ControlLabel style={{ marginBottom: 5 }}>Cycles</ControlLabel>}
            { (to === planCycleUnlimitedValue)
              ? <Field value={cycle} disabled={true} />
              : <Field value={cycle} onChange={this.onCycleUpdateEvent} fieldType="number" min={0} />
            }
            { cycleError.length > 0 && <HelpBlock>{cycleError}.</HelpBlock>}
          </FormGroup>
        </Col>

        <Col lg={4} md={4} style={{ paddingRight: 0 }}>
          <FormGroup validationState={priceError.length ? 'error' : null} style={{ margin: 0 }}>
            { isFirst && <ControlLabel style={{ marginBottom: 5 }}>Price</ControlLabel>}
            <Field onChange={this.onPlanPriceUpdate} value={price} />
            { priceError.length > 0 && <HelpBlock>{priceError}.</HelpBlock>}
          </FormGroup>
        </Col>

        <Col lg={3} md={3} sm={3} xs={3}>
          { showRemoveButton &&
            <FormGroup style={{ margin: 0 }}>
              { isFirst && <ControlLabel style={{ marginBottom: 5 }}>&nbsp;</ControlLabel>}
              <div style={{ width: '100%', height: 39 }}>
                <Button onClick={this.onPlanTariffRemove} bsSize="small" className="pull-left" ><i className="fa fa-trash-o danger-red" />&nbsp;Remove</Button>
              </div>
            </FormGroup>
          }
        </Col>
      </Row>
    );
  }
}
