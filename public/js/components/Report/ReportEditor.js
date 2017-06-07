import React, { PropTypes, Component } from 'react';
import { Form, Button, Col, Row, Panel } from 'react-bootstrap';
import Immutable from 'immutable';
import EditorDetails from './Editor/Details';
import EditorFilter from './Editor/Filter';
import EditorDisplay from './Editor/Display';
import EditorSort from './Editor/Sort';


class ReportEditor extends Component {

  static propTypes = {
    report: PropTypes.instanceOf(Immutable.Map),
    mode: PropTypes.string,
    linesFileds: PropTypes.instanceOf(Immutable.List),
    onFilter: PropTypes.func,
    onUpdate: PropTypes.func,
    onReset: PropTypes.func,
  };

  static defaultProps = {
    report: Immutable.Map(),
    mode: 'update',
    linesFileds: Immutable.List(),
    onFilter: () => {},
    onUpdate: () => {},
    onReset: () => {},
  };

  onClear = () => {
    const { mode } = this.props;
    if (mode === 'create') {
      this.onChangefilter('entity', '');
      this.onChangefilter('filters', Immutable.List());
      this.onChangefilter('display', Immutable.List());
      this.onChangefilter('sort', Immutable.List());
      this.onChangefilter('group_by', Immutable.List());
      this.onChangefilter('group_by_fields', Immutable.List());
    } else {
      this.props.onReset();
    }
  }

  onApplay = () => {
    this.props.onFilter();
  }

  onChangeFilterField = (idx, value) => {
    const { report } = this.props;
    const newFilters = report
      .get('filters', Immutable.List())
      .setIn([idx, 'field'], value)
      .setIn([idx, 'op'], '')
      .setIn([idx, 'value'], '');
    this.onChangefilter('filters', newFilters);
  }

  onChangeFilterOperator = (idx, value) => {
    const { report } = this.props;
    const newFilters = report
      .get('filters', Immutable.List())
      .setIn([idx, 'op'], value)
      .setIn([idx, 'value'], '');
    this.onChangefilter('filters', newFilters);
  }

  onChangeFilterValue = (idx, value) => {
    const { report } = this.props;
    const newFilters = report
      .get('filters', Immutable.List())
      .setIn([idx, 'value'], value);
    this.onChangefilter('filters', newFilters);
  }

  onFilterRemove = (index) => {
    const { report } = this.props;
    const newFilters = report
      .get('filters', Immutable.List())
      .delete(index);
    this.onChangefilter('filters', newFilters);
  }

  onChangeBroupByField = (idx, value) => {
    const { report } = this.props;
    this.removeDisplayOnGroupByChange(idx);
    const groupBy = report
      .get('group_by', Immutable.List())
      .setIn([idx, 'field'], value)
      .setIn([idx, 'op'], '');
    this.onChangefilter('group_by', groupBy);
  }

  onChangeGroupByOperator = (idx, value) => {
    const { report } = this.props;
    this.removeDisplayOnGroupByChange(idx);
    const groupBy = report
      .get('group_by', Immutable.List())
      .setIn([idx, 'op'], value);
    this.onChangefilter('group_by', groupBy);
  }

  onGroupByRemove = (index) => {
    const { report } = this.props;
    this.removeDisplayOnGroupByChange(index);
    const groupBy = report
      .get('group_by', Immutable.List())
      .delete(index);
    this.onChangefilter('group_by', groupBy);
  }

  removeDisplayOnGroupByChange = (index) => {
    const { report } = this.props;
    const groupByField = report.getIn(['group_by', index], Immutable.Map());
    const groupByFieldLabel = `${groupByField.get('field', '')}_${groupByField.get('op', '')}`;
    const displayFields = report.get('display', Immutable.List())
      .filter(display => display !== groupByFieldLabel);
    this.onChangefilter('display', displayFields);
    this.removeSortOnDisplayChange(displayFields);
  }

  onGroupByAdd = () => {
    const { report } = this.props;
    const groupBy = report
      .get('group_by', Immutable.List())
      .push(Immutable.Map({
        op: '',
        field: '',
      }));
    this.onChangefilter('group_by', groupBy);
  }

  onChangeSortOperator = (idx, value) => {
    const { report } = this.props;
    const sort = report
      .get('sort', Immutable.List())
      .setIn([idx, 'op'], value);
    this.onChangefilter('sort', sort);
  }

