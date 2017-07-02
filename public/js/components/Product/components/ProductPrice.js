import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import { Button, FormGroup, Col, Row, ControlLabel, HelpBlock } from 'react-bootstrap';
import Field from '../../Field';

export default class ProductPrice extends Component {

  static propTypes = {
    index: PropTypes.number.isRequired,
    count: PropTypes.number.isRequired,
    item: PropTypes.object.isRequired,
    mode: PropTypes.string,
    unit: PropTypes.string,
    productUnlimitedValue: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]).isRequired,
    onProductEditRate: PropTypes.func.isRequired,
    onProductRemoveRate: PropTypes.func.isRequired,
  }

  static defaultProps = {
    productUnlimitedValue: globalSetting.productUnlimitedValue,
    mode: 'create',
    unit: '',
  };

  state = { fromError: '', toError: '', intervalError: '', priceError: '' }

  shouldComponentUpdate(nextProps, nextState) {
    const { item, mode } = this.props;
    // const fromError = nextState.fromError !== this.state.fromError;
    // const toError = nextState.toError !== this.state.toError;
    // const intervalError = nextState.intervalError !== this.state.intervalError;
    // const priceError = nextState.priceError !== this.state.priceError;
    const modeChnaged = mode !== nextProps.mode
    const itemChanged = !Immutable.is(item, nextProps.item);
    return itemChanged || modeChnaged; // ||fromError || toError || intervalError || priceError
  }

  onEditFrom = (e) => {
    const { index } = this.props;
    let { value } = e.target;
    let fromError = '';
    if (value === '') {
      fromError = 'Required';
    } else if (Number.isInteger(Number(value)) && Number(value) > 0) {
      value = Number(value);
    } else {
      fromError = 'Must be positive integer';
    }
    this.setState({ fromError });
    this.props.onProductEditRate(index, 'from', value);
  }

  onEditTo = (e) => {
    const { index, productUnlimitedValue, item } = this.props;
    let { value } = e.target;
    let toError = '';
    if (value === '') {
      toError = 'Required';
    } else if (productUnlimitedValue !== value && Number.isInteger(Number(value)) && Number(value) > 0) {
      value = Number(value);
      if (value <= item.get('from', 0)) {
        toError = 'Must be greater than "From"';
      }
    } else {
      toError = 'Must be positive integer';
    }
    this.setState({ toError });
    this.props.onProductEditRate(index, 'to', value);
  }

  onEditInterval = (e) => {
    const { index } = this.props;
    let { value } = e.target;
    let intervalError = '';
    if (value === '') {
      intervalError = 'Required';
    } else if (Number.isInteger(Number(value)) && Number(value) > 0) {
      value = Number(value);
    } else {
      intervalError = 'Must be positive integer';
    }
    this.setState({ intervalError });
    this.props.onProductEditRate(index, 'interval', value);
  }

  onEditPrice = (e) => {
    const { index } = this.props;
    const { value } = e.target;
    let priceError = '';
    if (value === '') {
      priceError = 'Required';
    } else if (isNaN(value)) {
      priceError = 'Must be number';
    }
    this.setState({ priceError });
    this.props.onProductEditRate(index, 'price', value);
  }

  onRemoveItem = () => {
    const { index } = this.props;
    this.props.onProductRemoveRate(index);
  }

  render() {
    const { item, index, count, productUnlimitedValue, mode, unit } = this.props;
    const isFirst = index === 0;
    const isLast = ((count === 0) || (count - 1 === index));
    const from = Number(item.get('from', 0));
    const fromDisplayValue = (from > 0 ? from + 1 : from);
    const to = item.get('to', '');
    const toDisplayValue = (to === productUnlimitedValue) ? 'Infinite' : to;
    const editable = (mode !== 'view');

    return (
      <Row className="form-inner-edit-row">
        <Col lg={2} md={2} sm={2} xs={5} >
          <FormGroup validationState={this.state.fromError.length > 0 ? 'error' : null} style={{ margin: 0 }}>
            {isFirst && <ControlLabel>{`From (${unit})`}</ControlLabel>}
            <Field value={fromDisplayValue} disabled={true} editable={editable} />
            { this.state.fromError.length > 0 ? <HelpBlock>{this.state.fromError}</HelpBlock> : ''}
          </FormGroup>
        </Col>

        <Col lg={2} md={2} sm={2} xs={5} >
          <FormGroup validationState={this.state.toError.length > 0 ? 'error' : null} style={{ margin: 0 }}>
            { isFirst && <ControlLabel>{`To (${unit})`}</ControlLabel> }
            { (to === productUnlimitedValue)
              ? <Field value={toDisplayValue} disabled={true} editable={editable} />
              : <Field value={toDisplayValue} onChange={this.onEditTo} fieldType="number" min={0} editable={editable} />
            }
            { this.state.toError.length > 0 ? <HelpBlock>{this.state.toError}</HelpBlock> : ''}
          </FormGroup>
        </Col>

        <Col lg={2} md={2} sm={2} xs={5} >
          <FormGroup validationState={this.state.intervalError.length > 0 ? 'error' : null} style={{ margin: 0 }}>
            {isFirst && <ControlLabel>{`Interval (${unit})`}</ControlLabel>}
            <Field value={item.get('interval', '')} onChange={this.onEditInterval} fieldType="number" min={0} editable={editable} />
            { this.state.intervalError.length > 0 ? <HelpBlock>{this.state.intervalError}</HelpBlock> : ''}
          </FormGroup>
        </Col>

        <Col lg={2} md={2} sm={2} xs={5}>
          <FormGroup validationState={this.state.priceError.length > 0 ? 'error' : null} style={{ margin: 0 }}>
            {isFirst && <ControlLabel>Price Per Interval</ControlLabel>}
            <Field value={item.get('price', '')} onChange={this.onEditPrice} fieldType="price" editable={editable} />
            { this.state.priceError.length > 0 ? <HelpBlock>{this.state.priceError}</HelpBlock> : ''}
          </FormGroup>
        </Col>

        <Col lg={2} md={2} sm={2} xs={2} className="text-right actions">
          { (index > 0 && isLast && editable)
            ? <Button onClick={this.onRemoveItem} bsSize="small" className="pull-left"><i className="fa fa-trash-o danger-red" /> &nbsp;Remove</Button>
            : <Col lg={2} md={2} sm={2} xs={2} className="text-right" />
          }
        </Col>

        { !isLast && <Col smHidden mdHidden lgHidden xs={12}><hr style={{ marginTop: 8, marginBottom: 8 }} /></Col> }
      </Row>
    );
  }
}
