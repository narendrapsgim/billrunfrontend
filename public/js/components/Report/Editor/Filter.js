import React, { PropTypes, Component } from 'react';
import Immutable from 'immutable';
import { Col } from 'react-bootstrap';
import {
  getConfig,
} from '../../../common/Util';
import { CreateButton } from '../../Elements';
import EditorFilterRow from './FilterRow';


class Filter extends Component {

  static propTypes = {
    filters: PropTypes.instanceOf(Immutable.List),
    options: PropTypes.instanceOf(Immutable.List),
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
    options: Immutable.List(),
    operators: getConfig(['reports', 'operators'], Immutable.List()),
    mode: 'update',
    onChangeField: () => {},
    onChangeOperator: () => {},
    onChangeValue: () => {},
    onAdd: () => {},
    onRemove: () => {},
  }

  shouldComponentUpdate(nextProps) {
    const { filters, options, mode, operators } = this.props;
    return (
      !Immutable.is(filters, nextProps.filters)
      || !Immutable.is(options, nextProps.options)
      || !Immutable.is(operators, nextProps.operators)
      || mode !== nextProps.mode
    );
  }

  renderRow = (filter, index) => {
    const { mode, operators, options } = this.props;
    const disabled = mode === 'view';
    return (
      <EditorFilterRow
        key={index}
        item={filter}
        index={index}
        fieldsConfig={options}
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
    const { filters, mode } = this.props;
    const filtersRows = filters.map(this.renderRow);
    return (
      <div>
        <Col sm={12}>{ filtersRows }</Col>
        { mode !== 'view' && (
          <Col sm={12}>
            <CreateButton onClick={this.props.onAdd} label="Add Condition" />
          </Col>
        )}
      </div>
    );
  }

}

export default Filter;
