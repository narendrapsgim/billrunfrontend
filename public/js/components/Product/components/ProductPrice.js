import React, { Component, PropTypes } from 'react';
import { Button, FormGroup, Col, Row, ControlLabel, HelpBlock } from 'react-bootstrap';
import Field from '../../Field';

export default class ProductPrice extends Component {

  static propTypes = {
    index: PropTypes.number.isRequired,
    count: PropTypes.number.isRequired,
    item: PropTypes.object.isRequired,
    onProductEditRate: PropTypes.func.isRequired,
    onProductRemoveRate: PropTypes.func.isRequired,
  }

  state = { fromError: '', toError: '', intervalError: '', priceError: '' }

  // shouldComponentUpdate(nextProps, nextState){
  //   //if count was changed and this is last item
  //   const isLastAdded = this.props.count < nextProps.count && this.props.index === (this.props.count - 1);
  //   const isLastremoved = this.props.count > nextProps.count && this.props.index === (this.props.count - 2);
  //   const fromError = nextState.fromError !== this.state.fromError;
  //   const toError = nextState.toError !== this.state.toError;
  //   const intervalError = nextState.intervalError !== this.state.intervalError;
  //   const priceError = nextState.priceError !== this.state.priceError;
  //   const itemChanged = !Immutable.is(this.props.item, nextProps.item);
  //   const indexChanged = this.props.index !== nextProps.index
  //   return  isLastAdded || isLastremoved || fromError || toError || intervalError || priceError || itemChanged || indexChanged;
  // }

  onEditFrom = (e) => {
    const { index } = this.props;
    const { value } = e.target;
    if (Number.isInteger(Number(value)) && Number(value) > 0) {
      const from = (value === '') ? '' : Number(value);
      this.props.onProductEditRate(index, 'from', from);
      this.setState({ fromError: '' });
    } else {
      this.setState({ fromError: 'Must be of type integer' });
      this.props.onProductEditRate(index, 'from', value);
    }
  }

  onEditTo = (e) => {
    const { index } = this.props;
    const { value } = e.target;
    if (Number.isInteger(Number(value)) && Number(value) > 0) {
      const to = (value === '') ? '' : Number(value);
      this.props.onProductEditRate(index, 'to', to);
      this.setState({ toError: '' });
    } else {
      this.setState({ toError: 'Must be of type integer' });
      this.props.onProductEditRate(index, 'to', value);
    }
  }

  onEditInterval = (e) => {
    const { index } = this.props;
    const { value } = e.target;
    if (Number.isInteger(Number(value)) && Number(value) > 0) {
      const interval = (value === '') ? '' : Number(value);
      this.props.onProductEditRate(index, 'interval', interval);
      this.setState({ intervalError: '' });
    } else {
      this.setState({ intervalError: 'Must be positive integer' });
      this.props.onProductEditRate(index, 'interval', value);
    }
  }

  onEditPrice = (e) => {
    const { index } = this.props;
    const { value } = e.target;
    this.props.onProductEditRate(index, 'price', value);
  }

  onRemoveItem = () => {
    const { index } = this.props;
    this.props.onProductRemoveRate(index);
  }

  render() {
    const { item, index, count } = this.props;
    const isFirst = index === 0;
    const isLast = ((count === 0) || (count - 1 === index));
    const from = item.get('from', 0);
    const fromDisplayValue = (from > 0 ? from + 1 : from);

    return (
      <Row className="form-inner-edit-row">
        <Col lg={2} md={2} sm={2} xs={5} >
          <FormGroup validationState={this.state.fromError.length > 0 ? 'error' : null} style={{ margin: 0 }}>
            {isFirst && <ControlLabel>From</ControlLabel>}
            <Field value={fromDisplayValue} disabled={true} />
            { this.state.fromError.length > 0 ? <HelpBlock>{this.state.fromError}</HelpBlock> : ''}
          </FormGroup>
        </Col>

        <Col lg={3} md={3} sm={3} xs={5} >
          <FormGroup validationState={this.state.toError.length > 0 ? 'error' : null} style={{ margin: 0 }}>
            { isFirst && <ControlLabel>To</ControlLabel> }
            { isLast
              ? <Field value="Unlimited" disabled={true} />
              : <Field value={item.get('to', '')} onChange={this.onEditTo} fieldType="number" min={0} />
            }
            { this.state.toError.length > 0 ? <HelpBlock>{this.state.toError}</HelpBlock> : ''}
          </FormGroup>
        </Col>

        <Col lg={2} md={2} sm={2} xs={5} >
          <FormGroup validationState={this.state.intervalError.length > 0 ? 'error' : null} style={{ margin: 0 }}>
            {isFirst && <ControlLabel>Interval</ControlLabel>}
            <Field value={item.get('interval', '')} onChange={this.onEditInterval} fieldType="number" min={0} />
            { this.state.intervalError.length > 0 ? <HelpBlock>{this.state.intervalError}</HelpBlock> : ''}
          </FormGroup>
        </Col>

        <Col lg={2} md={2} sm={2} xs={5}>
          <FormGroup style={{ margin: 0 }}>
            {isFirst && <ControlLabel>Price Per Interval</ControlLabel>}
            <Field value={item.get('price', '')} onChange={this.onEditPrice} fieldType="price" />
          </FormGroup>
        </Col>

        <Col lg={2} md={2} sm={2} xs={2} className="text-right actions">
          { (index > 0 && isLast)
            ? <Button onClick={this.onRemoveItem} bsSize="small" className="pull-left"><i className="fa fa-trash-o danger-red" /> &nbsp;Remove</Button>
            : <Col lg={2} md={2} sm={2} xs={2} className="text-right" />
          }
        </Col>

        { !isLast && <Col smHidden mdHidden lgHidden xs={12}><hr style={{ marginTop: 8, marginBottom: 8 }} /></Col> }
      </Row>
    );
  }
}
