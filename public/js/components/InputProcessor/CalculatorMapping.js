import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import { Form, FormGroup, Col, Row, Panel, Button, ControlLabel } from 'react-bootstrap';
import Select from 'react-select';
import { ModalWrapper } from '../Elements';
import { getFieldName, getConfig } from '../../common/Util';
import Help from '../Help';
import Field from '../Field';

export default class CalculatorMapping extends Component {
  static propTypes = {
    onSetCustomerMapping: PropTypes.func.isRequired,
    onSetLineKey: PropTypes.func.isRequired,
    onSetComputedLineKey: PropTypes.func.isRequired,
    onUnsetComputedLineKey: PropTypes.func.isRequired,
    onAddRating: PropTypes.func.isRequired,
    onSetRating: PropTypes.func.isRequired,
    onRemoveRating: PropTypes.func.isRequired,
    settings: PropTypes.instanceOf(Immutable.Map),
    subscriberFields: PropTypes.instanceOf(Immutable.List),
    customRatingFields: PropTypes.instanceOf(Immutable.List),
  }
  static defaultProps = {
    settings: Immutable.Map(),
    subscriberFields: Immutable.List(),
    customRatingFields: Immutable.List(),
  };

  state = {
    computedLineKey: null,
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

  getCustomRatingFields = () => {
    const { customRatingFields } = this.props;
    return customRatingFields
      .filter(field => (field.get('field_name', '').startsWith('params.')))
      .map(field => ({
        value: field.get('field_name', ''),
        label: field.get('title', ''),
      }))
      .toJS();
  }

  getRatingTypes = () => ([
    { value: 'match', label: 'Equals' },
    { value: 'longestPrefix', label: 'Longest Prefix' },
  ]);

  onChangeAdditionalParamRating = (usaget, index, type, value) => {
    const eModified = {
      target: {
        dataset: {
          rate_key: value,
          usaget,
          index,
        },
        value: type,
        custom: true,
      },
    };
    this.props.onSetRating(eModified);
  }

  onChangeAdditionalParamRatingType = (value, usaget, index, type) => {
    this.onChangeAdditionalParamRating(usaget, index, type, value);
  }

  onSetCustomerMapping = (index, e) => {
    const { value, id } = e.target;
    this.props.onSetCustomerMapping(id, value, index);
  }

  getAvailableFields = (addBillrunFields, addComputedField) => {
    const { settings } = this.props;
    const billrunFields = Immutable.fromJS(addBillrunFields ? [{ value: 'type', label: 'Type' }, { value: 'usaget', label: 'Usage Type' }] : []);
    const fields = settings.get('fields', []).map(field => (Immutable.Map({ value: field, label: field }))).sortBy(field => field.get('value', ''));
    const computedField = Immutable.fromJS(addComputedField ? [{ value: 'computed', label: 'Computed' }] : []);
    return billrunFields.concat(fields, computedField);
  }

  getCustomerIdentificationFields = () =>
    this.getAvailableFields(false, false).map((field, key) => (
      <option value={field.get('value', '')} key={key}>{field.get('label', '')}</option>
    ));

  getRateCalculatorFields = () =>
    this.getAvailableFields(true, true).map((field, key) => (
      <option value={field.get('value', '')} key={key}>{field.get('label', '')}</option>
    ));

  getRateConditions = () => (getConfig(['rates', 'conditions'], Immutable.Map()).map(condType => (
    { value: condType.get('key', ''), label: condType.get('title', '') })).toArray()
  );

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

  onChangeLineKey = (e) => {
    const { dataset: { usaget, index }, value } = e.target;
    if (value === 'computed') {
      this.setState({ computedLineKey: Immutable.Map({ usaget, index }) });
    } else {
      this.setState({ computedLineKey: null });
      this.props.onUnsetComputedLineKey(usaget, index);
    }
    this.props.onSetLineKey(e);
  }

  onEditComputedLineKey = (calc, usaget, index) => () => {
    this.setState({
      computedLineKey: Immutable.Map({
        usaget,
        index,
        line_keys: calc.getIn(['computed', 'line_keys'], Immutable.List()),
        operator: calc.getIn(['computed', 'operator'], ''),
      }),
    });
  }

  renderComputedLineKeyDesc = (calc, usaget, index) => {
    if (calc.get('line_key', '') !== 'computed') {
      return null;
    }
    const op = calc.getIn(['computed', 'operator'], '');
    const opLabel = (getConfig(['rates', 'conditions'], Immutable.Map()).find(cond => cond.get('key', '') === op) || Immutable.Map()).get('title', '');
    return (
      <h4>
        <small>
          {`${calc.getIn(['computed', 'line_keys', 0, 'key'], '')} ${opLabel} ${calc.getIn(['computed', 'line_keys', 1, 'key'], '')}`}
          <Button onClick={this.onEditComputedLineKey(calc, usaget, index)} bsStyle="link">
            <i className="fa fa-fw fa-pencil" />
          </Button>
        </small>
      </h4>
    );
  }

  getRateCalculators = (usaget) => {
    const { onSetRating, onRemoveRating } = this.props;
    const availableFields = this.getRateCalculatorFields();
    return this.rateCalculatorsForUsaget(usaget).map((calc, calcKey) => {
      let selectedRadio = 3;
      if (calc.get('rate_key', '') === 'key') {
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
                  onChange={this.onChangeLineKey}
                  data-usaget={usaget}
                  data-index={calcKey}
                  value={calc.get('line_key', '')}
                >
                  { availableFields }
                </select>
                { this.renderComputedLineKeyDesc(calc, usaget, calcKey) }
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

              <FormGroup style={{ margin: 0 }}>
                <div className="input-group">
                  <div className="input-group-addon">
                    <input
                      type="radio"
                      name={`${usaget}-${calcKey}-type`}
                      id={`${usaget}-${calcKey}-by-param`}
                      value="match"
                      data-usaget={usaget}
                      checked={selectedRadio === 3}
                      data-rate_key=""
                      data-index={calcKey}
                      onChange={onSetRating}
                    />&nbsp;
                    <label htmlFor={`${usaget}-${calcKey}-by-param`} style={{ verticalAlign: 'middle' }}>By product param</label>
                    <Help contents="This field needs to be configured in the 'Additional Parameters' of a Product" />
                  </div>
                  <Select
                    id={`${usaget}-${calcKey}-by-param-name`}
                    onChange={this.onChangeAdditionalParamRating.bind(this, usaget, calcKey, calc.get('type', ''))}
                    value={selectedRadio !== 3 ? '' : calc.get('rate_key', '')}
                    options={this.getCustomRatingFields()}
                    allowCreate
                  />
                  <Select
                    id={`${usaget}-${calcKey}-by-param-name-type`}
                    onChange={this.onChangeAdditionalParamRatingType.bind(this, calc.get('rate_key', ''), usaget, calcKey)}
                    value={selectedRadio !== 3 ? '' : calc.get('type', '')}
                    options={this.getRatingTypes()}
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
    const availableFields = this.getCustomerIdentificationFields();
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

  onSaveComputedLineKey = () => {
    const { computedLineKey } = this.state;
    this.props.onSetComputedLineKey([computedLineKey.get('usaget'), computedLineKey.get('index'), 'computed', 'line_keys'], computedLineKey.get('line_keys', Immutable.List()));
    this.props.onSetComputedLineKey([computedLineKey.get('usaget'), computedLineKey.get('index'), 'computed', 'operator'], computedLineKey.get('operator', ''));
    this.setState({ computedLineKey: null });
  }

  onHideComputedLineKey = () => {
    this.setState({ computedLineKey: null });
  }

  onChangeComputedLineKey = path => (value) => {
    const { computedLineKey } = this.state;
    this.setState({
      computedLineKey: computedLineKey.setIn(path, value),
    });
  }

  renderComputedRatePopup = () => {
    const { computedLineKey } = this.state;
    if (!computedLineKey) {
      return null;
    }
    const title = 'Computed Rate Key';
    const regexHelper = 'In case you want to run a regular expression on the computed field before calculating the rate';
    const lineKeyOptions = this.getAvailableFields(false, false).toJS();
    return (
      <ModalWrapper title={title} show={true} onOk={this.onSaveComputedLineKey} onHide={this.onHideComputedLineKey} labelOk="OK">
        <Form horizontal>
          <FormGroup>
            <Col sm={3} componentClass={ControlLabel}>First Field</Col>
            <Col sm={4}>
              <Select
                onChange={this.onChangeComputedLineKey(['line_keys', 0, 'key'])}
                value={computedLineKey.getIn(['line_keys', 0, 'key'], '')}
                options={lineKeyOptions}
              />
            </Col>
            <Col sm={4}>
              <Field
                value={computedLineKey.getIn(['line_keys', 0, 'regex'], '')}
                disabledValue={''}
                onChange={this.onChangeComputedLineKey(['line_keys', 0, 'regex'])}
                disabled={computedLineKey.getIn(['line_keys', 0, 'key'], '') === ''}
                label="Regex"
                fieldType="toggeledInput"
              />
            </Col>
            <Col sm={1}>
              <Help contents={regexHelper} />
            </Col>
          </FormGroup>
          <FormGroup>
            <Col sm={3} componentClass={ControlLabel}>Operator</Col>
            <Col sm={4}>
              <Select
                onChange={this.onChangeComputedLineKey(['operator'])}
                value={computedLineKey.get('operator', '')}
                options={this.getRateConditions()}
              />
            </Col>
          </FormGroup>
          <FormGroup>
            <Col sm={3} componentClass={ControlLabel}>Second Field</Col>
            <Col sm={4}>
              <Select
                onChange={this.onChangeComputedLineKey(['line_keys', 1, 'key'])}
                value={computedLineKey.getIn(['line_keys', 1, 'key'], '')}
                options={lineKeyOptions}
              />
            </Col>
            <Col sm={4}>
              <Field
                value={computedLineKey.getIn(['line_keys', 1, 'regex'], '')}
                disabledValue={''}
                onChange={this.onChangeComputedLineKey(['line_keys', 1, 'regex'])}
                disabled={computedLineKey.getIn(['line_keys', 1, 'key'], '') === ''}
                label="Regex"
                fieldType="toggeledInput"
              />
            </Col>
            <Col sm={1}>
              <Help contents={regexHelper} />
            </Col>
          </FormGroup>
        </Form>
      </ModalWrapper>
    );
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
        { this.renderComputedRatePopup()}
      </Form>
    );
  }
}
