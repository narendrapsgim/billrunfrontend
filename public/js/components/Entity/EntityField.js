import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import { sentenceCase } from 'change-case';
import { FormGroup, Col, ControlLabel } from 'react-bootstrap';
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
    fieldPath: this.props.field.get('field_name', '').split('.'),
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
    const { fieldPath } = this.state;
    this.props.onChange(fieldPath, val.split(','));
  }

  onChangeTags = (val) => {
    const { fieldPath } = this.state;
    this.props.onChange(fieldPath, val);
  }

  getFieldValue = () => {
    const { fieldPath, isFieldTags } = this.state;
    const { entity, editable } = this.props;
    const fieldVal = entity.getIn(fieldPath, []);
    if (isFieldTags && editable) {
      return Immutable.List.isList(fieldVal) ? fieldVal.toArray() : fieldVal;
    }
    return (Array.isArray(fieldVal) || Immutable.List.isList(fieldVal)) ? fieldVal.join(',') : fieldVal;
  }

  renderField = () => {
    const { editable, field } = this.props;
    const { isFieldTags, isFieldSelect } = this.state;
    const value = this.getFieldValue();
    if (isFieldSelect && editable) {
      const multi = field.get('multiple', false);
      const options = this.getFieldOptios(field);
      return (
        <Select multi={multi} value={value} onChange={this.onChangeSelect} options={options} />
      );
    }
    if (isFieldTags && editable) {
      return (
        <Field fieldType="tags" value={value} onChange={this.onChangeTags} />
      );
    }
    return (
      <Field onChange={this.onChange} value={value} editable={editable} />
    );
  }

  render() {
    const { field } = this.props;
    const fieldName = field.get('field_name', '');
    return (
      <FormGroup controlId={fieldName}>
        <Col componentClass={ControlLabel} sm={3} lg={2}>
          { field.get('title', fieldName) }
          { field.get('mandatory', false) && (<span className="danger-red"> *</span>)}
        </Col>
        <Col sm={8} lg={9}>
          {this.renderField()}
        </Col>
      </FormGroup>
    );
  }

}

export default EntityField;
