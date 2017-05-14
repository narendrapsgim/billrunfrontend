import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import { Form, FormGroup, Col, Row, Panel, Button } from 'react-bootstrap';
import { getFieldName } from '../../common/Util';
import Help from '../Help';

export default class CalculatorMapping extends Component {
  static propTypes = {
    onSetCustomerMapping: PropTypes.func.isRequired,
    onSetLineKey: PropTypes.func.isRequired,
    onAddRating: PropTypes.func.isRequired,
    onSetRating: PropTypes.func.isRequired,
    onRemoveRating: PropTypes.func.isRequired,
    settings: PropTypes.instanceOf(Immutable.Map),
    subscriberFields: PropTypes.instanceOf(Immutable.List),
  }
  static defaultProps = {
    settings: Immutable.Map(),
  };

  componentDidMount = () => {
    const { settings } = this.props;
    const availableUsagetypes = settings.get('rate_calculators', Immutable.Map()).keySeq().map(usaget => (usaget));
    availableUsagetypes.forEach((usaget) => {
      const calcs = settings.getIn(['rate_calculators', usaget], Immutable.List());
      if (calcs.size === 0) {
        this.props.onAddRating({ target: { dataset: { usaget } } });
      }
    });
  };

  onChangeAdditionalParamRating = (e) => {
    const { value } = e.target;
    const eModified = Object.assign({}, e);
    eModified.target.dataset.rate_key = `params.${value}`;
    eModified.target.value = 'match';
    this.props.onSetRating(eModified);
  }

  onSetCustomerMapping = (index, e) => {
    const { value, id } = e.target;
    this.props.onSetCustomerMapping(id, value, index);
  }
  getAvailableFields = (addBillrunFields) => {
    const { settings } = this.props;
    const billrunFields = Immutable.fromJS(addBillrunFields ? ['type', 'usaget'] : []);
    const options = [
      (<option disabled value="" key={-3}>Select Field</option>),
      ...(billrunFields.push(...settings.get('fields', []))).sortBy(field => field).map((field, key) => (
        <option value={field} key={key}>{field}</option>
      )),
    ];
    return options;
  }
  getAvailableTargetFields = () => {
    const { subscriberFields } = this.props;
    const optionsKeys = subscriberFields
      .filter(field => field.get('unique', false))
      .map(field => field.get('field_name', ''));
    const options = [
      (<option disabled value="-1" key={-1}>Select Field...</option>),
      ...optionsKeys.map((field, key) => <option value={field} key={key}>{getFieldName(field, 'customerIdentification')}</option>),
    ];
    return options;
  }
  getRateCalculators = (usaget) => {
    const { onSetLineKey, onSetRating, onRemoveRating } = this.props;
    const availableFields = this.getAvailableFields(true);
    return this.rateCalculatorsForUsaget(usaget).map((calc, calcKey) => {
      let selectedRadio = 4;
      if (calc.get('type', '') === 'longestPrefix') {
        selectedRadio = 3;
      } else if (calc.get('rate_key', '') === 'key') {
        selectedRadio = 1;
      } else if (calc.get('rate_key', '') === 'usaget') {
        selectedRadio = 2;
      }
      return (
        <div key={calcKey}>
          <Row key={calcKey} style={{ marginBottom: 10 }}>
            <Col lg={3} md={3} style={{ paddingRight: 0 }}>
              <FormGroup style={{ margin: 0 }}>
                <select
                  className="form-control"
                  id={usaget}
                  onChange={onSetLineKey}
                  data-usaget={usaget}
                  data-index={calcKey}
                  value={calc.get('line_key', '')}
                >
                  { availableFields }
                </select>
              </FormGroup>
            </Col>

            <Col lg={6} md={6} style={{ paddingRight: 0 }}>
              <FormGroup style={{ margin: 0, paddingLeft: 13 }}>
                <input
                  type="radio"
                  name={`${usaget}-${calcKey}-type`}
                  id={`${usaget}-${calcKey}-by-rate-key`}
                  value="match"
                  data-usaget={usaget}
                  data-rate_key="key"
                  data-index={calcKey}
                  checked={selectedRadio === 1}
                  onChange={onSetRating}
                />&nbsp;
                <label htmlFor={`${usaget}-${calcKey}-by-rate-key`} style={{ verticalAlign: 'middle' }}>By product key</label>
              </FormGroup>

              <FormGroup style={{ margin: 0, paddingLeft: 13 }}>
                <input
                  type="radio"
                  name={`${usaget}-${calcKey}-type`}
                  id={`${usaget}-${calcKey}-by-rate-usaget`}
                  value="match"
                  data-usaget={usaget}
                  data-rate_key="usaget"
                  data-index={calcKey}
                  checked={selectedRadio === 2}
                  onChange={onSetRating}
                />&nbsp;
                <label htmlFor={`${usaget}-${calcKey}-by-rate-usaget`} style={{ verticalAlign: 'middle' }}>By product unit type</label>
              </FormGroup>

              <FormGroup style={{ margin: 0, paddingLeft: 13 }}>
                <input
                  type="radio"
                  name={`${usaget}-${calcKey}-type`}
                  id={`${usaget}-${calcKey}-longest-prefix`}
                  value="longestPrefix"
                  data-usaget={usaget}
                  checked={selectedRadio === 3}
                  data-rate_key="params.prefix"
                  data-index={calcKey}
                  onChange={onSetRating}
                />&nbsp;
                <label htmlFor={`${usaget}-${calcKey}-longest-prefix`} style={{ verticalAlign: 'middle' }}>By longest prefix</label>
              </FormGroup>

              <FormGroup style={{ margin: 0 }}>
                <div className="input-group">
                  <div className="input-group-addon">
                    <input
                      type="radio"
                      name={`${usaget}-${calcKey}-type`}
                      id={`${usaget}-${calcKey}-by-param`}
                      value="match"
                      data-usaget={usaget}
                      checked={selectedRadio === 4}
                      data-rate_key="params."
                      data-index={calcKey}
                      onChange={onSetRating}
                    />&nbsp;
                    <label htmlFor={`${usaget}-${calcKey}-by-param`} style={{ verticalAlign: 'middle' }}>By product param</label>
                    <Help contents="This field needs to be configured in the 'Additional Parameters' of a Product" />
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    id={`${usaget}-${calcKey}-by-param-name`}
                    data-usaget={usaget}
                    data-index={calcKey}
                    checked={selectedRadio !== 4}
                    value={selectedRadio !== 4 ? '' : calc.get('rate_key', '').replace('params.', '')}
                    onChange={this.onChangeAdditionalParamRating}
                  />
                </div>
              </FormGroup>
            </Col>

            <Col lg={1} md={1} sm={1} xs={1} />

            <Col lg={2} md={2} sm={2} xs={2}>
              { calcKey > 0 &&
                <FormGroup style={{ margin: 0 }}>
                  <div style={{ width: '100%', height: 39 }}>
                    <Button onClick={onRemoveRating} data-usaget={usaget} data-index={calcKey} bsSize="small" className="pull-left" ><i className="fa fa-trash-o danger-red" />&nbsp;Remove</Button>
                  </div>
                </FormGroup>
              }
            </Col>
          </Row>
          <hr />
        </div>
      );
    });
  }

