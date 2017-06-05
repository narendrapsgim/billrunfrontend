import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { Form, Button, FormGroup, Col, ControlLabel, HelpBlock } from 'react-bootstrap';
import Immutable from 'immutable';
import moment from 'moment';
import changeCase from 'change-case';
import Select from 'react-select';
import Field from '../Field';
import {
  getConfig,
  parseConfigSelectOptions,
  formatSelectOptions,
} from '../../common/Util';
import {
  getCyclesOptions,
  getProductsOptions,
  getPlansOptions,
  getServicesOptions,
  getGroupsOptions,
  getUsageTypesOptions,
} from '../../actions/reportsActions';
import {
  productsOptionsSelector,
  cyclesOptionsSelector,
  plansOptionsSelector,
  groupsOptionsSelector,
} from '../../selectors/listSelectors';
import {
  usageTypeSelector,
} from '../../selectors/settingsSelector';


class ReportDetails extends Component {

  static propTypes = {
    report: PropTypes.instanceOf(Immutable.Map),
    mode: PropTypes.string,
    operators: PropTypes.instanceOf(Immutable.List),
    groupByOperators: PropTypes.instanceOf(Immutable.List),
    getCyclesOptions: PropTypes.instanceOf(Immutable.List),
    getPlansOptions: PropTypes.instanceOf(Immutable.List),
    getProductsOptions: PropTypes.instanceOf(Immutable.List),
    getGroupsOptions: PropTypes.instanceOf(Immutable.List),
    getUsageTypesOptions: PropTypes.instanceOf(Immutable.List),
    linesFileds: PropTypes.instanceOf(Immutable.List),
    onFilter: PropTypes.func,
    onUpdate: PropTypes.func,
    onReset: PropTypes.func,
    dispatch: PropTypes.func.isRequired,
  };

  static defaultProps = {
    report: Immutable.Map(),
    mode: 'update',
    operators: getConfig(['reports', 'operators'], Immutable.List()),
    groupByOperators: getConfig(['reports', 'groupByOperators'], Immutable.List()),
    getCyclesOptions: Immutable.List(),
    getProductsOptions: Immutable.List(),
    getPlansOptions: Immutable.List(),
    getGroupsOptions: Immutable.List(),
    getUsageTypesOptions: Immutable.List(),
    linesFileds: Immutable.List(),
    onFilter: () => {},
    onUpdate: () => {},
    onReset: () => {},
  };

  componentDidMount() {
    this.initFieldOptions();
  }

  componentWillReceiveProps(nextProps) {
    const { linesFileds } = this.props;
    if (!Immutable.is(linesFileds, nextProps.linesFileds)) {
      this.initFieldOptions();
    }
  }

  initFieldOptions = () => {
    const { linesFileds } = this.props;
    linesFileds.forEach((lineFiled) => {
      if (lineFiled.hasIn(['inputConfig', 'callback'])) {
        const callback = lineFiled.getIn(['inputConfig', 'callback']);
        switch (callback) {
          case 'getCyclesOptions':
            if (this.props.getCyclesOptions.isEmpty()) {
              this.props.dispatch(getCyclesOptions());
            }
            break;
          case 'getPlansOptions':
            if (this.props.getPlansOptions.isEmpty()) {
              this.props.dispatch(getPlansOptions());
            }
            break;
          case 'getProductsOptions':
            if (this.props.getProductsOptions.isEmpty()) {
              this.props.dispatch(getProductsOptions());
            }
            break;
          case 'getServicesOptions':
            if (this.props.getServicesOptions.isEmpty()) {
              this.props.dispatch(getServicesOptions());
            }
            break;
          case 'getGroupsOptions':
            if (this.props.getGroupsOptions.isEmpty()) {
              this.props.dispatch(getGroupsOptions());
            }
            break;
          case 'getUsageTypesOptions':
            if (this.props.getUsageTypesOptions.isEmpty()) {
              this.props.dispatch(getUsageTypesOptions());
            }
            break;
          default:
            console.log('unknown select options callback');
            break;
        }
      }
    });
  }

