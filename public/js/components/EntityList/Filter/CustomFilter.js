import React, { PropTypes, Component } from 'react';
import { Form, Button, FormGroup, Col, ControlLabel } from 'react-bootstrap';
import Immutable from 'immutable';
import { sentenceCase, snakeCase } from 'change-case';
import Select from 'react-select';
import Field from '../../Field';
import { getConfig } from '../../../common/Util';


export default class CustomFilter extends Component {

  static propTypes = {
    onFilter: PropTypes.func,
    onChangefilter: PropTypes.func,
    filters: PropTypes.instanceOf(Immutable.List()),
    entity: PropTypes.string,
  };

  static defaultProps = {
    onFilter: () => {},
    onChangefilter: () => {},
    entity: '',
    filters: Immutable.List(),
  };

  constructor(props) {
    super(props);
    this.state = {
      filters: props.filters,
      entity: props.entity,
    };
  }

  parseFiledTypesSelectOptions = option => (
    option.has('title')
      ? this.parseSelectOptions(Immutable.Map({
        id: option.get('id'),
        lable: option.get('title'),
      }))
      : this.parseSelectOptions(option.get('id'))
  );

  parseSelectOptions = (option) => {
    if (Immutable.Map.isMap(option)) {
      return {
        value: option.get('value', ''),
        label: option.get('label', ''),
      };
    }
    return {
      value: snakeCase(option),
      label: sentenceCase(option),
    };
  }

  onClear = () => {
    const filters = Immutable.List();
    this.setState({ filters, entity: '' });
    this.onChangefilter('filters', filters);
    this.onChangefilter('entity', '');
  }

  onApplay = () => {
    const { filters } = this.state;
    this.props.onFilter(filters);
    console.log(filters);
  }

  onChangeFilterField = (idx, value) => {
    const { filters } = this.state;
    const newFilters = filters.setIn([idx, 'field'], value);
    this.setState({ filters: newFilters });
    this.onChangefilter('filters', newFilters);
  }

  onChangeFilterOperator = (idx, value) => {
    const { filters } = this.state;
    const newFilters = filters.setIn([idx, 'op'], value);
    this.setState({ filters: newFilters });
    this.onChangefilter('filters', newFilters);
  }

  onChangeFilterValue = (idx, e) => {
    const { value } = e.target;
    const { filters } = this.state;
    const newFilters = filters.setIn([idx, 'value'], value);
    this.setState({ filters: newFilters });
    this.onChangefilter('filters', newFilters);
  }

  onFilterRemove = (index) => {
    const { filters } = this.state;
    const newFilters = filters.delete(index);
    this.setState({ filters: newFilters });
    this.onChangefilter('filters', newFilters);
  }

  onChangeEntity = (val) => {
    this.setState({ entity: val });
    this.onChangefilter('entity', val);
  }

  onChangefilter = (type, value) => {
    this.props.onChangefilter(type, value);
  }


  onAddFilter = () => {
    const { filters } = this.state;
    const newFilters = Immutable.Map({
      field: '',
      op: '',
      value: '',
    });
    this.setState({ filters: filters.push(newFilters) });
  }

  renderInputs = (filter, index, filters) => {
    const { entity } = this.state;

    const value = filter.get('value', '');
    const field = filter.get('field', '');
    const options = getConfig(['reports', 'fields', entity], Immutable.List()).map(this.parseFiledTypesSelectOptions).toArray();

    const op = filter.get('op', '');
    const opOptions = ['eq', 'gt'].map(this.parseSelectOptions);

    return (
      <FormGroup className="form-inner-edit-row">
        <Col sm={3}>
          <Select options={options} value={field} onChange={this.onChangeFilterField.bind(this, index)} />
        </Col>

        <Col sm={3}>
          <Select options={opOptions} value={op} onChange={this.onChangeFilterOperator.bind(this, index)} />
        </Col>

        <Col sm={3}>
          <Field value={value} onChange={this.onChangeFilterValue.bind(this, index)} />
        </Col>

        <Col sm={3}>
          <Button onClick={this.onFilterRemove.bind(null, index)} bsSize="small" className="pull-left" >
            <i className="fa fa-trash-o danger-red" />&nbsp;Remove
          </Button>
        </Col>
      </FormGroup>
    );
  }

  renderActions = () => (
    <div style={{ height: 40 }}>
      <Button bsStyle="link" onClick={this.onAddFilter} className="pull-left">
        <i className="fa fa-plus" />&nbsp;Add Filter
      </Button>
      <Button onClick={this.onClear} className="pull-right">
        <i className="fa fa-eraser danger-red" />&nbsp;Reset
      </Button>
      <Button bsStyle="primary" onClick={this.onApplay} className="pull-right mr10">
        <i className="fa fa-search" />&nbsp;Search
      </Button>
    </div>
  );

  renderEntitySelector = () => {
    const { entity } = this.state;
    const options = getConfig(['reports', 'entities'], Immutable.List()).map(this.parseSelectOptions).toArray();
    return (
      <FormGroup>
        <Col componentClass={ControlLabel} sm={3} lg={2}>
          Entity
        </Col>
        <Col sm={6} lg={6}>
          <Select
            options={options}
            value={entity}
            onChange={this.onChangeEntity}
          />
        </Col>
      </FormGroup>

    );
  }

  render() {
    const { filters } = this.state;
    const entitySelector = this.renderEntitySelector();
    const inputs = filters.map(this.renderInputs);
    const actions = this.renderActions();

    return (
      <div className="CustomFilter">
        <Form horizontal>
          <div>{entitySelector}</div>
          <div>{inputs}</div>
          <div>{actions}</div>
        </Form>
      </div>
    );
  }
}
