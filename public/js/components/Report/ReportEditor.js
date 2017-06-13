import React, { PropTypes, Component } from 'react';
import { Form, Button, Col, Row, Panel } from 'react-bootstrap';
import Immutable from 'immutable';
import uuid from 'uuid';
import EditorDetails from './Editor/Details';
import EditorConditions from './Editor/Conditions';
import EditorColumns from './Editor/Columns';
import EditorSorts from './Editor/Sorts';
import { getConfig, createReportColumnLabel } from '../../common/Util';
import { reportTypes } from '../../actions/reportsActions';


class ReportEditor extends Component {

  static propTypes = {
    report: PropTypes.instanceOf(Immutable.Map),
    mode: PropTypes.string,
    reportFileds: PropTypes.instanceOf(Immutable.Map),
    aggregateOperators: PropTypes.instanceOf(Immutable.List),
    conditionsOperators: PropTypes.instanceOf(Immutable.List),
    sortOperators: PropTypes.instanceOf(Immutable.List),
    onFilter: PropTypes.func,
    onUpdate: PropTypes.func,
    onReset: PropTypes.func,
  };

  static defaultProps = {
    report: Immutable.Map(),
    mode: 'update',
    reportFileds: Immutable.Map(),
    aggregateOperators: getConfig(['reports', 'aggregateOperators'], Immutable.List()),
    conditionsOperators: getConfig(['reports', 'conditionsOperators'], Immutable.List()),
    sortOperators: Immutable.List([
      Immutable.Map({ value: 1, label: 'Ascending' }),
      Immutable.Map({ value: -1, label: 'Descending' }),
    ]),
    onFilter: () => {},
    onUpdate: () => {},
    onReset: () => {},
  };


  onApplay = () => {
    this.props.onFilter();
  }

  updateReport = (type, value) => {
    this.props.onUpdate(type, value);
  }

  onClear = () => {
    const { mode } = this.props;
    if (mode === 'create') {
      this.updateReport('entity', '');
      this.updateReport('conditions', Immutable.List());
      this.updateReport('columns', Immutable.List());
      this.updateReport('type', reportTypes.SIMPLE);
    } else {
      this.props.onReset();
    }
  }

  onChangeReportEntity = (val) => {
    this.updateReport('entity', val);
    this.updateReport('conditions', Immutable.List());
    this.updateReport('columns', Immutable.List());
    this.updateReport('type', reportTypes.SIMPLE);
  }

  onChangeReportType = (value) => {
    this.updateReport('type', value);
    this.updateColumnsByReportType(value);
  };

  onChangeReportKey = (value) => {
    this.updateReport('key', value);
  };

  /* Conditions */
  onChangeConditionField = (idx, value) => {
    const { report } = this.props;
    const newFilters = report
      .get('conditions', Immutable.List())
      .setIn([idx, 'field'], value)
      .setIn([idx, 'op'], '')
      .setIn([idx, 'value'], '');
    this.updateReport('conditions', newFilters);
  }

  onChangeConditionOperator = (idx, value) => {
    const { report } = this.props;
    const newFilters = report
      .get('conditions', Immutable.List())
      .update(idx, Immutable.Map(), (filter) => {
        if (value === 'exists' || filter.get('op', '') === 'exists') {
          return filter
            .set('op', value)
            .set('value', '');
        }
        return filter.set('op', value);
      });
    this.updateReport('conditions', newFilters);
  }

  onChangeConditionValue = (idx, value) => {
    const { report } = this.props;
    const newFilters = report
      .get('conditions', Immutable.List())
      .setIn([idx, 'value'], value);
    this.updateReport('conditions', newFilters);
  }

  onRemoveCondition = (index) => {
    const { report } = this.props;
    const newFilters = report
      .get('conditions', Immutable.List())
      .delete(index);
    this.updateReport('conditions', newFilters);
  }

  onAddCondition = () => {
    const { report } = this.props;
    const newFilters = report
      .get('conditions', Immutable.List())
      .push(Immutable.Map({
        field: '',
        op: '',
        value: '',
      }));
    this.updateReport('conditions', newFilters);
  }
  /* ~ Conditions */

  /* Sort */
  onChangeSortOperator = (idx, value) => {
    const { report } = this.props;
    const sorts = report
      .get('sorts', Immutable.List())
      .setIn([idx, 'op'], value);
    this.updateReport('sorts', sorts);
  }

  onChangeSortField = (idx, value) => {
    const { report } = this.props;
    const sorts = report
      .get('sorts', Immutable.List())
      .setIn([idx, 'field'], value)
      .setIn([idx, 'op'], '');
    this.updateReport('sorts', sorts);
  }

  onMoveSort = (oldIndex, newIndex) => {
    const { report } = this.props;
    const curr = report.getIn(['sorts', oldIndex]);
    const sorts = report
      .get('sorts', Immutable.List())
      .delete(oldIndex)
      .insert(newIndex, curr);
    this.updateReport('sorts', sorts);
  }

  onRemoveSort = (index) => {
    const { report } = this.props;
    const sorts = report
      .get('sorts', Immutable.List())
      .delete(index);
    this.updateReport('sorts', sorts);
  }

  onRemoveSortByKey = (key) => {
    const { report } = this.props;
    const sorts = report
      .get('sorts', Immutable.List())
      .filter(sort => sort.get('field', '') !== key);
    this.updateReport('sorts', sorts);
  }

  onAddSort = () => {
    const { report } = this.props;
    const sorts = report
      .get('sorts', Immutable.List())
      .push(Immutable.Map({
        field: '',
        op: '',
      }));
    this.updateReport('sorts', sorts);
  }
  /* ~Sort */

