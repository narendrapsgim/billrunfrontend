import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import changeCase from 'change-case';
import { Form, InputGroup, Col, FormGroup, ControlLabel, Button, HelpBlock } from 'react-bootstrap';
import { SortableElement } from 'react-sortable-hoc';
import ModalWrapper from '../Elements/ModalWrapper';
import DragHandle from '../Elements/DragHandle';
import Field from '../Field';


class CustomField extends Component {

  static propTypes = {
    field: PropTypes.instanceOf(Immutable.Map),
    entity: PropTypes.string.isRequired,
    idx: PropTypes.number.isRequired,
    editable: PropTypes.bool,
    sortable: PropTypes.bool,
    existing: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
  };

  static defaultProps = {
    field: Immutable.Map(),
    editable: true,
    existing: false,
    sortable: true,
  };

  state = {
    showAdvancedEdit: false,
    cachedSelectOption: '',
  }

  onChangeType = (value) => {
    const { entity, idx } = this.props;
    if (value === 'text') {
      this.props.onChange(entity, idx, 'type', '');
    } else {
      this.props.onChange(entity, idx, 'type', value);
    }

    if (value === 'boolean') {
      this.props.onChange(entity, idx, 'unique', false);
      this.props.onChange(entity, idx, 'mandatory', false);
      this.props.onChange(entity, idx, 'multiple', false);
      this.props.onChange(entity, idx, 'select_list', false);
      this.props.onChange(entity, idx, 'select_options', '');
    }
  }

  onChange = (e) => {
    const { entity, idx, field } = this.props;
    const { id, value } = e.target;
    this.props.onChange(entity, idx, id, value);
    if (id === 'unique' && value === true) {
      this.props.onChange(entity, idx, 'mandatory', true);
    }
    if (id === 'select_list' && value === false) {
      const cachedSelectOption = field.get('select_options', '');
      this.setState({ cachedSelectOption });
      this.props.onChange(entity, idx, 'select_options', '');
    }
    if (id === 'select_list' && value === true) {
      this.props.onChange(entity, idx, 'select_options', this.state.cachedSelectOption);
    }
  };

  onRemove = () => {
    const { entity, idx } = this.props;
    this.props.onRemove(entity, idx);
  };

  onCloseModal = () => {
    this.setState({ showAdvancedEdit: false });
  };

  onOpenModal = () => {
    this.setState({ showAdvancedEdit: true });
  };

  getFieldType = field => (field.get('type', '') === '' ? 'text' : field.get('type', ''));
  isBoolean = field => this.getFieldType(field) === 'boolean';

