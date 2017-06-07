import React, { PropTypes, Component } from 'react';
import Immutable from 'immutable';
import { Col, FormGroup } from 'react-bootstrap';
import EditorSortRow from './SortRow';
import { CreateButton } from '../../Elements';


class Sort extends Component {

  static propTypes = {
    sort: PropTypes.instanceOf(Immutable.List),
    options: PropTypes.instanceOf(Immutable.List),
    mode: PropTypes.string,
    onChangeField: PropTypes.func,
    onChangeOperator: PropTypes.func,
    onRemove: PropTypes.func,
    onAdd: PropTypes.func,
  }

  static defaultProps = {
    sort: Immutable.List(),
    options: Immutable.List(),
    mode: 'update',
    onChangeField: () => {},
    onChangeOperator: () => {},
    onRemove: () => {},
    onAdd: () => {},
  }

  shouldComponentUpdate(nextProps) {
    const { sort, options, mode } = this.props;
    return (
      !Immutable.is(sort, nextProps.sort)
      || !Immutable.is(options, nextProps.options)
      || mode !== nextProps.mode
    );
  }

  getUsedOptions = () => {
    const { sort } = this.props;
    return sort
      .filter(sortRow => sortRow.get('field', '') !== '')
      .map(sortRow => sortRow.get('field', ''));
  }

  renderSortRow = (sortRow, index, usedOptions) => {
    const { options, mode } = this.props;
    const disabled = mode === 'view';
    return (
      <EditorSortRow
        key={index}
        item={sortRow}
        index={index}
        disabled={disabled}
        options={options}
        usedOptions={usedOptions}
        onChangeField={this.props.onChangeField}
        onChangeOperator={this.props.onChangeOperator}
        onRemove={this.props.onRemove}
      />
    );
  }

  render() {
    const { sort, options, mode } = this.props;
    const disabled = mode === 'view';
    const disableCreateNew = disabled || options.isEmpty();
    const usedOptions = this.getUsedOptions();
    const sortRows = sort.map((sortRow, index) => this.renderSortRow(sortRow, index, usedOptions));
    return (
      <div>
        <Col sm={12}>
          <FormGroup className="form-inner-edit-row">
            <Col sm={5}><label htmlFor="field_field">Field</label></Col>
            <Col sm={3}><label htmlFor="order_field">Order</label></Col>
          </FormGroup>
        </Col>
        <Col sm={12}>{ sortRows }</Col>
        { mode !== 'view' && (
          <Col sm={12}>
            <CreateButton onClick={this.props.onAdd} label="Add Sort" disabled={disableCreateNew} />
          </Col>
        )}
      </div>
    );
  }

}

export default Sort;
