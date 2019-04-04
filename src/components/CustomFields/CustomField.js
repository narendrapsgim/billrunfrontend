import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import changeCase from 'change-case';
import { Form, InputGroup, Col, FormGroup, ControlLabel, Button, HelpBlock } from 'react-bootstrap';
import { SortableElement } from 'react-sortable-hoc';
import { ModalWrapper, DragHandle } from '@/components/Elements';
import Field from '@/components/Field';
import {
  availablePlaysSettingsSelector,
} from '@/selectors/settingsSelector';
import {
  getConfig,
  parseConfigSelectOptions,
  shouldUsePlays,
  getPlayOptions,
} from '@/common/Util';


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
    availablePlays: PropTypes.instanceOf(Immutable.List),
    customFieldsConfig: PropTypes.instanceOf(Immutable.List),
  };

  static defaultProps = {
    field: Immutable.Map(),
    editable: true,
    existing: false,
    sortable: true,
    availablePlays: Immutable.List(),
    customFieldsConfig: getConfig(['customFields'], Immutable.List()),
  };

  state = {
    showAdvancedEdit: false,
    cachedSelectOption: '',
  }

  onChangeType = (value) => {
    const { entity, idx, field } = this.props;
    if (value === 'text') {
      this.props.onChange(entity, idx, 'type', '');
    } else {
      this.props.onChange(entity, idx, 'type', value);
    }

    const oldFieldType = this.getFieldType(field);
    const properties = Immutable.Map({
      unique: ['unique'],
      mandatory: ['mandatory'],
      editable: ['editable'],
      display: ['display'],
      showInList: ['show_in_list'],
      searchable: ['searchable'],
      multiple: ['multiple'],
      selectOptions: ['select_options', 'select_list'],
    });

    const textable = ['text', 'textarea', ''];

    properties.forEach((fields, property) => {
      if (!this.isAllowedForProperty(property, value)) {
        fields.forEach((fieldName) => {
          const resetValue = (fieldName === 'select_options') ? '' : false;
          this.props.onChange(entity, idx, fieldName, resetValue);
        });
      }
    });
    const stillTextable = textable.includes(oldFieldType) && textable.includes(value);
    if (!stillTextable) {
      this.props.onChange(entity, idx, 'default_value');
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

  onChangeRange = (value, id) => {
    const { entity, idx } = this.props;
    this.props.onChange(entity, idx, id, value);
  }

  onChangePlay = (plays) => {
    const { entity, idx } = this.props;
    this.props.onChange(entity, idx, 'plays', Immutable.List(plays.split(',')));
  }

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

  getFieldTypeConfig = (type = null) => {
    const { field, customFieldsConfig } = this.props;
    const fieldtype = (type === null) ? this.getFieldType(field) : type;
    return customFieldsConfig.find(config => config.get('id', '') === fieldtype, null, Immutable.Map());
  }

  inBlackList = (option, entity) => {
    const blackList = option.get('exclude', Immutable.List());
    if (blackList.isEmpty()) {
      return false;
    }
    return blackList.includes(entity);
  }

  inWhiteList = (option, entity) => {
    const whiteList = option.get('include', Immutable.List());
    if (whiteList.isEmpty()) {
      return true;
    }
    return whiteList.includes(entity);
  }

  isAllowedForProperty = (propName, type = null) => {
    const { field } = this.props;
    const fieldType = (type === null) ? this.getFieldType(field) : type;
    const fieldConfig = this.getFieldTypeConfig(fieldType);
    return fieldConfig.get(propName, true);
  }

  isEditableProperty = (propName = '') => {
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


  renderDefaultValueField = () => {
    const { field } = this.props;
    const fieldType = this.getFieldType(field);
    const disabledDefaultValue = !this.isEditableProperty('default_value');
    if (fieldType === 'boolean') {
      return (
        <Field
          fieldType="checkbox"
          id="default_value"
          onChange={this.onChange}
          value={field.get('default_value', '')}
          disabled={disabledDefaultValue}
          style={{ textAlign: 'center', marginTop: 10 }}
        />
      );
    }
    if (fieldType === 'ranges') {
      return (
        <Field
          fieldType="ranges"
          id="default_value"
          onChange={(value) => { this.onChangeRange(value, 'default_value'); }}
          value={field.get('default_value', Immutable.List())}
          disabled={disabledDefaultValue}
          compact={true}
        />
      );
    }
    return (
      <Field
        id="default_value"
        onChange={this.onChange}
        value={field.get('default_value', '')}
        disabled={disabledDefaultValue}
      />
    );
  }

  renderAdvancedEdit = () => {
    const { field, entity, customFieldsConfig, availablePlays } = this.props;
    const { showAdvancedEdit } = this.state;
    const fieldType = this.getFieldType(field);
    const fieldConfig = this.getFieldTypeConfig(fieldType);
    const fieldTypeLabel = fieldConfig.get('title', fieldType);
    const modalTitle = changeCase.titleCase(`Edit ${field.get('field_name', 'field')} Details`);
    const checkboxStyle = { marginTop: 10, paddingLeft: 26 };
    const helpTextStyle = { color: '#626262', verticalAlign: 'text-top' };

    const playsOptions = getPlayOptions(availablePlays);
    const showPlays = ['subscriber', 'product', 'service', 'plan'].includes(entity) && shouldUsePlays(availablePlays);
    const plays = field.get('plays', []).join(',');

    const disableUnique = !this.isAllowedForProperty('unique') || !this.isEditableProperty('unique');
    const disableMandatory = !this.isAllowedForProperty('mandatory') || !this.isEditableProperty('mandatory') || field.get('unique', false);
    const disableMultiple = !this.isAllowedForProperty('multiple') || !this.isEditableProperty('multiple');
    const disableSearchable = !this.isAllowedForProperty('searchable') || !this.isEditableProperty('searchable');
    const disabledShowInList = !this.isAllowedForProperty('showInList') || !this.isEditableProperty('show_in_list');
    const disabledDisplay = !this.isAllowedForProperty('display') || !this.isEditableProperty('display');
    const disabledEditable = !this.isAllowedForProperty('editable') || !this.isEditableProperty('editable');
    const disableSelectList = !this.isAllowedForProperty('selectOptions') || !this.isEditableProperty('select_list');
    const disableSelectOptions = !field.get('select_list', false) || !this.isEditableProperty('select_options');
    const disableFieldType = field.get('select_list', false) || field.get('unique', false);
    const fieldTypesOptions = customFieldsConfig
      .filter(option => (!this.inBlackList(option, entity) && this.inWhiteList(option, entity)))
      .map(parseConfigSelectOptions)
      .toArray();
    return (
      <ModalWrapper show={showAdvancedEdit} onOk={this.onCloseModal} title={modalTitle}>
        <Form horizontal>
          {showPlays && (
            <FormGroup>
              <Col sm={3} componentClass={ControlLabel}>Play</Col>
              <Col sm={9} style={checkboxStyle}>
                <Field
                  fieldType="select"
                  options={playsOptions}
                  onChange={this.onChangePlay}
                  value={plays}
                  multi={true}
                  clearable={true}
                />
              </Col>
            </FormGroup>
          )}

          <FormGroup>
            <Col sm={3} componentClass={ControlLabel}>Field Type</Col>
            <Col sm={9} style={checkboxStyle}>
              <Field
                fieldType="select"
                options={fieldTypesOptions}
                onChange={this.onChangeType}
                value={fieldType}
                disabled={disableFieldType}
                clearable={false}
              />
            </Col>
          </FormGroup>

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
                <small style={helpTextStyle}>
                  {fieldTypeLabel} field type can't be unique
                </small>
              )}
            </Col>
          </FormGroup>

          <FormGroup>
            <Col sm={3} componentClass={ControlLabel}>Mandatory</Col>
            <Col sm={9} style={checkboxStyle}>
              <Field id="mandatory" onChange={this.onChange} value={field.get('mandatory', '')} fieldType="checkbox" disabled={disableMandatory} className="inline mr10" />
              {(disableMandatory || field.get('unique', '')) && (
                <small style={helpTextStyle}>
                  { field.get('unique', '')
                    ? 'Unique field must be mandatory'
                    : `${fieldTypeLabel} field type can't be mandatory`
                  }
                </small>
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
                disabled={disabledEditable}
              />
              {disabledEditable && (
                <small style={helpTextStyle}>
                  {fieldTypeLabel} field type can't be editable
                </small>
              )}
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
                disabled={disabledDisplay}
              />
              {disabledDisplay && (
                <small style={helpTextStyle}>
                  {fieldTypeLabel} field type can't be display
                </small>
              )}
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
                disabled={disabledShowInList}
              />
              {disabledShowInList && (
                <small style={helpTextStyle}>
                  {fieldTypeLabel} field type can't be shown in list
                </small>
              )}
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
                <small style={helpTextStyle}>
                  {fieldTypeLabel} field type can't be searchable
                </small>
              )}
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
                <small style={helpTextStyle}>
                  {fieldTypeLabel} field type can't be multiple
                </small>
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
              { field.get('select_list', false) &&
                <HelpBlock style={{ marginLeft: 40 }}>
                  Select Options <small>(comma-separated list)</small>
                </HelpBlock>
              }
            </Col>
          </FormGroup>

        </Form>
      </ModalWrapper>
    );
  }

  render() {
    const { field, editable, existing, sortable } = this.props;
    return (
      <FormGroup className="CustomField form-inner-edit-row">
        <Col sm={1} className="text-center">
          <DragHandle disabled={!sortable} />
        </Col>
        <Col sm={3}>
          <Field id="field_name" onChange={this.onChange} value={field.get('field_name', '')} disabled={!this.isEditableProperty('field_name') || existing} />
        </Col>
        <Col sm={2}>
          <Field id="title" onChange={this.onChange} value={field.get('title', '')} disabled={!this.isEditableProperty('title')} />
        </Col>
        <Col sm={2}>
          {this.renderDefaultValueField()}
        </Col>
        {editable && this.isEditableProperty() && (
          <Col sm={4} className="actions">
            <Button onClick={this.onOpenModal} bsSize="small"><i className="fa fa-pencil active-blue" /> Advanced </Button>
            {this.isEditableProperty('delete') && (
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

const mapStateToProps = (state, props) => ({
  availablePlays: availablePlaysSettingsSelector(state, props),
});

export default connect(mapStateToProps)(SortableElement(CustomField));
