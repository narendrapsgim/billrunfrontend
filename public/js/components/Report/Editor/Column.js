import React, { PropTypes, Component } from 'react';
import Immutable from 'immutable';
import Select from 'react-select';
import { Button, FormGroup, Col } from 'react-bootstrap';
import { SortableElement } from 'react-sortable-hoc';
import { DragHandle } from '../../Elements';
import Field from '../../Field';
import { parseConfigSelectOptions } from '../../../common/Util';
import { reportTypes } from '../../../actions/reportsActions';

class Column extends Component {

  static propTypes = {
    item: PropTypes.instanceOf(Immutable.Map),
    idx: PropTypes.number,
    disabled: PropTypes.bool,
    type: PropTypes.number,
    fieldsConfig: PropTypes.instanceOf(Immutable.List),
    operators: PropTypes.instanceOf(Immutable.List),
    onChangeField: PropTypes.func,
    onChangeOperator: PropTypes.func,
    onChangeLabel: PropTypes.func,
    onRemove: PropTypes.func,
  }

  static defaultProps = {
    item: Immutable.Map(),
    idx: 0,
    disabled: false,
    type: reportTypes.SIMPLE,
    fieldsConfig: Immutable.List(),
    operators: Immutable.List(),
    onChangeField: () => {},
    onChangeOperator: () => {},
    onChangeLabel: () => {},
    onRemove: () => {},
  }

  shouldComponentUpdate(nextProps) {
    const { item, idx, disabled, fieldsConfig, operators, type } = this.props;
    return (
      !Immutable.is(item, nextProps.item)
      || !Immutable.is(fieldsConfig, nextProps.fieldsConfig)
      || !Immutable.is(operators, nextProps.operators)
      || idx !== nextProps.idx
      || disabled !== nextProps.disabled
      || type !== nextProps.type
    );
  }

  onChangeLabel = (e) => {
    const { value } = e.target;
    const { idx } = this.props;
    this.props.onChangeLabel(idx, value);
  }

  onChangeField = (value) => {
    const { idx } = this.props;
    this.props.onChangeField(idx, value);
  }

  onChangeOperator = (value) => {
    const { idx } = this.props;
    this.props.onChangeOperator(idx, value);
  }

  onRemove = () => {
    const { idx } = this.props;
    this.props.onRemove(idx);
  }

  getoperators = () => {
    const { operators } = this.props;
    return operators
      .map(parseConfigSelectOptions)
      .toArray();
  }

  getfieldsConfig = () => {
    const { fieldsConfig } = this.props;
    return fieldsConfig
      .map(parseConfigSelectOptions)
      .toArray();
  }

  render() {
    const { item, disabled, type } = this.props;
    const fieldOptions = this.getfieldsConfig();
    const opOptions = this.getoperators();
    const disableOp = disabled || item.get('field_name', '') === '';
    const disableLabel = disabled || item.get('field_name', '') === '';

    return (
      <FormGroup className="form-inner-edit-row">
        <Col sm={1} className="text-center">
          <DragHandle />
        </Col>
        <Col sm={4}>
          <Select
            clearable={false}
            options={fieldOptions}
            value={item.get('field_name', '')}
            onChange={this.onChangeField}
            disabled={disabled}
          />
        </Col>

        <Col sm={2}>
          {type !== reportTypes.SIMPLE && (
            <Select
              clearable={false}
              options={opOptions}
              value={item.get('op', '')}
              onChange={this.onChangeOperator}
              disabled={disableOp}
            />
          )}
        </Col>

        <Col sm={3}>
          <Field
            value={item.get('label', '')}
            onChange={this.onChangeLabel}
            disabled={disableLabel}
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

export default SortableElement(Column);
