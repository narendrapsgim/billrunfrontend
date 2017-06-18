import React, { PropTypes, Component } from 'react';
import Immutable from 'immutable';
import { FormGroup, Row, Col } from 'react-bootstrap';
import { CreateButton, SortableFieldsContainer } from '../../Elements';
import Column from './Column';
import { reportTypes } from '../../../actions/reportsActions';


class Columns extends Component {

  static propTypes = {
    columns: PropTypes.instanceOf(Immutable.List),
    fieldsConfig: PropTypes.instanceOf(Immutable.List),
    type: PropTypes.number,
    aggregateOperators: PropTypes.instanceOf(Immutable.List),
    mode: PropTypes.string,
    onChangeField: PropTypes.func,
    onChangeOperator: PropTypes.func,
    onChangeLabel: PropTypes.func,
    onAdd: PropTypes.func,
    onRemove: PropTypes.func,
    onMove: PropTypes.func,
  }

  static defaultProps = {
    columns: Immutable.List(),
    fieldsConfig: Immutable.List(),
    aggregateOperators: Immutable.List(),
    mode: 'update',
    type: 0,
    onChangeField: () => {},
    onChangeOperator: () => {},
    onChangeLabel: () => {},
    onAdd: () => {},
    onRemove: () => {},
    onMove: () => {},
  }

  shouldComponentUpdate(nextProps) {
    const { mode, columns, fieldsConfig, aggregateOperators, type } = this.props;
    return (
      !Immutable.is(columns, nextProps.columns)
      || !Immutable.is(fieldsConfig, nextProps.fieldsConfig)
      || !Immutable.is(aggregateOperators, nextProps.aggregateOperators)
      || mode !== nextProps.mode
      || type !== nextProps.type
    );
  }

  onMoveEnd = ({ oldIndex, newIndex }) => {
    this.props.onMove(oldIndex, newIndex);
  };

  getFieldsOptions = fieldsConfig => fieldsConfig.filter(
    config => config.get('aggregatable', true),
  );

  renderRows = () => {
    const { mode, columns, fieldsConfig, aggregateOperators, type } = this.props;
    const disabled = mode === 'view';
    const fieldsOptions = this.getFieldsOptions(fieldsConfig);
    return columns.map((column, index) => (
      <Column
        key={column.get('key', index)}
        item={column}
        idx={index}
        index={index}
        disabled={disabled}
        type={type}
        fieldsConfig={fieldsOptions}
        operators={aggregateOperators}
        onChangeField={this.props.onChangeField}
        onChangeOperator={this.props.onChangeOperator}
        onChangeLabel={this.props.onChangeLabel}
        onRemove={this.props.onRemove}
      />
    ));
  }

  render() {
    const { mode, type, fieldsConfig } = this.props;
    const columnsRows = this.renderRows();
    const disableAdd = fieldsConfig.isEmpty();
    return (
      <Row>
        { !columnsRows.isEmpty() && (
          <Col sm={12}>
            <FormGroup className="form-inner-edit-row">
              <Col sm={1}>&nbsp;</Col>
              <Col sm={4}><label htmlFor="field_field">Field</label></Col>
              <Col sm={2}><label htmlFor="operator_field">{type !== reportTypes.SIMPLE && 'Function'}</label></Col>
              <Col sm={3}><label htmlFor="value_field">Label</label></Col>
            </FormGroup>
          </Col>
        )}
        <Col sm={12}>
          <SortableFieldsContainer
            lockAxis="y"
            helperClass="draggable-row"
            useDragHandle={true}
            items={columnsRows.toArray()}
            onSortEnd={this.onMoveEnd}
          />
        </Col>
        { mode !== 'view' && (
          <Col sm={12}>
            <CreateButton onClick={this.props.onAdd} label="Add Column" disabled={disableAdd} />
          </Col>
        )}
      </Row>
    );
  }
}

export default Columns;