  renderAdvancedEdit = () => {
    const { field } = this.props;
    const { showAdvancedEdit } = this.state;
    const modalTitle = changeCase.titleCase(`Edit ${field.get('field_name', 'field')} Details`);
    const checkboxStyle = { marginTop: 10, paddingLeft: 26 };
    const isBoolean = this.isBoolean(field);

    const disableUnique = isBoolean || !this.hasEditableField('unique');
    const disableMandatory = isBoolean || field.get('unique', false) || !this.hasEditableField('mandatory');
    const disableBoolean = field.get('select_list', false) || field.get('unique', false);
    const disableMultiple = isBoolean || !this.hasEditableField('multiple');
    const disableSearchable = isBoolean || !this.hasEditableField('searchable');
    const disableSelectList = isBoolean || !this.hasEditableField('select_list');
    const disableSelectOptions = !field.get('select_list', false) || !this.hasEditableField('select_options');
    const fieldTypesOptions = [
      { value: 'text', label: 'Text' }, //must be first
      { value: 'boolean', label: 'Boolean' },
      { value: 'textarea', label: 'Text Area' },
    ];
    return (
      <ModalWrapper show={showAdvancedEdit} onOk={this.onCloseModal} title={modalTitle}>
        <Form horizontal>
          <FormGroup>
            <Col sm={3} componentClass={ControlLabel}>Unique</Col>
            <Col sm={9} style={checkboxStyle}>
              <Field
                id="unique"
                onChange={this.onChange}
                value={field.get('unique', '')}
                fieldType="checkbox"
                disabled={disableUnique}
                className="inline mr10"
              />
              {disableUnique && (
                <small style={{ color: '#626262' }}>Unique field can not be boolean</small>
              )}
            </Col>
          </FormGroup>

          <FormGroup>
            <Col sm={3} componentClass={ControlLabel}>Mandatory</Col>
            <Col sm={9} style={checkboxStyle}>
              <Field id="mandatory" onChange={this.onChange} value={field.get('mandatory', '')} fieldType="checkbox" disabled={disableMandatory} className="inline mr10" />
              {disableMandatory && (
                <small style={{ color: '#626262' }}>{ field.get('mandatory', '')
                  ? 'Unique field must be mandatory'
                  : 'Mandatory field can not be boolean'
                }</small>
              )}
            </Col>
          </FormGroup>

          <FormGroup>
            <Col sm={3} componentClass={ControlLabel}>Editable</Col>
            <Col sm={9} style={checkboxStyle}>
              <Field
                fieldType="checkbox"
                id="editable"
                onChange={this.onChange}
                value={field.get('editable', '')}
                disabled={!this.hasEditableField('editable')}
              />
            </Col>
          </FormGroup>

          <FormGroup>
            <Col sm={3} componentClass={ControlLabel}>Display</Col>
            <Col sm={9} style={checkboxStyle}>
              <Field
                fieldType="checkbox"
                id="display"
                onChange={this.onChange}
                value={field.get('display', '')}
                disabled={!this.hasEditableField('display')}
              />
            </Col>
          </FormGroup>

          <FormGroup>
            <Col sm={3} componentClass={ControlLabel}>Show in list</Col>
            <Col sm={9} style={checkboxStyle}>
              <Field
                fieldType="checkbox"
                id="show_in_list"
                onChange={this.onChange}
                value={field.get('show_in_list', '')}
                disabled={!this.hasEditableField('show_in_list')}
              />
            </Col>
          </FormGroup>

          <FormGroup>
            <Col sm={3} componentClass={ControlLabel}>Searchable</Col>
            <Col sm={9} style={checkboxStyle}>
              <Field
                fieldType="checkbox"
                id="searchable"
                className="inline mr10"
                onChange={this.onChange}
                value={field.get('searchable', '')}
                disabled={disableSearchable}
              />
              {disableSearchable && (
                <small style={{ color: '#626262' }}>Boolean field can not be searchable</small>
              )}
            </Col>
          </FormGroup>

          <FormGroup>
            <Col sm={3} componentClass={ControlLabel}>Field Type</Col>
            <Col sm={9} style={checkboxStyle}>
              <Field
                fieldType="select"
                options={fieldTypesOptions}
                onChange={this.onChangeType}
                value={this.getFieldType(field)}
                disabled={disableBoolean}
                clearable={false}
              />
            </Col>
          </FormGroup>

          <FormGroup>
            <Col sm={3} componentClass={ControlLabel}>Multiple</Col>
            <Col sm={9} style={checkboxStyle}>
              <Field
                id="multiple"
                onChange={this.onChange}
                value={field.get('multiple', '')}
                fieldType="checkbox"
                disabled={disableMultiple}
                className="inline mr10"
              />
              {disableMultiple && (
                <small style={{ color: '#626262' }}>Boolean field can not be multiple</small>
              )}
            </Col>
          </FormGroup>

          <FormGroup>
            <Col sm={3} componentClass={ControlLabel}>Select list</Col>
            <Col sm={9}>
              <InputGroup>
                <InputGroup.Addon>
                  <Field
                    id="select_list"
                    onChange={this.onChange}
                    value={field.get('select_list', '')}
                    fieldType="checkbox"
                    disabled={disableSelectList}
                  />
                </InputGroup.Addon>
                <Field
                  id="select_options"
                  onChange={this.onChange}
                  value={field.get('select_options', '')}
                  disabled={disableSelectOptions}
                />
              </InputGroup>
              { field.get('select_list', false) && <HelpBlock style={{ marginLeft: 40 }}>Select Options <small>(comma-separated list)</small></HelpBlock>}
            </Col>
          </FormGroup>

        </Form>
      </ModalWrapper>
    );
  }

  hasEditableField = (propName = '') => {
    const { field, editable } = this.props;
    if (!editable) {
      return false;
    }
    const changeableProps = field.get('changeable_props', null);
    if (changeableProps === null) {
      return !field.get('system', false);
    }
    if (propName === '') {
      return !changeableProps.isEmpty();
    }
    return changeableProps.includes(propName);
  }

  render() {
    const { field, editable, existing, sortable } = this.props;
    const isBoolean = this.isBoolean(field);
    const checkboxStyle = { textAlign: 'center', marginTop: 10 };
    return (
      <FormGroup className="CustomField form-inner-edit-row">
        <Col sm={1} className="text-center">
          <DragHandle disabled={!sortable} />
        </Col>
        <Col sm={3}>
          <Field id="field_name" onChange={this.onChange} value={field.get('field_name', '')} disabled={!this.hasEditableField('field_name') || existing} />
        </Col>
        <Col sm={2}>
          <Field id="title" onChange={this.onChange} value={field.get('title', '')} disabled={!this.hasEditableField('title')} />
        </Col>
        <Col sm={2}>
          <Field
            id="default_value"
            onChange={this.onChange}
            value={field.get('default_value', '')}
            disabled={!this.hasEditableField('default_value')}
            fieldType={isBoolean ? 'checkbox' : 'text'}
            style={isBoolean ? checkboxStyle : undefined}
          />
        </Col>
        {editable && this.hasEditableField() && (
          <Col sm={4} className="actions">
            <Button onClick={this.onOpenModal} bsSize="small"><i className="fa fa-pencil active-blue" /> Advanced </Button>
            {this.hasEditableField('delete') && (
            <Button onClick={this.onRemove} bsSize="small">
              <i className="fa fa-trash-o danger-red" /> Remove </Button>
            )}
          </Col>
        )}
        { this.renderAdvancedEdit() }
      </FormGroup>
    );
  }

}

export default connect()(SortableElement(CustomField));
