import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import { Form, FormGroup, Col, Row, Panel, Button, ControlLabel } from 'react-bootstrap';
import Select from 'react-select';
import { ModalWrapper } from '../Elements';
import { getFieldName, getConfig, formatSelectOptions } from '../../common/Util';
import Help from '../Help';
import Field from '../Field';

export default class CalculatorMapping extends Component {
  static propTypes = {
    onSetCustomerMapping: PropTypes.func.isRequired,
    onSetLineKey: PropTypes.func.isRequired,
    onSetComputedLineKey: PropTypes.func.isRequired,
    onUnsetComputedLineKey: PropTypes.func.isRequired,
    onAddRating: PropTypes.func.isRequired,
    onAddRatingPriority: PropTypes.func.isRequired,
    onRemoveRatingPriority: PropTypes.func.isRequired,
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
    openRateCalculators: [0],
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

  onChangeAdditionalParamRating = (usaget, priority, index, type, value) => {
    const eModified = {
      target: {
        dataset: {
          rate_key: value,
          usaget,
          priority,
          index,
        },
        value: type,
        custom: true,
      },
    };
    this.props.onSetRating(eModified);
  }

  onChangeAdditionalParamRatingType = (value, usaget, priority, index, type) => {
    this.onChangeAdditionalParamRating(usaget, priority, index, type, value);
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
    const { dataset: { usaget, index, priority }, value } = e.target;
    if (value === 'computed') {
      this.setState({ computedLineKey: Immutable.Map({ usaget, priority, index }) });
    } else {
      this.setState({ computedLineKey: null });
      this.props.onUnsetComputedLineKey(usaget, priority, index);
    }
    this.props.onSetLineKey(e);
  }

  onEditComputedLineKey = (calc, usaget, priority, index) => () => {
    this.setState({
      computedLineKey: Immutable.Map({
        usaget,
        priority,
        index,
        type: calc.getIn(['computed', 'type'], 'regex'),
        line_keys: calc.getIn(['computed', 'line_keys'], Immutable.List()),
        operator: calc.getIn(['computed', 'operator'], ''),
        must_met: calc.getIn(['computed', 'must_met'], false),
        projection: Immutable.Map({
          on_true: Immutable.Map({
            key: calc.getIn(['computed', 'projection', 'on_true', 'key'], 'condition_result'),
            regex: calc.getIn(['computed', 'projection', 'on_true', 'regex'], ''),
            value: calc.getIn(['computed', 'projection', 'on_true', 'value'], ''),
          }),
          on_false: Immutable.Map({
            key: calc.getIn(['computed', 'projection', 'on_false', 'key'], 'condition_result'),
            regex: calc.getIn(['computed', 'projection', 'on_false', 'regex'], ''),
            value: calc.getIn(['computed', 'projection', 'on_false', 'value'], ''),
          }),
        }),
      }),
    });
  }

  renderComputedLineKeyDesc = (calc, usaget, priority, index) => {
    if (calc.get('line_key', '') !== 'computed') {
      return null;
    }
    const op = calc.getIn(['computed', 'operator'], '');
    const opLabel = (getConfig(['rates', 'conditions'], Immutable.Map()).find(cond => cond.get('key', '') === op) || Immutable.Map()).get('title', '');
    return (
      <h4>
        <small>
          {`${calc.getIn(['computed', 'line_keys', 0, 'key'], '')} ${opLabel} ${calc.getIn(['computed', 'line_keys', 1, 'key'], '')}`}
          <Button onClick={this.onEditComputedLineKey(calc, usaget, priority, index)} bsStyle="link">
            <i className="fa fa-fw fa-pencil" />
          </Button>
        </small>
      </h4>
    );
  }

  openRateCalculator = priority => () => {
    const { openRateCalculators } = this.state;
    openRateCalculators.push(priority);
    this.setState({ openRateCalculators });
  }

  closeRateCalculator = priority => () => {
    const { openRateCalculators } = this.state;
    openRateCalculators.splice(openRateCalculators.indexOf(priority), 1);
    this.setState({ openRateCalculators });
  }

  onAddRatingPriority = usaget => () => {
    this.openRateCalculator(this.rateCalculatorsForUsaget(usaget).size)();
    this.props.onAddRatingPriority(usaget);
  }

  onRemoveRatingPriority = (usaget, priority) => () => {
    this.props.onRemoveRatingPriority(usaget, priority);
  }

  getRateCalculators = (usaget) => {
    const { openRateCalculators } = this.state;
    const noRemoveStyle = { paddingLeft: 45 };
    return this.rateCalculatorsForUsaget(usaget).map((calcs, priority) => {
      const showRemove = priority > 0;
      const actionsStyle = showRemove ? {} : noRemoveStyle;
      return (
        <div key={`rate-calculator-${usaget}-${priority}`}>
          <Row>
            <Col sm={10} />
            <Col sm={2} style={actionsStyle}>
              { showRemove && this.getRemoveRatingPriorityButton(usaget, priority) }
              {
                openRateCalculators.includes(priority)
                ? (<Button onClick={this.closeRateCalculator(priority)} bsStyle="link">
                  <i className="fa fa-fw fa-minus" />
                </Button>)
                : (<Button onClick={this.openRateCalculator(priority)} bsStyle="link">
                  <i className="fa fa-fw fa-plus" />
                </Button>)
              }
            </Col>
          </Row>
          <Panel collapsible expanded={this.state.openRateCalculators.includes(priority)}>
            { this.getRateCalculatorsForPriority(usaget, priority, calcs) }
            { this.getAddRatingButton(usaget, priority) }
          </Panel>
        </div>
      );
    }).toArray();
  }

  getRateCalculatorsForPriority = (usaget, priority, calcs) => {
    const { onSetRating, onRemoveRating } = this.props;
    const availableFields = this.getRateCalculatorFields();
    return calcs.map((calc, calcKey) => {
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
                  data-priority={priority}
                  value={calc.get('line_key', '')}
                >
                  { availableFields }
                </select>
                { this.renderComputedLineKeyDesc(calc, usaget, priority, calcKey) }
              </FormGroup>
            </Col>

            <Col lg={6} md={6} style={{ paddingRight: 0 }}>
              <FormGroup style={{ margin: 0, paddingLeft: 13 }}>
                <input
                  type="radio"
                  name={`${usaget}-${priority}-${calcKey}-type`}
                  id={`${usaget}-${priority}-${calcKey}-by-rate-key`}
                  value="match"
                  data-usaget={usaget}
                  data-rate_key="key"
                  data-index={calcKey}
                  data-priority={priority}
                  checked={selectedRadio === 1}
                  onChange={onSetRating}
                />&nbsp;
                <label htmlFor={`${usaget}-${priority}-${calcKey}-by-rate-key`} style={{ verticalAlign: 'middle' }}>By product key</label>
              </FormGroup>

              <FormGroup style={{ margin: 0, paddingLeft: 13 }}>
                <input
                  type="radio"
                  name={`${usaget}-${priority}-${calcKey}-type`}
                  id={`${usaget}-${priority}-${calcKey}-by-rate-usaget`}
                  value="match"
                  data-usaget={usaget}
                  data-rate_key="usaget"
                  data-index={calcKey}
                  data-priority={priority}
                  checked={selectedRadio === 2}
                  onChange={onSetRating}
                />&nbsp;
                <label htmlFor={`${usaget}-${priority}-${calcKey}-by-rate-usaget`} style={{ verticalAlign: 'middle' }}>By product unit type</label>
              </FormGroup>

              <FormGroup style={{ margin: 0 }}>
                <div className="input-group">
                  <div className="input-group-addon">
                    <input
                      type="radio"
                      name={`${usaget}-${priority}-${calcKey}-type`}
                      id={`${usaget}-${priority}-${calcKey}-by-param`}
                      value="match"
                      data-usaget={usaget}
                      checked={selectedRadio === 3}
                      data-rate_key=""
                      data-index={calcKey}
                      data-priority={priority}
                      onChange={onSetRating}
                    />&nbsp;
                    <label htmlFor={`${usaget}-${priority}-${calcKey}-by-param`} style={{ verticalAlign: 'middle' }}>By product param</label>
                    <Help contents="This field needs to be configured in the 'Additional Parameters' of a Product" />
                  </div>
                  <Select
                    id={`${usaget}-${priority}-${calcKey}-by-param-name`}
                    onChange={this.onChangeAdditionalParamRating.bind(this, usaget, priority, calcKey, calc.get('type', ''))}
                    value={selectedRadio !== 3 ? '' : calc.get('rate_key', '')}
                    options={this.getCustomRatingFields()}
                    allowCreate
                  />
                  <Select
                    id={`${usaget}-${priority}-${calcKey}-by-param-name-type`}
                    onChange={this.onChangeAdditionalParamRatingType.bind(this, calc.get('rate_key', ''), usaget, priority, calcKey)}
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
                    <Button onClick={onRemoveRating} data-usaget={usaget} data-index={calcKey} data-priority={priority} bsSize="small" className="pull-left" ><i className="fa fa-trash-o danger-red" />&nbsp;Remove</Button>
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

  getAddRatingButton = (usaget, priority) => (
    <Button
      bsSize="xsmall"
      className="btn-primary"
      data-usaget={usaget}
      data-priority={priority}
      onClick={this.props.onAddRating}
    >
      <i className="fa fa-plus" />&nbsp;Add
    </Button>
  );

  getAddRatingPriorityButton = usaget => (
    <Button
      bsSize="xsmall"
      className="btn-primary"
      onClick={this.onAddRatingPriority(usaget)}
    >
      <i className="fa fa-plus" />&nbsp;Add Next Rating
    </Button>
  );

  getRemoveRatingPriorityButton = (usaget, priority) => (
    <Button
      bsStyle="link"
      bsSize="xsmall"
      onClick={this.onRemoveRatingPriority(usaget, priority)}
    >
      <i className="fa fa-fw fa-trash-o danger-red" />
    </Button>
  );

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
    const basePath = [computedLineKey.get('usaget'), computedLineKey.get('priority'), computedLineKey.get('index'), 'computed'];
    const paths = [
      [...basePath, 'line_keys'],
      [...basePath, 'operator'],
      [...basePath, 'type'],
      [...basePath, 'must_met'],
      [...basePath, 'projection'],
    ];
    const values = [
      computedLineKey.get('line_keys', Immutable.List()),
      computedLineKey.get('operator', ''),
      computedLineKey.get('type', ''),
      computedLineKey.get('must_met', false),
      computedLineKey.get('projection', Immutable.Map()),
    ];
    this.props.onSetComputedLineKey(paths, values);
    this.setState({ computedLineKey: null });
  }

  onHideComputedLineKey = () => {
    this.setState({ computedLineKey: null });
  }

  onChangeComputedLineKey = path => (value) => {
    const { computedLineKey } = this.state;
    const newComputedLineKey = computedLineKey.withMutations((computedLineKeyWithMutations) => {
      computedLineKeyWithMutations.setIn(path, value);
      const key = path[1];
      if (value === 'hard_coded') {
        computedLineKeyWithMutations.deleteIn(['projection', key, 'value']);
      } else if (value === 'condition_result') {
        computedLineKeyWithMutations.deleteIn(['projection', key, 'value']);
        computedLineKeyWithMutations.deleteIn(['projection', key, 'regex']);
      }
    });
    this.setState({
      computedLineKey: newComputedLineKey,
    });
  }

  onChangeComputedMustMet = (e) => {
    const { value } = e.target;
    const { computedLineKey } = this.state;
    const newComputedLineKey = computedLineKey.withMutations((computedLineKeyWithMutations) => {
      computedLineKeyWithMutations.set('must_met', value);
      if (value) {
        computedLineKeyWithMutations.setIn(['projection', 'on_false'], Immutable.Map());
      }
    });
    this.setState({
      computedLineKey: newComputedLineKey,
    });
  }

  onChangeComputedLineKeyType = (e) => {
    const { value } = e.target;
    const { computedLineKey } = this.state;
    const newComputedLineKey = computedLineKey.withMutations((computedLineKeyWithMutations) => {
      computedLineKeyWithMutations.set('type', value);
      computedLineKeyWithMutations.deleteIn(['line_keys', 1]);
      computedLineKeyWithMutations.delete('operator');
      computedLineKeyWithMutations.delete('must_met');
      computedLineKeyWithMutations.delete('projection');
    });
    this.setState({
      computedLineKey: newComputedLineKey,
    });
  }

  onChangeHardCodedValue = path => (e) => {
    const { value } = e.target;
    this.onChangeComputedLineKey(path)(value);
  }

  getConditionResultProjectOptions = () => [
    'condition_result',
    'hard_coded',
  ].map(formatSelectOptions);

  renderComputedRatePopup = () => {
    const { computedLineKey } = this.state;
    if (!computedLineKey) {
      return null;
    }
    const title = 'Computed Rate Key';
    const regexHelper = 'In case you want to run a regular expression on the computed field before calculating the rate';
    const mustMetHelper = 'This means than in case the condition is not met - a rate will not be found';
    const lineKeyOptions = this.getAvailableFields(false, false).toJS();
    const computedTypeRegex = computedLineKey.get('type', 'regex') === 'regex';
    const checkboxStyle = { marginTop: 10 };
    const conditionOption = this.getConditionResultProjectOptions().concat(lineKeyOptions);
    return (
      <ModalWrapper title={title} show={true} onOk={this.onSaveComputedLineKey} onHide={this.onHideComputedLineKey} labelOk="OK">
        <Form horizontal>
          <FormGroup>
            <Col componentClass={ControlLabel} sm={3}>
              Computation Type
            </Col>
            <Col sm={3}>
              <div className="inline">
                <Field
                  fieldType="radio"
                  name="computed-type"
                  id="computed-type-regex"
                  value="regex"
                  checked={computedTypeRegex}
                  onChange={this.onChangeComputedLineKeyType}
                  label="Regex"
                />
              </div>
            </Col>
            <Col sm={3}>
              <div className="inline">
                <Field
                  fieldType="radio"
                  name="computed-type"
                  id="computed-type-condition"
                  value="condition"
                  checked={!computedTypeRegex}
                  onChange={this.onChangeComputedLineKeyType}
                  label="Condition"
                />
              </div>
            </Col>
          </FormGroup>
          <div className="separator" />
          <FormGroup key="computed-field-1">
            <Col sm={3} componentClass={ControlLabel}>{computedTypeRegex ? 'Field' : 'First Field' }</Col>
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
          { !computedTypeRegex &&
            [(<FormGroup key="computed-operator">
              <Col sm={3} componentClass={ControlLabel}>Operator</Col>
              <Col sm={4}>
                <Select
                  onChange={this.onChangeComputedLineKey(['operator'])}
                  value={computedLineKey.get('operator', '')}
                  options={this.getRateConditions()}
                />
              </Col>
            </FormGroup>),
            (<FormGroup key="computed-field-2">
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
            </FormGroup>),
            (<FormGroup key="computed-must-met">
              <Col componentClass={ControlLabel} sm={3}>
                Must met?
                <Help contents={mustMetHelper} />
              </Col>
              <Col sm={3} style={checkboxStyle}>
                <div className="inline">
                  <Field
                    fieldType="checkbox"
                    id="computed-must-met"
                    value={computedLineKey.get('must_met', false)}
                    onChange={this.onChangeComputedMustMet}
                  />
                </div>
              </Col>
            </FormGroup>),
            (<FormGroup key="computed-cond-project-true">
              <Col sm={3} componentClass={ControlLabel}>Value when True</Col>
              <Col sm={4}>
                <Select
                  onChange={this.onChangeComputedLineKey(['projection', 'on_true', 'key'])}
                  value={computedLineKey.getIn(['projection', 'on_true', 'key'], 'condition_result')}
                  options={conditionOption}
                />
              </Col>
              {
                ['hard_coded'].includes(computedLineKey.getIn(['projection', 'on_true', 'key'], '')) &&
                (<Col sm={4}>
                  <Field
                    value={computedLineKey.getIn(['projection', 'on_true', 'value'], '')}
                    onChange={this.onChangeHardCodedValue(['projection', 'on_true', 'value'])}
                  />
                </Col>)
              }
              {
              !['', 'hard_coded', 'condition_result'].includes(computedLineKey.getIn(['projection', 'on_true', 'key'], '')) &&
              (<Col sm={4}>
                <Field
                  value={computedLineKey.getIn(['projection', 'on_true', 'regex'], '')}
                  disabledValue={''}
                  onChange={this.onChangeComputedLineKey(['projection', 'on_true', 'regex'])}
                  disabled={computedLineKey.getIn(['projection', 'on_true', 'key'], '') === ''}
                  label="Regex"
                  fieldType="toggeledInput"
                />
              </Col>)
              }
            </FormGroup>),
            (<FormGroup key="computed-cond-project-false">
              <Col sm={3} componentClass={ControlLabel}>Value when False</Col>
              <Col sm={4}>
                <Select
                  onChange={this.onChangeComputedLineKey(['projection', 'on_false', 'key'])}
                  value={computedLineKey.getIn(['projection', 'on_false', 'key'], 'condition_result')}
                  options={conditionOption}
                  disabled={computedLineKey.get('must_met', false)}
                />
              </Col>
              {
                ['hard_coded'].includes(computedLineKey.getIn(['projection', 'on_false', 'key'], '')) &&
                (<Col sm={4}>
                  <Field
                    value={computedLineKey.getIn(['projection', 'on_false', 'value'], '')}
                    onChange={this.onChangeHardCodedValue(['projection', 'on_false', 'value'])}
                  />
                </Col>)
              }
              {
              !['', 'hard_coded', 'condition_result'].includes(computedLineKey.getIn(['projection', 'on_false', 'key'], '')) &&
              (<Col sm={4}>
                <Field
                  value={computedLineKey.getIn(['projection', 'on_false', 'regex'], '')}
                  disabledValue={''}
                  onChange={this.onChangeComputedLineKey(['projection', 'on_false', 'regex'])}
                  disabled={computedLineKey.getIn(['projection', 'on_false', 'key'], '') === ''}
                  label="Regex"
                  fieldType="toggeledInput"
                />
              </Col>)
              }
            </FormGroup>)]
        }
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
                  { this.getRateCalculators(usaget) }
                  { this.getAddRatingPriorityButton(usaget) }
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
