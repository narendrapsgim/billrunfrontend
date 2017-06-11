import React, { PropTypes, Component } from 'react';
import Immutable from 'immutable';
import { Col, FormGroup } from 'react-bootstrap';
import { CreateButton } from '../../Elements';
import EditorFilterRow from './FilterRow';


class Filter extends Component {

  static propTypes = {
    filters: PropTypes.instanceOf(Immutable.List),
    fieldsOptions: PropTypes.instanceOf(Immutable.List),
    operators: PropTypes.instanceOf(Immutable.List),
    mode: PropTypes.string,
    onRemove: PropTypes.func,
    onAdd: PropTypes.func,
    onChangeField: PropTypes.func,
    onChangeOperator: PropTypes.func,
    onChangeValue: PropTypes.func,
  }

  static defaultProps = {
    filters: Immutable.List(),
    fieldsOptions: Immutable.List(),
    operators: Immutable.List(),
    mode: 'update',
    onChangeField: () => {},
    onChangeOperator: () => {},
    onChangeValue: () => {},
    onAdd: () => {},
    onRemove: () => {},
  }

  shouldComponentUpdate(nextProps) {
    const { filters, fieldsOptions, mode, operators } = this.props;
    return (
      !Immutable.is(filters, nextProps.filters)
      || !Immutable.is(fieldsOptions, nextProps.fieldsOptions)
      || !Immutable.is(operators, nextProps.operators)
      || mode !== nextProps.mode
    );
  }

  renderRow = (filter, index) => {
    const { mode, operators, fieldsOptions } = this.props;
    const disabled = mode === 'view';
    return (
      <EditorFilterRow
        key={index}
        item={filter}
        index={index}
        fieldsConfig={fieldsOptions}
        operators={operators}
        disabled={disabled}
        onChangeField={this.props.onChangeField}
        onChangeOperator={this.props.onChangeOperator}
        onChangeValue={this.props.onChangeValue}
        onRemove={this.props.onRemove}
      />
    );
  }

  render() {
    const { filters, mode, fieldsOptions } = this.props;
    const filtersRows = filters.map(this.renderRow);
    const disableAdd = fieldsOptions.isEmpty();
    return (
      <div>
        { !filtersRows.isEmpty() && (
          <Col sm={12}>
            <FormGroup className="form-inner-edit-row">
              <Col sm={4}><label htmlFor="field_field">Field</label></Col>
              <Col sm={2}><label htmlFor="operator_field">Operator</label></Col>
              <Col sm={4}><label htmlFor="value_field">Value</label></Col>
            </FormGroup>
          </Col>
        )}
        <Col sm={12}>{ filtersRows }</Col>
        { mode !== 'view' && (
          <Col sm={12}>
            <CreateButton onClick={this.props.onAdd} label="Add Condition" disabled={disableAdd} />
          </Col>
        )}
      </div>
    );
  }

}

export default Filter;