  onChangeSortField = (idx, value) => {
    const { report } = this.props;
    const sort = report
      .get('sort', Immutable.List())
      .setIn([idx, 'field'], value)
      .setIn([idx, 'op'], '');
    this.onChangefilter('sort', sort);
  }

  onSortAdd = () => {
    const { report } = this.props;
    const sort = report
      .get('sort', Immutable.List())
      .push(Immutable.Map({
        field: '',
        order: 1,
      }));
    this.onChangefilter('sort', sort);
  }

  onSortRemove = (index) => {
    const { report } = this.props;
    const sort = report
      .get('sort', Immutable.List())
      .delete(index);
    this.onChangefilter('sort', sort);
  }

  onChangeGroupByFields = (fields) => {
    const { report } = this.props;
    const isGroupByEmpty = report.get('group_by_fields', Immutable.List()).isEmpty();
    const groupByFields = (fields.length) ? fields.split(',') : [];
    if (groupByFields.length === 0) {
      this.onChangefilter('group_by', Immutable.List());
    }
    // Empty display/sort values if group_by_fields was cleared or was init
    if (isGroupByEmpty || groupByFields.length === 0) {
      this.onChangefilter('display', Immutable.List());
      this.onChangefilter('sort', Immutable.List());
    }
    this.onChangefilter('group_by_fields', Immutable.List(groupByFields));
  }

  onChangeReportEntity = (val) => {
    this.onChangefilter('entity', val);
    this.onChangefilter('filters', Immutable.List());
    this.onChangefilter('display', Immutable.List());
    this.onChangefilter('sort', Immutable.List());
  }

  onChangeDisplayFields = (fields) => {
    const fieldsList = (fields.length) ? fields.split(',') : [];
    const displayFields = Immutable.List(fieldsList);
    this.onChangefilter('display', displayFields);
    this.removeSortOnDisplayChange(displayFields);
  }

  removeSortOnDisplayChange = (displayFields) => {
    const { report } = this.props;
    const sort = report
      .get('sort', Immutable.List())
      .filter(sortField => displayFields.includes(sortField.get('field', '')));
    this.onChangefilter('sort', sort);
  }

  onChangeReportKey = (value) => {
    this.onChangefilter('key', value);
  };

  onAddFilter = () => {
    const { report } = this.props;
    const newFilters = report
      .get('filters', Immutable.List())
      .push(Immutable.Map({
        field: '',
        op: '',
        value: '',
      }));
    this.onChangefilter('filters', newFilters);
  }

  onChangefilter = (type, value) => {
    this.props.onUpdate(type, value);
  }

  getEntityFields = () => {
    const { report, linesFileds } = this.props;
    switch (report.get('entity', '')) {
      case 'usage':
        return linesFileds;
      default:
        return Immutable.List();

    }
  }

  render() {
    const { mode, report } = this.props;
    const fieldsConfig = this.getEntityFields();
    return (
      <div className="ReportEditor">
        <Form horizontal>
          <Panel header="Basic Details">
            <EditorDetails
              mode={mode}
              title={report.get('key', '')}
              entity={report.get('entity', '')}
              onChangeKey={this.onChangeReportKey}
              onChangeEntity={this.onChangeReportEntity}
            />
          </Panel>
          <Panel header="Conditions (optional)">
            <EditorFilter
              mode={mode}
              filters={report.get('filters', Immutable.List())}
              options={fieldsConfig}
              onRemove={this.onFilterRemove}
              onAdd={this.onAddFilter}
              onChangeField={this.onChangeFilterField}
              onChangeOperator={this.onChangeFilterOperator}
              onChangeValue={this.onChangeFilterValue}
            />
          </Panel>
          <Panel header="Fields">
            <EditorDisplay
              mode={mode}
              item={report}
              fieldsConfig={fieldsConfig}
              onGroupByAdd={this.onGroupByAdd}
              onGroupByRemove={this.onGroupByRemove}
              onChangeBroupByField={this.onChangeBroupByField}
              onChangeGroupByOperator={this.onChangeGroupByOperator}
              onChangeGroupByFields={this.onChangeGroupByFields}
              onChangeDisplayFields={this.onChangeDisplayFields}
            />
          </Panel>
          <Panel header="Sort">
            <EditorSort
              mode={mode}
              sort={report.get('sort', Immutable.List())}
              options={report.get('display', Immutable.List())}
              onChangeField={this.onChangeSortField}
              onChangeOperator={this.onChangeSortOperator}
              onRemove={this.onSortRemove}
              onAdd={this.onSortAdd}
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
