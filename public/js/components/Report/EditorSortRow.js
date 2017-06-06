import React, { PropTypes, Component } from 'react';
import Immutable from 'immutable';
import Select from 'react-select';
import { Button, FormGroup, Col } from 'react-bootstrap';
import {
  formatSelectOptions,
} from '../../common/Util';

class EditorSortRow extends Component {

  static propTypes = {
    item: PropTypes.instanceOf(Immutable.Map),
    index: PropTypes.number,
    disabled: PropTypes.bool,
    display: PropTypes.instanceOf(Immutable.List),
    usedFields: PropTypes.instanceOf(Immutable.List),
    onChangeField: PropTypes.func,
    onChangeOperator: PropTypes.func,
    onRemove: PropTypes.func,
  }

  static defaultProps = {
    item: Immutable.Map(),
    index: 0,
    disabled: false,
    display: Immutable.List(),
    usedFields: Immutable.List(),
    onChangeField: () => {},
    onChangeOperator: () => {},
    onRemove: () => {},
  }

  shouldComponentUpdate(nextProps) {
    const { item, index, disabled, display, usedFields } = this.props;
    return (
      !Immutable.is(item, nextProps.item)
      || !Immutable.is(display, nextProps.display)
      || !Immutable.is(usedFields, nextProps.usedFields)
      || index !== nextProps.index
      || disabled !== nextProps.disabled
    );
  }


  onRemove = (e) => {
    const { index } = this.props;
    this.props.onRemove(index, e);
  }

  onChangeField = (e) => {
    const { index } = this.props;
    this.props.onChangeField(index, e);
  }

  onChangeOperator = (e) => {
    const { index } = this.props;
    this.props.onChangeOperator(index, e);
  }

  getFieldOptions = () => {
    const { item, display, usedFields } = this.props;
    return display
      .filter(fieldOption => !usedFields.includes(fieldOption) || item.get('field', '') === fieldOption)
      .map(formatSelectOptions)
      .toArray();
  }

  getOpOptions = () => [{
    value: 1,
    label: 'Ascending',
  }, {
    value: -1,
    label: 'Descending',
  }];

  render() {
    const { item, disabled, index } = this.props;
    console.log('render select:', index);

    const fieldOptions = this.getFieldOptions();
    const opOptions = this.getOpOptions();
    return (
      <FormGroup className="form-inner-edit-row">
        <Col sm={5}>
          <Select
            options={fieldOptions}
            value={item.get('field', '')}
            onChange={this.onChangeField}
            disabled={disabled}
          />
        </Col>
        <Col sm={3}>
          <Select
            clearable={false}
            options={opOptions}
            value={item.get('op', '')}
            onChange={this.onChangeOperator}
            disabled={disabled}
          />
        </Col>
        <Col sm={2} className="actions">
          <Button onClick={this.onRemove} bsSize="small" className="pull-left" disabled={disabled} block>
            <i className="fa fa-trash-o danger-red" />&nbsp;Remove
          </Button>
        </Col>
      </FormGroup>
    );
  }

}

export default EditorSortRow;
