import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import { sentenceCase } from 'change-case';
import { FormGroup, Col, ControlLabel, InputGroup, Button } from 'react-bootstrap';
import Select from 'react-select';
import Field from '../Field';


class EntityField extends Component {

  static propTypes = {
    entity: PropTypes.instanceOf(Immutable.Map),
    field: PropTypes.instanceOf(Immutable.Map),
    editable: PropTypes.bool,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    entity: Immutable.Map(),
    field: Immutable.Map(),
    editable: true,
    onChange: () => {},
  }

  state = {
    isFieldTags: this.props.field.get('multiple', false) && !this.props.field.get('select_list', false),
    isFieldSelect: this.props.field.get('select_list', false),
    isFieldBoolean: this.props.field.get('type', '') === 'boolean',
    fieldPath: this.props.field.get('field_name', '').split('.'),
    isRemoveField: ['params'].includes(this.props.field.get('field_name', '').split('.')[0]),
  }

  componentDidMount() {
    this.initDefaultValues();
  }

  initDefaultValues = () => {
    const { fieldPath } = this.state;
    const { field, entity } = this.props;
    if (entity.getIn(fieldPath, null) === null) {
      const noDefaultValueVal = this.getNoDefaultValueVal();
      const defaultValue = field.get('default_value', noDefaultValueVal);
      if (defaultValue !== null) {
      this.props.onChange(fieldPath, defaultValue);
    }
  }
  }

  getNoDefaultValueVal = (byConfig = true) => {
    const { field } = this.props;
    const { isFieldBoolean, isFieldTags, isFieldSelect } = this.state;
    if (isFieldBoolean) {
      return false;
    }
    if (!byConfig) {
      return null;
    }
    if (isFieldTags || (isFieldSelect && field.get('multiple', false))) {
      return [];
    }
    return '';
  }

  pasteSplit = (data) => {
    const separators = [',', ';', '\\(', '\\)', '\\*', '/', ':', '\\?', '\n', '\r', '\t'];
    return data.split(new RegExp(separators.join('|'))).map(d => d.trim());
  }

  getFieldOptios = field => field
    .get('select_options', '')
    .split(',')
    .filter(option => option !== '')
    .map(option => ({
      value: option,
      label: sentenceCase(option),
    }));

  onChange = (e) => {
    const { fieldPath } = this.state;
    const { value } = e.target;
    this.props.onChange(fieldPath, value);
  }

  onChangeSelect = (val) => {
    const { field } = this.props;
    const { fieldPath } = this.state;
    const multi = field.get('multiple', false);
    if (multi) {
    this.props.onChange(fieldPath, val.split(','));
    } else {
      this.props.onChange(fieldPath, val);
    }
  }

  onChangeTags = (val) => {
    const { fieldPath } = this.state;
    this.props.onChange(fieldPath, val);
  }

  getFieldValue = () => {
    const { fieldPath, isFieldTags, isFieldBoolean } = this.state;
    const { entity, editable } = this.props;
    if (isFieldBoolean) {
      return entity.getIn(fieldPath, '');
    }
    const fieldVal = entity.getIn(fieldPath, []);
    if (isFieldTags && editable) {
      return Immutable.List.isList(fieldVal) ? fieldVal.toArray() : fieldVal;
    }
    return (Array.isArray(fieldVal) || Immutable.List.isList(fieldVal)) ? fieldVal.join(',') : fieldVal;
  }

  onClickRemoveInput = () => {
    const { entity } = this.props;
    const { fieldPath } = this.state;
    if (fieldPath.length > 1) {
      const lastElement = fieldPath.splice(fieldPath.length - 1, 1);
      const withoutField = entity.getIn(fieldPath).delete(...lastElement);
      this.props.onChange(fieldPath, withoutField);
    }
  }

  renderRemovableField = input => (
    <InputGroup>
      {input}
      <InputGroup.Button>
        <Button onClick={this.onClickRemoveInput}>
          <i className="fa fa-fw fa-trash-o danger-red" />
        </Button>
      </InputGroup.Button>
    </InputGroup>
  );

  renderField = () => {
    const { editable, field } = this.props;
    const { isFieldTags, isFieldSelect, isFieldBoolean } = this.state;
    const value = this.getFieldValue();
    if (isFieldBoolean) {
      const checkboxStyle = { height: 29, marginTop: 8 };
      return (
        <Field onChange={this.onChange} value={value} fieldType="checkbox" editable={editable} style={checkboxStyle} />
      );
    }
    if (isFieldSelect && editable) {
      const multi = field.get('multiple', false);
      const options = this.getFieldOptios(field);
      return (
        <Select multi={multi} value={value} onChange={this.onChangeSelect} options={options} />
      );
    }
    if (isFieldTags && editable) {
      return (
        <Field fieldType="tags" value={value} onChange={this.onChangeTags} addOnPaste pasteSplit={this.pasteSplit} />
      );
    }
    const fieldType = field.get('type', '') === '' ? 'text' : field.get('type', '');
    return (
      <Field fieldType={fieldType} onChange={this.onChange} value={value} editable={editable} />
    );
  }

  render() {
    const { field, editable } = this.props;
    const { isRemoveField } = this.state;
    const fieldName = field.get('field_name', '');
    const fieldInput = this.renderField();

    return (
      <FormGroup controlId={fieldName}>
        <Col componentClass={ControlLabel} sm={3} lg={2}>
          { field.get('title', fieldName) }
          { field.get('mandatory', false) && (<span className="danger-red"> *</span>)}
        </Col>
        <Col sm={8} lg={9}>
          { isRemoveField && editable ? this.renderRemovableField(fieldInput) : fieldInput }
        </Col>
      </FormGroup>
    );
  }

}

export default EntityField;
