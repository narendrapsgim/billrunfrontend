import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { FormGroup, Col, Row, Panel, Button } from 'react-bootstrap';
import Select from 'react-select';
import changeCase from 'change-case';
import ComputedRate from './ComputedRate';
import Help from '../../Help';
import { getConfig, getAvailableFields } from '../../../common/Util';
import { updateSetting, saveSettings } from '../../../actions/settingsActions';
import { showWarning } from '../../../actions/alertsActions';
import { ModalWrapper } from '../../Elements';
import RateMappingConfig from '../../../config/rateMapping';
import {
  setRatingField,
  setLineKey,
  setComputedLineKey,
  unsetComputedLineKey,
  addRatingField,
  addRatingPriorityField,
  removeRatingPriorityField,
  removeRatingField,
} from '../../../actions/inputProcessorActions';

class RateMapping extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    usaget: PropTypes.string.isRequired,
    rateCategory: PropTypes.string.isRequired,
    settings: PropTypes.instanceOf(Immutable.Map),
    customRatingFields: PropTypes.instanceOf(Immutable.List),
    rateCalculators: PropTypes.instanceOf(Immutable.List),
  }
  static defaultProps = {
    settings: Immutable.Map(),
    customRatingFields: Immutable.List(),
    rateCalculators: Immutable.List(),
  };

  state = {
    computedLineKey: null,
    openRateCalculators: [0],
  };

  componentDidMount = () => {
    const { settings, rateCategory } = this.props;
    const availableUsagetypes = settings.getIn(['rate_calculators', rateCategory], Immutable.Map()).keySeq().map(usaget => (usaget));
    availableUsagetypes.forEach((usaget) => {
      const calcs = settings.getIn(['rate_calculators', rateCategory, usaget], Immutable.List());
      if (calcs.size === 0) {
        this.onAddRating({ target: { dataset: { ratecategory: rateCategory, usaget } } });
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
    { value: 'equalFalse', label: 'Does Not Equal' },
    { value: 'longestPrefix', label: 'Longest Prefix' },
  ]);

  onChangeAdditionalParamRating = (rateCategory, usaget, priority, index, type) => (value) => {
    const eModified = {
      target: {
        dataset: {
          rate_key: value,
          ratecategory: rateCategory,
          usaget,
          priority,
          index,
        },
        value: type,
        custom: true,
      },
    };
    this.onSetRating(eModified);
  }

  onChangeAdditionalParamRatingType = (value, rateCategory, usaget, priority, index) => (type) => {
    this.onChangeAdditionalParamRating(rateCategory, usaget, priority, index, type)(value);
  }

  getRateCalculatorFields = () =>
    getAvailableFields(this.props.settings, RateMappingConfig.additionalFields.concat([{ value: 'computed', label: 'Computed' }]))
    .map((field, key) => (
      <option value={field.get('value', '')} key={key}>{field.get('label', '')}</option>
    ));

  addNewRatingCustomField = (fieldName, title, type) => {
    const { customRatingFields } = this.props;
    this.props.dispatch(updateSetting('rates', ['fields'], customRatingFields.push(Immutable.Map({
      field_name: fieldName,
      title,
      multiple: type === 'longestPrefix',
      display: true,
      editable: true,
    }))));
    return this.props.dispatch(saveSettings('rates'));
  };

  onSetRating = (e) => {
    const { customRatingFields } = this.props;
    const { dataset: { ratecategory, usaget, priority, index }, value, custom } = e.target;
    let { dataset: { rate_key: rateKey } } = e.target;
    let newRateKey = changeCase.snakeCase(rateKey);
    newRateKey = newRateKey.replace('params.', '');
    newRateKey = newRateKey.replace('params_', '');
    newRateKey = `params.${newRateKey}`;
    const isNewField = custom && (rateKey !== '') && !(customRatingFields.find(field => field.get('field_name', '') === newRateKey));
    if (isNewField) {
      this.addNewRatingCustomField(newRateKey, rateKey, value);
      rateKey = newRateKey;
    } else {
      const rateExists = customRatingFields.find(field => field.get('field_name', '') === newRateKey);
      if (rateExists) {
        if (custom && rateKey !== '' && rateKey !== rateExists.title && rateKey !== newRateKey) {
          this.props.dispatch(showWarning(`Product param ${rateKey} already exists as custom field ${newRateKey}`));
          rateKey = rateExists.title;
        }
      }
    }
    this.props.dispatch(setRatingField(ratecategory, usaget, priority, parseInt(index), rateKey, value));
  }

  onAddRating = (e) => {
    const { dataset: { ratecategory, usaget, priority } } = e.target;
    this.props.dispatch(addRatingField(ratecategory, usaget, priority));
  }

  onRemoveRating = (e) => {
    const { dataset: { ratecategory, usaget, priority, index } } = e.target;
    this.props.dispatch(removeRatingField(ratecategory, usaget, priority, index));
  }

  onRemoveRatingPriority = (rateCategory, usaget, priority) => () => {
    this.props.dispatch(removeRatingPriorityField(rateCategory, usaget, priority));
  }

  onSetLineKey = (e) => {
    const { dataset: { ratecategory, usaget, index, priority }, value } = e.target;
    this.props.dispatch(setLineKey(ratecategory, usaget, priority, index, value));
  }

  onSetComputedLineKey = (paths, values) => {
    this.props.dispatch(setComputedLineKey(paths, values));
  }

  onUnsetComputedLineKey = (rateCategory, usaget, priority, index) => {
    this.props.dispatch(unsetComputedLineKey(rateCategory, usaget, priority, index));
  }

  getComputedLineKeyObject = (rateCategory, usaget, priority, index, calc = Immutable.Map()) => (
    Immutable.Map({
      rateCategory,
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
    })
  );

  onChangeLineKey = (e) => {
    const { dataset: { ratecategory, usaget, index, priority }, value } = e.target;
    if (value === 'computed') {
      this.setState({
        computedLineKey: this.getComputedLineKeyObject(ratecategory, usaget, priority, index),
      });
    } else {
      this.setState({ computedLineKey: null });
      this.onUnsetComputedLineKey(ratecategory, usaget, priority, index);
    }
    this.onSetLineKey(e);
  }

  onEditComputedLineKey = (calc, rateCategory, usaget, priority, index) => () => {
    this.setState({
      computedLineKey: this.getComputedLineKeyObject(rateCategory, usaget, priority, index, calc),
    });
  }

  onSaveComputedLineKey = () => {
    const { computedLineKey } = this.state;
    const basePath = [computedLineKey.get('rateCategory'), computedLineKey.get('usaget'), computedLineKey.get('priority'), computedLineKey.get('index'), 'computed'];
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
    this.onSetComputedLineKey(paths, values);
    this.setState({ computedLineKey: null });
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

  onChangeHardCodedValue = path => (e) => {
    const { value } = e.target;
    this.onChangeComputedLineKey(path)(value);
  }

  onChangeComputedLineKey = path => (value) => {
    const { computedLineKey } = this.state;
    const newComputedLineKey = computedLineKey.withMutations((computedLineKeyWithMutations) => {
      computedLineKeyWithMutations.setIn(path, value);
      const key = path[1];
      if (path[0] === 'operator') {
        const changeFromRegex = computedLineKey.get('operator', '') === '$regex' && value !== '$regex';
        const changeToRegex = computedLineKey.get('operator', '') !== '$regex' && value === '$regex';
        const operatorExists = value === '$exists' || value === '$existsFalse';
        if (changeFromRegex || changeToRegex || operatorExists) {
          computedLineKeyWithMutations.deleteIn(['line_keys', 1]);
          computedLineKeyWithMutations.deleteIn(['line_keys', 0, 'regex']);
        }
      }
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

  onChangeComputedLineKeyType = (e) => {
    const { value } = e.target;
    const { computedLineKey } = this.state;
    const newComputedLineKey = computedLineKey.withMutations((computedLineKeyWithMutations) => {
      computedLineKeyWithMutations.set('type', value);
      if (value === 'regex') {
        computedLineKeyWithMutations.deleteIn(['line_keys', 1]);
        computedLineKeyWithMutations.delete('operator');
        computedLineKeyWithMutations.delete('must_met');
        computedLineKeyWithMutations.delete('projection');
      }
    });
    this.setState({
      computedLineKey: newComputedLineKey,
    });
  }

  onHideComputedLineKey = () => {
    this.setState({ computedLineKey: null });
  }

  renderComputedLineKeyDesc = (calc, rateCategory, usaget, priority, index) => {
    if (calc.get('line_key', '') !== 'computed') {
      return null;
    }
    const op = calc.getIn(['computed', 'operator'], '');
    const opLabel = (getConfig(['rates', 'conditions'], Immutable.Map()).find(cond => cond.get('key', '') === op) || Immutable.Map()).get('title', '');
    return (
      <h4>
        <small>
          {`${calc.getIn(['computed', 'line_keys', 0, 'key'], '')} ${opLabel} ${calc.getIn(['computed', 'line_keys', 1, 'key'], '')}`}
          <Button onClick={this.onEditComputedLineKey(calc, rateCategory, usaget, priority, index)} bsStyle="link">
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

  onAddRatingPriority = (rateCategory, usaget) => () => {
    const { rateCalculators } = this.props;
    this.openRateCalculator(rateCalculators.size)();
    this.props.dispatch(addRatingPriorityField(rateCategory, usaget));
  }

  getRateCalculatorsForPriority = (rateCategory, usaget, priority, calcs) => {
    const availableFields = this.getRateCalculatorFields();
    return calcs.map((calc, calcKey) => {
      let selectedRadio = 3;
      if (calc.get('rate_key', '') === 'key') {
        selectedRadio = 1;
      } else if (calc.get('rate_key', '') === 'usaget') {
        selectedRadio = 2;
      }
      return (
        <div key={`rate-calc-${rateCategory}-${priority}-${calcKey}`}>
          <Row key={`rate-calc-row-${rateCategory}-${priority}-${calcKey}`}>
            <Col lg={3} md={3} style={{ paddingRight: 0 }}>
              <FormGroup style={{ margin: 0 }}>
                <select
                  className="form-control"
                  id={usaget}
                  onChange={this.onChangeLineKey}
                  data-rateCategory={rateCategory}
                  data-usaget={usaget}
                  data-index={calcKey}
                  data-priority={priority}
                  value={calc.get('line_key', '')}
                >
                  { availableFields }
                </select>
                { this.renderComputedLineKeyDesc(calc, rateCategory, usaget, priority, calcKey) }
              </FormGroup>
            </Col>

            <Col lg={6} md={6} style={{ paddingRight: 0 }}>
              <FormGroup style={{ margin: 0, paddingLeft: 13 }}>
                <input
                  type="radio"
                  name={`${rateCategory}-${usaget}-${priority}-${calcKey}-type`}
                  id={`${rateCategory}-${usaget}-${priority}-${calcKey}-by-rate-key`}
                  value="match"
                  data-rateCategory={rateCategory}
                  data-usaget={usaget}
                  data-rate_key="key"
                  data-index={calcKey}
                  data-priority={priority}
                  checked={selectedRadio === 1}
                  onChange={this.onSetRating}
                />&nbsp;
                <label htmlFor={`${rateCategory}-${usaget}-${priority}-${calcKey}-by-rate-key`} style={{ verticalAlign: 'middle' }}>By product key</label>
              </FormGroup>

              <FormGroup style={{ margin: 0, paddingLeft: 13 }}>
                <input
                  type="radio"
                  name={`${rateCategory}-${usaget}-${priority}-${calcKey}-type`}
                  id={`${rateCategory}-${usaget}-${priority}-${calcKey}-by-rate-usaget`}
                  value="match"
                  data-rateCategory={rateCategory}
                  data-usaget={usaget}
                  data-rate_key="usaget"
                  data-index={calcKey}
                  data-priority={priority}
                  checked={selectedRadio === 2}
                  onChange={this.onSetRating}
                />&nbsp;
                <label htmlFor={`${rateCategory}-${usaget}-${priority}-${calcKey}-by-rate-usaget`} style={{ verticalAlign: 'middle' }}>By product unit type</label>
              </FormGroup>

              <FormGroup style={{ margin: 0 }}>
                <div className="input-group">
                  <div className="input-group-addon">
                    <input
                      type="radio"
                      name={`${rateCategory}-${usaget}-${priority}-${calcKey}-type`}
                      id={`${rateCategory}-${usaget}-${priority}-${calcKey}-by-param`}
                      value="match"
                      data-rateCategory={rateCategory}
                      data-usaget={usaget}
                      checked={selectedRadio === 3}
                      data-rate_key=""
                      data-index={calcKey}
                      data-priority={priority}
                      onChange={this.onSetRating}
                    />&nbsp;
                    <label htmlFor={`${rateCategory}-${usaget}-${priority}-${calcKey}-by-param`} style={{ verticalAlign: 'middle' }}>By product param</label>
                    <Help contents="This field needs to be configured in the 'Additional Parameters' of a Product" />
                  </div>
                  <Select
                    id={`${rateCategory}-${usaget}-${priority}-${calcKey}-by-param-name`}
                    onChange={this.onChangeAdditionalParamRating(rateCategory, usaget, priority, calcKey, calc.get('type', ''))}
                    value={selectedRadio !== 3 ? '' : calc.get('rate_key', '')}
                    disabled={selectedRadio !== 3}
                    options={this.getCustomRatingFields()}
                    allowCreate
                  />
                  <Select
                    id={`${rateCategory}-${usaget}-${priority}-${calcKey}-by-param-name-type`}
                    onChange={this.onChangeAdditionalParamRatingType(calc.get('rate_key', ''), rateCategory, usaget, priority, calcKey)}
                    disabled={selectedRadio !== 3}
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
                    <Button onClick={this.onRemoveRating} data-rateCategory={rateCategory} data-usaget={usaget} data-index={calcKey} data-priority={priority} bsSize="small" className="pull-left" ><i className="fa fa-trash-o danger-red" />&nbsp;Remove</Button>
                  </div>
                </FormGroup>
              }
            </Col>
          </Row>
          <hr />
        </div>
      );
    }).toArray();
  }

  getAddRatingButton = (rateCategory, usaget, priority) => (
    <Button
      bsSize="xsmall"
      className="btn-primary"
      data-rateCategory={rateCategory}
      data-usaget={usaget}
      data-priority={priority}
      onClick={this.onAddRating}
    >
      <i className="fa fa-plus" />&nbsp;Add
    </Button>
  );

  getAddRatingPriorityButton = (rateCategory, usaget) => (
    <Button
      bsSize="xsmall"
      className="btn-primary"
      onClick={this.onAddRatingPriority(rateCategory, usaget)}
    >
      <i className="fa fa-plus" />&nbsp;Add Next Priority
    </Button>
  );

  getRemoveRatingPriorityButton = (rateCategory, usaget, priority) => (
    <Button
      bsStyle="link"
      bsSize="xsmall"
      onClick={this.onRemoveRatingPriority(rateCategory, usaget, priority)}
    >
      <i className="fa fa-fw fa-trash-o danger-red" />
    </Button>
  );

  renderComputedRatePopup = () => {
    const { settings } = this.props;
    const { computedLineKey } = this.state;
    if (!computedLineKey) {
      return null;
    }
    const title = 'Computed Rate Key';
    return (
      <ModalWrapper title={title} show={true} onOk={this.onSaveComputedLineKey} onHide={this.onHideComputedLineKey} labelOk="OK">
        <ComputedRate
          computedLineKey={computedLineKey}
          settings={settings}
          onChangeComputedLineKeyType={this.onChangeComputedLineKeyType}
          onChangeComputedLineKey={this.onChangeComputedLineKey}
          onChangeComputedMustMet={this.onChangeComputedMustMet}
          onChangeHardCodedValue={this.onChangeHardCodedValue}
        />
      </ModalWrapper>
    );
  }

  render() {
    const { rateCategory, usaget, rateCalculators } = this.props;
    const { openRateCalculators } = this.state;
    const noRemoveStyle = { paddingLeft: 45 };
    return (
      <div>
        { this.renderComputedRatePopup() }
        { rateCalculators.map((calcs, priority) => {
          const showRemove = priority > 0;
          const actionsStyle = showRemove ? {} : noRemoveStyle;
          return (
            <div key={`rate-calculator-${usaget}-${priority}`}>
              <Row>
                <Col sm={10}>{`Priority ${priority + 1}`}</Col>
                <Col sm={2} style={actionsStyle}>
                  {
                    showRemove && this.getRemoveRatingPriorityButton(rateCategory, usaget, priority)
                  }
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
                { this.getRateCalculatorsForPriority(rateCategory, usaget, priority, calcs) }
                { this.getAddRatingButton(rateCategory, usaget, priority) }
              </Panel>
            </div>
          );
        }) }
        { this.getAddRatingPriorityButton(rateCategory, usaget) }
      </div>);
  }
}

const mapStateToProps = (state, props) => ({
  rateCalculators: props.settings.getIn(['rate_calculators', props.rateCategory, props.usaget]),
});

export default connect(mapStateToProps)(RateMapping);
