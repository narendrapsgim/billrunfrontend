import React, { PropTypes, Component } from 'react';
import Immutable from 'immutable';
import Select from 'react-select';
import { Button, FormGroup, Col } from 'react-bootstrap';
import { parseConfigSelectOptions } from '../../../common/Util';
import ConditionValue from './ConditionValue';


class Condition extends Component {

  static propTypes = {
    item: PropTypes.instanceOf(Immutable.Map),
    index: PropTypes.number,
    disabled: PropTypes.bool,
    operators: PropTypes.instanceOf(Immutable.List),
    fieldsConfig: PropTypes.instanceOf(Immutable.List),
    onChangeField: PropTypes.func,
    onChangeOperator: PropTypes.func,
    onChangeValue: PropTypes.func,
    onRemove: PropTypes.func,
  }

  static defaultProps = {
    item: Immutable.Map(),
    index: 0,
    disabled: false,
    fieldsConfig: Immutable.List(),
    operators: Immutable.List(),
    onChangeField: () => {},
    onChangeOperator: () => {},
    onChangeValue: () => {},
    onRemove: () => {},
  }

  shouldComponentUpdate(nextProps) {
    const { item, index, disabled, fieldsConfig, operators } = this.props;
    return (
      !Immutable.is(item, nextProps.item)
      || !Immutable.is(fieldsConfig, nextProps.fieldsConfig)
      || !Immutable.is(operators, nextProps.operators)
      || index !== nextProps.index
      || disabled !== nextProps.disabled
    );
  }

  componentDidUpdate(prevProps, prevState) { // eslint-disable-line no-unused-vars
    const { item, index } = this.props;
    const fieldOps = this.getOpOptions() || [];
    // If only one option avalibale, auto set it.
    if (fieldOps.length === 1 && item.get('op', '') === '') {
      this.props.onChangeOperator(index, fieldOps[0].value);
    }
  }

  onChangeField = (e) => {
    const { index } = this.props;
    this.props.onChangeField(index, e);
  };

  onChangeOperator = (e) => {
    const { index } = this.props;
    this.props.onChangeOperator(index, e);
  };

  onChangeValue = (e) => {
    const { index } = this.props;
    this.props.onChangeValue(index, e);
  };

  onRemove = (e) => {
    const { index } = this.props;
    this.props.onRemove(index, e);
  };

  getConfig = () => {
    const { item, fieldsConfig } = this.props;
    return fieldsConfig.find(conf => conf.get('id', '') === item.get('field', ''), null, Immutable.Map());
  }

  getOperator = () => {
    const { item, operators } = this.props;
    return operators.find(
      operator => operator.get('id', '') === item.get('op', ''),
      null, Immutable.Map(),
    );
  }

  getFieldOptions = () => {
    const { fieldsConfig } = this.props;
    return fieldsConfig
      .filter(filed => filed.get('filter', true))
      .map(parseConfigSelectOptions)
      .toArray();
  }

  getOpOptions = () => {
    const { operators } = this.props;
    const config = this.getConfig();
    return operators
      .filter((option) => {
        const optionFieldTypes = option.get('types', Immutable.List());
        const optionFieldExclude = option.get('exclude', Immutable.List());
        const fieldName = `fieldid:${config.get('id', '')}`;
        const fieldType = config.get('type', 'string');
        return (
          !optionFieldExclude.includes(fieldName)
          && (optionFieldTypes.includes(fieldType) || optionFieldTypes.includes(fieldName))
        );
      })
      .map(parseConfigSelectOptions)
      .toArray();
  }

  render() {
    const { item, disabled } = this.props;
    const config = this.getConfig();
    const operator = this.getOperator();
    const fieldOptions = this.getFieldOptions();
    const opOptions = this.getOpOptions();
    const disableOp = disabled || item.get('field', '') === '';
    const disableVal = disabled || item.get('op', '') === '' || disableOp;
    return (
      <FormGroup className="form-inner-edit-row">
        <Col sm={4}>
          <Select
            clearable={false}
            options={fieldOptions}
            value={item.get('field', '')}
            onChange={this.onChangeField}
            disabled={disabled}
          />
        </Col>

        <Col sm={2}>
          <Select
            clearable={false}
            options={opOptions}
            value={item.get('op', '')}
            onChange={this.onChangeOperator}
            disabled={disableOp}
          />
        </Col>

        <Col sm={4}>
          <ConditionValue
            filed={item}
            config={config}
            operator={operator}
            disabled={disableVal}
            onChange={this.onChangeValue}
          />
        </Col>

        <Col sm={2} className="actions">
          <Button onClick={this.onRemove} bsSize="small" className="pull-left" disabled={disabled}>
            <i className="fa fa-trash-o danger-red" />&nbsp;Remove
          </Button>
        </Col>
      </FormGroup>
    );
  }

}

export default Condition;
