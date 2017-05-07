import React, { PropTypes, Component } from 'react';
import { Form, Button, FormGroup, Col, ControlLabel, HelpBlock } from 'react-bootstrap';
import Immutable from 'immutable';
import moment from 'moment';
import Select from 'react-select';
import Field from '../Field';
import {
  getConfig,
  parseConfigSelectOptions,
  formatSelectOptions,
} from '../../common/Util';


export default class ReportDetails extends Component {

  static propTypes = {
    report: PropTypes.instanceOf(Immutable.Map),
    mode: PropTypes.string,
    operators: PropTypes.instanceOf(Immutable.List),
    linesFileds: PropTypes.instanceOf(Immutable.List),
    onFilter: PropTypes.func,
    onUpdate: PropTypes.func,
    onReset: PropTypes.func,
  };

  static defaultProps = {
    report: Immutable.Map(),
    mode: 'update',
    operators: getConfig(['reports', 'operators'], Immutable.List()),
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

  onChangeEntity = (val) => {
    this.onChangefilter('entity', val);
    this.onChangefilter('filters', Immutable.List());
    this.onChangefilter('display', Immutable.List());
  }

  onChangeDisplayFields = (fields) => {
    const fieldsList = (fields.length) ? fields.split(',') : [];
    this.setState({ display: fieldsList });
    this.onChangefilter('display', fieldsList);
  }

  onChangeReportKey = (e) => {
    const { value } = e.target;
    this.setState({ key: value });
    this.onChangefilter('key', value);
  };

  onChangefilter = (type, value) => {
    this.props.onUpdate(type, value);
  }

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

  filterOptionByFieldType = (option, field) => {
    if (!field) {
      return false;
    }
    return option.get('types', Immutable.List()).includes(field.get('type', 'text'));
  }

  getEntityFields = () => {
    const { report, linesFileds } = this.props;
    switch (report.get('entity', '')) {
      case 'lines':
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
      .filter(filed => filed.get('filter', false))
      .map(parseConfigSelectOptions)
      .toArray();
    const opOptions = operators
      .filter(opt => this.filterOptionByFieldType(opt, confField))
      .map(parseConfigSelectOptions)
      .toArray();

    const onChangeFilterField = (e) => { this.onChangeFilterField(index, e); };
    const onChangeFilterOperator = (e) => { this.onChangeFilterOperator(index, e); };
    const onFilterRemove = (e) => { this.onFilterRemove(index, e); };

    return (
      <FormGroup className="form-inner-edit-row" key={index}>
        <Col sm={3}>
          <Select
            options={fieldOptions}
            value={filter.get('field', '')}
            onChange={onChangeFilterField}
            disabled={disabled}
          />
        </Col>

        <Col sm={3}>
          <Select
            clearable={false}
            options={opOptions}
            value={filter.get('op', '')}
            onChange={onChangeFilterOperator}
            disabled={disabled}
          />
        </Col>

        <Col sm={3}>
          { this.renderValue(filter, confField, index, disabled) }
        </Col>

        <Col sm={3} className="action">
          <Button onClick={onFilterRemove} bsSize="small" className="pull-left" disabled={disabled} >
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

    if (config.get('type', 'text') === 'text' && config.getIn(['inputConfig', 'inputType']) === 'select') {
      const options = config
        .getIn(['inputConfig', 'options'])
        .map(formatSelectOptions)
        .toArray();
      const multi = filed.get('op', '') === 'in';
      return (
        <Select
          clearable={false}
          multi={multi}
          options={options}
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

    // 'text'
    return (
      <div>
        <Field value={filed.get('value', '')} onChange={onChangeText} disabled={disabled} />
        {filed.get('op', null) === 'in' && <HelpBlock>comma separated values</HelpBlock>}
      </div>
    );
  }

  renderActions = () => {
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

  renderEntitySelector = () => {
    const { mode, report } = this.props;
    const entity = report.get('entity', '');
    const disabled = mode === 'view';
    const options = getConfig(['reports', 'entities'], Immutable.List()).map(formatSelectOptions).toArray();
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
    const { mode, report } = this.props;
    const disabled = mode === 'view';
    const display = report.get('display', Immutable.List());
    const displayFieldsValues = display.join(',');
    const options = this.getEntityFields()
      .filter(field => field.get('display', false))
      .map(parseConfigSelectOptions).toArray();
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

  render() {
    const { report } = this.props;
    const filters = report.get('filters', Immutable.List());
    const entityName = this.renderEntityName();
    const entitySelector = this.renderEntitySelector();
    const displayFieldsSelector = this.renderDisplayFieldsSelector();
    const inputs = filters.map(this.renderInputs);
    const actions = this.renderActions();
    return (
      <div className="CustomFilter">
        <Form horizontal>
          <Col sm={12}>{entityName}</Col>
          <Col sm={12}>{entitySelector}</Col>
          <Col sm={12}>{displayFieldsSelector}</Col>
          <Col sm={12}>{inputs}</Col>
          <Col sm={12}>{actions}</Col>
        </Form>
      </div>
    );
  }
}
