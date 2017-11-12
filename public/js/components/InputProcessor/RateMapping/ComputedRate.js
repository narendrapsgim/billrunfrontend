import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import { Form, FormGroup, Col, ControlLabel } from 'react-bootstrap';
import Select from 'react-select';
import Help from '../../Help';
import Field from '../../Field';
import { getConfig, formatSelectOptions, getAvailableFields } from '../../../common/Util';

export default class ComputedRate extends Component {
  static propTypes = {
    computedLineKey: PropTypes.instanceOf(Immutable.Map),
    settings: PropTypes.instanceOf(Immutable.Map),
    onChangeComputedLineKeyType: PropTypes.func,
    onChangeComputedLineKey: PropTypes.func,
    onChangeComputedMustMet: PropTypes.func,
    onChangeHardCodedValue: PropTypes.func,
  }
  static defaultProps = {
    computedLineKey: Immutable.Map(),
    settings: Immutable.Map(),
    onChangeComputedLineKeyType: () => {},
    onChangeComputedLineKey: () => {},
    onChangeComputedMustMet: () => {},
    onChangeHardCodedValue: () => {},
  };

  getConditionResultProjectOptions = () => [
    'condition_result',
    'hard_coded',
  ].map(formatSelectOptions);

  getRateConditions = () => (getConfig(['rates', 'conditions'], Immutable.Map()).map(condType => (
    { value: condType.get('key', ''), label: condType.get('title', '') })).toArray()
  );

  render() {
    const { computedLineKey, settings } = this.props;
    if (!computedLineKey) {
      return null;
    }
    const regexHelper = 'In case you want to run a regular expression on the computed field before calculating the rate';
    const mustMetHelper = 'This means than in case the condition is not met - a rate will not be found';
    const lineKeyOptions = getAvailableFields(settings, [{ value: 'type', label: 'Type' }, { value: 'usaget', label: 'Usage Type' }, { value: 'file', label: 'File name' }]).toJS();
    const computedTypeRegex = computedLineKey.get('type', 'regex') === 'regex';
    const checkboxStyle = { marginTop: 10 };
    const conditionOption = this.getConditionResultProjectOptions().concat(lineKeyOptions);
    return (
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
                onChange={this.props.onChangeComputedLineKeyType}
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
                onChange={this.props.onChangeComputedLineKeyType}
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
              onChange={this.props.onChangeComputedLineKey(['line_keys', 0, 'key'])}
              value={computedLineKey.getIn(['line_keys', 0, 'key'], '')}
              options={lineKeyOptions}
            />
          </Col>
          <Col sm={4}>
            <Field
              value={computedLineKey.getIn(['line_keys', 0, 'regex'], '')}
              disabledValue={''}
              onChange={this.props.onChangeComputedLineKey(['line_keys', 0, 'regex'])}
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
                onChange={this.props.onChangeComputedLineKey(['operator'])}
                value={computedLineKey.get('operator', '')}
                options={this.getRateConditions()}
              />
            </Col>
          </FormGroup>),
          (<FormGroup key="computed-field-2">
            <Col sm={3} componentClass={ControlLabel}>Second Field</Col>
            <Col sm={4}>
              <Select
                onChange={this.props.onChangeComputedLineKey(['line_keys', 1, 'key'])}
                value={computedLineKey.getIn(['line_keys', 1, 'key'], '')}
                options={lineKeyOptions}
              />
            </Col>
            <Col sm={4}>
              <Field
                value={computedLineKey.getIn(['line_keys', 1, 'regex'], '')}
                disabledValue={''}
                onChange={this.props.onChangeComputedLineKey(['line_keys', 1, 'regex'])}
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
                  onChange={this.props.onChangeComputedMustMet}
                />
              </div>
            </Col>
          </FormGroup>),
          (<FormGroup key="computed-cond-project-true">
            <Col sm={3} componentClass={ControlLabel}>Value when True</Col>
            <Col sm={4}>
              <Select
                onChange={this.props.onChangeComputedLineKey(['projection', 'on_true', 'key'])}
                value={computedLineKey.getIn(['projection', 'on_true', 'key'], 'condition_result')}
                options={conditionOption}
              />
            </Col>
            {
              ['hard_coded'].includes(computedLineKey.getIn(['projection', 'on_true', 'key'], '')) &&
              (<Col sm={4}>
                <Field
                  value={computedLineKey.getIn(['projection', 'on_true', 'value'], '')}
                  onChange={this.props.onChangeHardCodedValue(['projection', 'on_true', 'value'])}
                />
              </Col>)
            }
            {
            !['', 'hard_coded', 'condition_result'].includes(computedLineKey.getIn(['projection', 'on_true', 'key'], '')) &&
            (<Col sm={4}>
              <Field
                value={computedLineKey.getIn(['projection', 'on_true', 'regex'], '')}
                disabledValue={''}
                onChange={this.props.onChangeComputedLineKey(['projection', 'on_true', 'regex'])}
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
                onChange={this.props.onChangeComputedLineKey(['projection', 'on_false', 'key'])}
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
                  onChange={this.props.onChangeHardCodedValue(['projection', 'on_false', 'value'])}
                />
              </Col>)
            }
            {
            !['', 'hard_coded', 'condition_result'].includes(computedLineKey.getIn(['projection', 'on_false', 'key'], '')) &&
            (<Col sm={4}>
              <Field
                value={computedLineKey.getIn(['projection', 'on_false', 'regex'], '')}
                disabledValue={''}
                onChange={this.props.onChangeComputedLineKey(['projection', 'on_false', 'regex'])}
                disabled={computedLineKey.getIn(['projection', 'on_false', 'key'], '') === ''}
                label="Regex"
                fieldType="toggeledInput"
              />
            </Col>)
            }
          </FormGroup>)]
      }
      </Form>
    );
  }
}