  onClear = () => {
    const { mode } = this.props;
    if (mode === 'create') {
      this.onChangefilter('entity', '');
      this.onChangefilter('filters', Immutable.List());
      this.onChangefilter('display', Immutable.List());
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

  onChangeGroupByFields = (fields) => {
    const { report } = this.props;
    const isGroupByEmpty = report.get('group_by_fields', Immutable.List()).isEmpty();
    const groupByFields = (fields.length) ? fields.split(',') : [];
    if (groupByFields.length === 0) {
      this.onChangefilter('group_by', Immutable.List());
    }
    // Empty display values if group_by_fields was cleared or was init
    if (isGroupByEmpty || groupByFields.length === 0) {
      this.onChangefilter('display', Immutable.List());
    }
    this.onChangefilter('group_by_fields', Immutable.List(groupByFields));
  }

  onChangeEntity = (val) => {
    this.onChangefilter('entity', val);
    this.onChangefilter('filters', Immutable.List());
    this.onChangefilter('display', Immutable.List());
  }

  onChangeDisplayFields = (fields) => {
    const fieldsList = (fields.length) ? fields.split(',') : [];
    this.onChangefilter('display', Immutable.List(fieldsList));
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

  renderInputs = (filter, index) => {
    const { mode, operators } = this.props;
    const fieldConfig = this.getEntityFields();
    const confField = fieldConfig.find(conf => conf.get('id', '') === filter.get('field', ''), null, Immutable.Map());

    const disabled = mode === 'view';
    const fieldOptions = fieldConfig
      .filter(filed => filed.get('filter', true))
      .map(parseConfigSelectOptions)
      .toArray();
    const opOptions = operators
      .filter(opt => this.filterOptionByFieldType(opt, confField))
      .map(parseConfigSelectOptions)
      .toArray();

    const onChangeField = (e) => { this.onChangeFilterField(index, e); };
    const onChangeOperator = (e) => { this.onChangeFilterOperator(index, e); };
    const onRemove = (e) => { this.onFilterRemove(index, e); };

    return (
      <FormGroup className="form-inner-edit-row" key={index}>
        <Col sm={3}>
          <Select
            options={fieldOptions}
            value={filter.get('field', '')}
            onChange={onChangeField}
            disabled={disabled}
          />
        </Col>

        <Col sm={2}>
          <Select
            clearable={false}
            options={opOptions}
            value={filter.get('op', '')}
            onChange={onChangeOperator}
            disabled={disabled}
          />
        </Col>

        <Col sm={3}>
          { this.renderValue(filter, confField, index, disabled) }
        </Col>

        <Col sm={3} className="action">
          <Button onClick={onRemove} bsSize="small" className="pull-left" disabled={disabled} >
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
        <Col sm={3} className="action">
          <Button onClick={onRemove} bsSize="small" className="pull-left" disabled={disabled} >
            <i className="fa fa-trash-o danger-red" />&nbsp;Remove
          </Button>
        </Col>
      </FormGroup>
    );
  }

  renderValue = (filed, config, index, disabled) => {
    const onChangeSelect = (value) => {
      this.onChangeFilterValue(index, value);
    };

    const onChangeText = (e) => {
      const { value } = e.target;
      this.onChangeFilterValue(index, value);
    };

    const onChangeBoolean = (value) => {
      const bool = value === '' ? '' : value === 'yes';
      this.onChangeFilterValue(index, bool);
    };

    const onChangeNumber = (e) => {
      const { value } = e.target;
      const number = Number(value);
      if (!isNaN(number)) {
        this.onChangeFilterValue(index, number);
      } else {
        this.onChangeFilterValue(index, value);
      }
    };

    const onChangeDate = (date) => {
      if (moment.isMoment(date) && date.isValid()) {
        this.onChangeFilterValue(index, date.toISOString());
      } else {
        this.onChangeFilterValue(index, null);
      }
    };

    if (filed.get('op', null) === 'exists') {
      const value = filed.get('value', '') === '' ? '' : (filed.get('value', '') ? 'yes' : 'no');
      const options = ['yes', 'no'].map(formatSelectOptions);
      return (
        <Select
          clearable={false}
          options={options}
          value={value}
          onChange={onChangeBoolean}
          disabled={disabled}
        />
      );
    }
    if (config.get('type', 'string') === 'string' && config.getIn(['inputConfig', 'inputType']) === 'select') {
      const options = config.hasIn(['inputConfig', 'callback'])
        ? this.props[config.getIn(['inputConfig', 'callback'], '')] || Immutable.List()
        : config.getIn(['inputConfig', 'options'], Immutable.List());

      const formatedOptions = options
        .map(formatSelectOptions)
        .toArray();

      const multi = filed.get('op', '') === 'in';
      return (
        <Select
          clearable={false}
          multi={multi}
          options={formatedOptions}
          value={filed.get('value', '')}
          onChange={onChangeSelect}
          disabled={disabled}
        />
      );
    }

    if (config.get('type', '') === 'number' && !filed.get('op', '') === 'in') {
      return (
        <Field value={filed.get('value', '')} onChange={onChangeNumber} fieldType="number" disabled={disabled} />
      );
    }

    if (config.get('type', '') === 'date') {
      const value = moment(filed.get('value', null));
      return (
        <Field value={value} onChange={onChangeDate} fieldType="date" disabled={disabled} />
      );
    }

    // 'string'
    return (
      <div>
        <Field value={filed.get('value', '')} onChange={onChangeText} disabled={disabled} />
        {filed.get('op', null) === 'in' && <HelpBlock>comma separated values</HelpBlock>}
      </div>
    );
  }

  renderFilterActions = () => {
    const { mode } = this.props;
    const disabled = mode === 'view';
    if (disabled) {
      return null;
    }
    return (
      <div style={{ height: 40 }}>
        <Button bsStyle="link" onClick={this.onAddFilter} className="pull-left" disabled={disabled} >
          <i className="fa fa-plus" />&nbsp;Add Filter
        </Button>
      </div>
    );
  }

  renderGroupByActions = () => {
    const { mode, report } = this.props;
    const isGroupBy = report.get('group_by_fields', Immutable.List()).isEmpty();
    const disabled = mode === 'view' || isGroupBy;
    if (mode === 'view') {
      return null;
    }
    return (
      <div style={{ height: 40 }}>
        <Button bsStyle="link" onClick={this.onGroupByAdd} className="pull-left" disabled={disabled} >
          <i className="fa fa-plus" />&nbsp;Add Group By Operator
        </Button>
      </div>
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
          Display
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

  renderSearchButton = () => {
    return (
      <Button bsStyle="primary" onClick={this.onApplay} className="full-width mr10"><i className="fa fa-search" />&nbsp;Search</Button>
    );
  }

  render() {
    const { report } = this.props;

    const filters = report.get('filters', Immutable.List());
    const filtersInputs = filters.map(this.renderInputs);

    const groupBy = report.get('group_by', Immutable.List());
    const groupByInputs = groupBy.map(this.renderGroupByInputs);

    return (
      <div className="CustomFilter">
        <Form horizontal>
          <Col sm={12}>{ this.renderEntityName() }</Col>
          <Col sm={12}><hr style={{ marginTop: 0 }} /></Col>
          <Col sm={12}>{ this.renderEntitySelector() }</Col>
          <Col sm={12}><hr style={{ marginTop: 0 }} /></Col>
          <Col sm={12}>{ filtersInputs }</Col>
          <Col sm={12}>{ this.renderFilterActions() }</Col>
          <Col sm={12}><hr style={{ marginTop: 0 }} /></Col>
          <Col sm={12}>{ this.renderGroupByFieldsSelector() }</Col>
          <Col sm={12}>{ groupByInputs }</Col>
          <Col sm={12}>{ this.renderGroupByActions() }</Col>
          <Col sm={12}><hr style={{ marginTop: 0 }} /></Col>
          <Col sm={12}>{ this.renderDisplayFieldsSelector() }</Col>
          <Col sm={12}><hr style={{ marginTop: 0 }} /></Col>
          <Col sm={12}>{ this.renderSearchButton() }</Col>
          <Col sm={12}><hr style={{ marginTop: 0 }} /></Col>
        </Form>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  getCyclesOptions: cyclesOptionsSelector(state, props),
  getProductsOptions: productsOptionsSelector(state, props),
  getPlansOptions: plansOptionsSelector(state, props),
  getGroupsOptions: groupsOptionsSelector(state, props),
  getUsageTypesOptions: usageTypeSelector(state, props),
});

export default connect(mapStateToProps)(ReportDetails);
