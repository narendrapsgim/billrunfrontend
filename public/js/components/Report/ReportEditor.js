import React, { PropTypes, Component } from 'react';
import { Form, Button, FormGroup, Col, Row, ControlLabel, Panel } from 'react-bootstrap';
import Immutable from 'immutable';
import changeCase from 'change-case';
import Select from 'react-select';
import Field from '../Field';
import { CreateButton } from '../Elements';
import EditorFilterRow from './EditorFilterRow';
import {
  getConfig,
  parseConfigSelectOptions,
  formatSelectOptions,
} from '../../common/Util';


class ReportEditor extends Component {

  static propTypes = {
    report: PropTypes.instanceOf(Immutable.Map),
    mode: PropTypes.string,
    operators: PropTypes.instanceOf(Immutable.List),
    groupByOperators: PropTypes.instanceOf(Immutable.List),
    linesFileds: PropTypes.instanceOf(Immutable.List),
    onFilter: PropTypes.func,
    onUpdate: PropTypes.func,
    onReset: PropTypes.func,
  };

  static defaultProps = {
    report: Immutable.Map(),
    mode: 'update',
    operators: getConfig(['reports', 'operators'], Immutable.List()),
    groupByOperators: getConfig(['reports', 'groupByOperators'], Immutable.List()),
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

  onChangeEntity = (val) => {
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

  onChangeReportKey = (e) => {
    const { value } = e.target;
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

  filterOptionByFieldType = (option, field) => {
    if (!field) {
      return false;
    }
    return option.get('types', Immutable.List()).includes(field.get('type', 'string'));
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

  renderInputs = () => {
    const { report, mode, operators } = this.props;
    const fieldsConfig = this.getEntityFields();
    const disabled = mode === 'view';
    return report
      .get('filters', Immutable.List())
      .map((filter, index) => (
        <EditorFilterRow
          key={index}
          item={filter}
          index={index}
          fieldsConfig={fieldsConfig}
          operators={operators}
          disabled={disabled}
          onChangeField={this.onChangeFilterField}
          onChangeOperator={this.onChangeFilterOperator}
          onChangeValue={this.onChangeFilterValue}
          onRemove={this.onFilterRemove}
        />
      ));
  }

  renderSortInputs = (sort, index) => {
    const { mode, report } = this.props;
    const display = report.get('display', Immutable.List());
    const usedFields = report.get('sort', Immutable.List()).map(reportSort => reportSort.get('field', ''));

    const disabled = mode === 'view';

    const onRemove = (e) => { this.onSortRemove(index, e); };
    const onChangeField = (e) => { this.onChangeSortField(index, e); };
    const onChangeOperator = (e) => { this.onChangeSortOperator(index, e); };

    const fieldOptions = display
      .filter(fieldOption => !usedFields.includes(fieldOption) || sort.get('field', '') === fieldOption)
      .map(formatSelectOptions)
      .toArray();
    const opOptions = [{
      value: 1,
      label: 'Ascending',
    }, {
      value: -1,
      label: 'Descending',
    }];

    return (
      <FormGroup className="form-inner-edit-row" key={index}>
        <Col sm={5}>
          <Select
            options={fieldOptions}
            value={sort.get('field', '')}
            onChange={onChangeField}
            disabled={disabled}
          />
        </Col>
        <Col sm={3}>
          <Select
            clearable={false}
            options={opOptions}
            value={sort.get('op', '')}
            onChange={onChangeOperator}
            disabled={disabled}
          />
        </Col>
        <Col sm={2} className="action">
          <Button onClick={onRemove} bsSize="small" className="pull-left" disabled={disabled} block>
            <i className="fa fa-trash-o danger-red" />&nbsp;Remove
          </Button>
        </Col>
      </FormGroup>
    );
  }

  renderGroupByInputs = (filter, index) => {
    const { mode, groupByOperators } = this.props;
    const fieldConfig = this.getEntityFields();
    const confField = fieldConfig.find(conf => conf.get('id', '') === filter.get('field', ''), null, Immutable.Map());

    const disabled = mode === 'view';

    const fieldOptions = fieldConfig
      .filter(filed => filed.get('groupBy', true))
      .map(parseConfigSelectOptions)
      .toArray();
    const opOptions = groupByOperators
      .filter(opt => this.filterOptionByFieldType(opt, confField))
      .map(parseConfigSelectOptions)
      .toArray();

    const onChangeField = (e) => { this.onChangeBroupByField(index, e); };
    const onChangeOperator = (e) => { this.onChangeGroupByOperator(index, e); };
    const onRemove = (e) => { this.onGroupByRemove(index, e); };

    return (
      <FormGroup className="form-inner-edit-row" key={index}>
        <Col sm={5}>
          <Select
            options={fieldOptions}
            value={filter.get('field', '')}
            onChange={onChangeField}
            disabled={disabled}
          />
        </Col>
        <Col sm={3}>
          <Select
            clearable={false}
            options={opOptions}
            value={filter.get('op', '')}
            onChange={onChangeOperator}
            disabled={disabled}
          />
        </Col>
        <Col sm={2} className="action">
          <Button onClick={onRemove} bsSize="small" className="pull-left" disabled={disabled} block>
            <i className="fa fa-trash-o danger-red" />&nbsp;Remove
          </Button>
        </Col>
      </FormGroup>
    );
  }

  renderFilterActions = () => {
    const { mode } = this.props;
    if (mode === 'view') {
      return null;
    }
    return (
      <CreateButton onClick={this.onAddFilter} label="Add Condition" />
    );
  }

  renderSortActions = () => {
    const { mode, report } = this.props;
    if (mode === 'view') {
      return null;
    }
    const display = report.get('display', Immutable.List());
    const disabled = mode === 'view' || display.isEmpty();
    return (
      <CreateButton onClick={this.onSortAdd} label="Add Sort" disabled={disabled} />
    );
  }

  renderGroupByActions = () => {
    const { mode, report } = this.props;
    if (mode === 'view') {
      return null;
    }
    const isGroupBy = report.get('group_by_fields', Immutable.List()).isEmpty();
    const disabled = mode === 'view' || isGroupBy;
    return (
      <CreateButton onClick={this.onGroupByAdd} label="Add Group By Operator" disabled={disabled} />
    );
  }

  renderEntitySelector = () => {
    const { mode, report } = this.props;
    const entity = report.get('entity', '');
    const disabled = mode === 'view';
    const options = getConfig(['reports', 'entities'], Immutable.List())
      .map(option => Immutable.Map({
        value: option,
        label: changeCase.titleCase(getConfig(['systemItems', option, 'itemName'], option)),
      }))
      .map(formatSelectOptions)
      .toArray();
    return (
      <FormGroup>
        <Col componentClass={ControlLabel} sm={3}>
          Entity
        </Col>
        <Col sm={7}>
          <Select
            options={options}
            value={entity}
            onChange={this.onChangeEntity}
            disabled={disabled}
          />
        </Col>
      </FormGroup>
    );
  }

  renderEntityName = () => {
    const { mode, report } = this.props;
    const key = report.get('key', '');
    const disabled = mode === 'view';
    return (
      <FormGroup>
        <Col componentClass={ControlLabel} sm={3}>
          Name
        </Col>
        <Col sm={7}>
          <Field onChange={this.onChangeReportKey} value={key} disabled={disabled} />
        </Col>
      </FormGroup>
    );
  }

  renderDisplayFieldsSelector = () => {
    const { mode, report, groupByOperators } = this.props;
    const isGroupBy = !report.get('group_by_fields', Immutable.List()).isEmpty();
    const fieldConfig = this.getEntityFields();
    const disabled = mode === 'view';// || isGroupBy;
    const display = report.get('display', Immutable.List());
    const displayFieldsValues = display.join(',');

    let options = [];
    if (isGroupBy) {
      options = Immutable.List().withMutations((listWithMutations) => {
        report.get('group_by_fields', Immutable.List()).forEach((groupByField) => {
          const field = fieldConfig.find(conf => conf.get('id', '') === groupByField, null, Immutable.Map());
          listWithMutations.push(Immutable.Map({
            id: groupByField,
            title: field.get('title', groupByField),
          }));
        });
        report.get('group_by', Immutable.List()).forEach((groupBy) => {
          if (groupBy.get('field', '') !== '' && groupBy.get('op', '') !== '') {
            const field = fieldConfig.find(conf => conf.get('id', '') === groupBy.get('field', ''), null, Immutable.Map());
            const operator = groupByOperators.find(op => op.get('id', '') === groupBy.get('op', ''), null, Immutable.Map());
            listWithMutations.push(Immutable.Map({
              id: `${groupBy.get('field', '')}_${groupBy.get('op', '')}`,
              title: `${field.get('title', '')} (${operator.get('title', groupBy.get('op', ''))})`,
            }));
          }
        });
      })
      .map(parseConfigSelectOptions)
      .toArray();
    } else {
      options = this.getEntityFields()
      .filter(field => field.get('display', true))
      .map(parseConfigSelectOptions).toArray();
    }

    return (
      <FormGroup>
        <Col componentClass={ControlLabel} sm={3}>
          Display Fields
        </Col>
        <Col sm={7}>
          <Select
            multi={true}
            options={options}
            value={displayFieldsValues}
            onChange={this.onChangeDisplayFields}
            disabled={disabled}
          />
        </Col>
      </FormGroup>
    );
  }

  renderGroupByFieldsSelector = () => {
    const { mode, report } = this.props;
    const disabled = mode === 'view';
    const groupBy = report.get('group_by_fields', Immutable.List());
    const groupByFieldsValues = groupBy.join(',');
    const options = this.getEntityFields()
      .filter(field => field.get('display', true))
      .map(parseConfigSelectOptions).toArray();
    return (
      <FormGroup>
        <Col componentClass={ControlLabel} sm={3}>
          Group By
        </Col>
        <Col sm={7}>
          <Select
            multi={true}
            options={options}
            value={groupByFieldsValues}
            onChange={this.onChangeGroupByFields}
            disabled={disabled}
          />
        </Col>
      </FormGroup>
    );
  }

  render() {
    const { report } = this.props;


    const groupBy = report.get('group_by', Immutable.List());
    const groupByInputs = groupBy.map(this.renderGroupByInputs);

    const sort = report.get('sort', Immutable.List());
    const sortInputs = sort.map(this.renderSortInputs);

    return (
      <div className="ReportEditor">
        <Form horizontal>
          <Panel header="Basic Details">
            <Col sm={12}>{ this.renderEntityName() }</Col>
            <Col sm={12}>{ this.renderEntitySelector() }</Col>
          </Panel>
          <Panel header="Conditions (optional)">
            <Col sm={12}>{ this.renderInputs() }</Col>
            <Col sm={12}>{ this.renderFilterActions() }</Col>
          </Panel>
          <Panel header="Grouping (optional)"> {/* collabsed if empty */}
            <Col sm={12}>{ this.renderGroupByFieldsSelector() }</Col>
          </Panel>
          <Panel header="Grouping Operations (optional)"> {/* collabsed if empty */}
            <Col sm={12}>{ groupByInputs }</Col>
            <Col sm={12}>{ this.renderGroupByActions() }</Col>
          </Panel>
          <Panel header="Display options">
            <Col sm={12}>{ this.renderDisplayFieldsSelector() }</Col>
          </Panel>
          <Panel header="Sort">
            <Col sm={12}>{ sortInputs }</Col>
            <Col sm={12}>{ this.renderSortActions() }</Col>
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