  getAddRatingButton = usaget => (<Button bsSize="xsmall" className="btn-primary" data-usaget={usaget} onClick={this.props.onAddRating}><i className="fa fa-plus" />&nbsp;Add</Button>);
  rateCalculatorsForUsaget = usaget => (this.props.settings.getIn(['rate_calculators', usaget], Immutable.List()));

  renderCustomerIdentification = () => {
    const { settings } = this.props;
    const availableFields = this.getAvailableFields(false);
    const availableTargetFields = this.getAvailableTargetFields();
    const availableUsagetypes = settings.get('customer_identification_fields', Immutable.List());
    return availableUsagetypes.map((usaget, key) => {
      const regex = usaget.getIn(['conditions', 0, 'regex'], '');
      const label = regex.substring(2, regex.length - 2);
      const targetKey = usaget.getIn(['target_key'], 'sid');
      const srcKey = usaget.getIn(['src_key'], '');
      return (
        <div key={key}>
          <div className="form-group">
            <div className="col-lg-3">
              <label htmlFor={label}>{ label }</label>
            </div>
            <div className="col-lg-9">
              <div className="col-lg-1" style={{ marginTop: 8 }}>
                <i className="fa fa-long-arrow-right" />
              </div>
              <div className="col-lg-9">
                <div className="row">
                  <div className="col-lg-6">
                    <select id="src_key" className="form-control" onChange={this.onSetCustomerMapping.bind(this, key)} value={srcKey} >
                      { availableFields }
                    </select>
                  </div>
                  <div className="col-lg-6">
                    <select id="target_key" className="form-control" onChange={this.onSetCustomerMapping.bind(this, key)} value={targetKey}>
                      { availableTargetFields }
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    });
  }

  render() {
    const { settings } = this.props;
    const availableUsagetypes = settings.get('rate_calculators', Immutable.Map()).keySeq().map(usaget => (usaget));
    return (
      <Form horizontal className="CalculatorMapping">
        <div className="form-group">
          <div className="col-lg-12">
            <h4>
              Customer identification
              <small> | Map customer identification field in record to BillRun field</small>
            </h4>
          </div>
        </div>
        { this.renderCustomerIdentification().toArray() }
        <div className="separator" />
        <div className="form-group">
          <div className="col-lg-12">
            <h4>Rate by</h4>
          </div>
        </div>
        {availableUsagetypes.map((usaget, key) => (
          <div key={key}>
            <div className="form-group">
              <div className="col-lg-3">
                <label htmlFor={usaget}>
                  { usaget }
                </label>
              </div>
              <div className="col-lg-9">
                <div className="col-lg-1" style={{ marginTop: 8 }}>
                  <i className="fa fa-long-arrow-right" />
                </div>
                <div className="col-lg-11">
                  <Panel>
                    { this.getRateCalculators(usaget) }
                    { this.getAddRatingButton(usaget) }
                  </Panel>
                </div>
              </div>
            </div>
          </div>
         ))}
      </Form>
    );
  }
}