  /* Columns */
  onChangeColumnField = (index, value) => {
    const { report } = this.props;
    const columns = report
      .get('columns', Immutable.List())
      .update(index, Immutable.Map(), (column) => {
        const newColumn = column.set('filed_name', value);
        const label = column.get('label', '');
        const fieldName = column.get('filed_name', '');
        const op = column.get('op', '');
        const newLabel = this.getColumnNewLabel(label, fieldName, op, value, op);
        return newColumn.set('label', newLabel);
      });
    this.updateReport('columns', columns);
  }

  onChangeColumnOperator = (index, value) => {
    const { report } = this.props;
    const columns = report
      .get('columns', Immutable.List())
      .update(index, Immutable.Map(), (column) => {
        const newColumn = column.set('op', value);
        const label = column.get('label', '');
        const fieldName = column.get('filed_name', '');
        const op = column.get('op', '');
        const newLabel = this.getColumnNewLabel(label, fieldName, op, fieldName, value);
        return newColumn.set('label', newLabel);
      });
    this.updateReport('columns', columns);
  }

  onChangeColumnLabel = (index, value) => {
    const { report } = this.props;
    const columns = report
      .get('columns', Immutable.List())
      .setIn([index, 'label'], value);
    this.updateReport('columns', columns);
  }

  updateColumnsByReportType = (value) => {
    const { report } = this.props;
    const columns = report
      .get('columns', Immutable.List())
      .map((column) => {
        const label = column.get('label', '');
        const fieldName = column.get('filed_name', '');
        const op = column.get('op', '');
        const oldOp = (value === reportTypes.GROPPED) ? '' : op;
        const newOp = (value === reportTypes.GROPPED) ? op : '';
        const newLabel = this.getColumnNewLabel(label, fieldName, oldOp, fieldName, newOp);
        return column.set('label', newLabel);
      });
    this.updateReport('columns', columns);
  };

  onMoveColumn = (oldIndex, newIndex) => {
    const { report } = this.props;
    const curr = report.getIn(['columns', oldIndex]);
    const columns = report
      .get('columns', Immutable.List())
      .delete(oldIndex)
      .insert(newIndex, curr);
    this.updateReport('columns', columns);
  }

  onAddColumn = () => {
    const { report } = this.props;
    const newColumn = Immutable.Map({
      key: uuid.v4(),
      filed_name: '',
      label: '',
      op: '',
    });
    const columns = report
      .get('columns', Immutable.List())
      .push(newColumn);
    this.updateReport('columns', columns);
  }

  onRemoveColumn = (index) => {
    const { report } = this.props;
    const keyToRemove = report.getIn(['columns', index, 'key'], '');
    this.onRemoveSortByKey(keyToRemove);
    const columns = report
      .get('columns', Immutable.List())
      .delete(index);
    this.updateReport('columns', columns);
  }
  /* ~Columns */

  getColumnNewLabel = (label, oldfieldName, oldOp, newfieldName, newOp) => {
    const { aggregateOperators } = this.props;
    const fieldsConfig = this.getEntityFields();
    const newLabel = createReportColumnLabel(
      label, fieldsConfig, aggregateOperators, oldfieldName, oldOp, newfieldName, newOp,
    );
    return newLabel;
  }

  getEntityFields = () => {
    const { report, reportFileds } = this.props;
    return reportFileds.get(report.get('entity', ''), Immutable.List());
  }

  render() {
    const { mode, report, aggregateOperators, conditionsOperators, sortOperators } = this.props;
    const fieldsConfig = this.getEntityFields();
    const columns = report.get('columns', Immutable.List());

    return (
      <div className="ReportEditor">
        <Form horizontal>
          <Panel header="Basic Details">
            <EditorDetails
              mode={mode}
              title={report.get('key', '')}
              entity={report.get('entity', '')}
              type={report.get('type', reportTypes.SIMPLE)}
              onChangeKey={this.onChangeReportKey}
              onChangeEntity={this.onChangeReportEntity}
              onChangeType={this.onChangeReportType}
            />
          </Panel>
          <Panel header="Conditions (optional)">
            <EditorConditions
              mode={mode}
              conditions={report.get('conditions', Immutable.List())}
              fieldsOptions={fieldsConfig}
              operators={conditionsOperators}
              onRemove={this.onRemoveCondition}
              onAdd={this.onAddCondition}
              onChangeField={this.onChangeConditionField}
              onChangeOperator={this.onChangeConditionOperator}
              onChangeValue={this.onChangeConditionValue}
            />
          </Panel>
          <Panel header="Columns">
            <EditorColumns
              mode={mode}
              columns={columns}
              fieldsConfig={fieldsConfig}
              type={report.get('type', reportTypes.SIMPLE)}
              aggregateOperators={aggregateOperators}
              onChangeField={this.onChangeColumnField}
              onChangeOperator={this.onChangeColumnOperator}
              onChangeLabel={this.onChangeColumnLabel}
              onAdd={this.onAddColumn}
              onRemove={this.onRemoveColumn}
              onMove={this.onMoveColumn}
            />
          </Panel>
          <Panel header="Sort">
            <EditorSorts
              mode={mode}
              sorts={report.get('sorts', Immutable.List())}
              options={columns}
              sortOperators={sortOperators}
              onChangeField={this.onChangeSortField}
              onChangeOperator={this.onChangeSortOperator}
              onRemove={this.onRemoveSort}
              onAdd={this.onAddSort}
              onMove={this.onMoveSort}
            />
          </Panel>
        </Form>
        <Row>
          <Col sm={12}>
            <Button bsStyle="primary" onClick={this.onApplay} className="full-width mr10">
              <i className="fa fa-search" />&nbsp;Preview
            </Button>
          </Col>
          <Col sm={12}>&nbsp;</Col>
        </Row>
      </div>
    );
  }
}

export default ReportEditor;
