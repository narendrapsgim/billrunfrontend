import { connect } from 'react-redux';
import { Map, List } from 'immutable';
import CustomFieldForm from './CustomFieldForm';
import {
  availablePlaysSettingsSelector,
} from '../../selectors/settingsSelector';
import {
  validateFieldTitle,
  validateFieldKey,
} from '../../actions/customFieldsActions';
import {
  isFieldEditable,
} from '../../selectors/customFieldsSelectors';
import {
  getConfig,
  parseConfigSelectOptions,
  inConfigOptionBlackList,
  inConfigOptionWhiteList,
  isEditableFiledProperty,
} from '../../common/Util';


const mapStateToProps = (state, props) => {
  const { item, mode, entity } = props;
  const fieldType = item.get('type', 'text');
  const customFieldsConfig = getConfig(['customFields', 'fields'], List());
  const fieldTypesOptions = customFieldsConfig
    .filter(option => (
      !inConfigOptionBlackList(option, entity, 'excludeEntity')
      && inConfigOptionWhiteList(option, entity, 'includeEntity')
    ))
    .map(parseConfigSelectOptions)
    .toArray();
  const fieldTypeConfig = customFieldsConfig.find(config => config.get('id', '') === fieldType, null, Map());
  const editable = isFieldEditable(item, customFieldsConfig);
  const availablePlays = availablePlaysSettingsSelector(state, props) || List();
  const playsOptions = availablePlays.map(play => ({
    value: play.get('name', ''),
    label: play.get('label', play.get('name', '')),
  })).toArray();
  const showPlays = ['subscription'].includes(entity) && availablePlays.size > 1;
  return ({
    availablePlays: availablePlaysSettingsSelector(state, props),
    fieldType,
    fieldTypeLabel: fieldTypeConfig.get('title', fieldType),
    fieldTypesOptions,
    playsOptions,
    showPlays,
    isParams: item.get('field_name', '').startsWith('params.') || item.getIn(['uiFlags', 'isParam'], false),
    checkboxStyle: { marginTop: 10, paddingLeft: 26 },
    helpTextStyle: { color: '#626262', verticalAlign: 'text-top' },
    plays: item.get('plays', []).join(','),
    disableTitle: inConfigOptionBlackList(fieldTypeConfig, 'title') || !isEditableFiledProperty(item, editable, 'title'),
    disableFieldName: mode !== 'create',
    disableUnique: inConfigOptionBlackList(fieldTypeConfig, 'unique') || !isEditableFiledProperty(item, editable, 'unique'),
    disableMandatory: inConfigOptionBlackList(fieldTypeConfig, 'mandatory') || !isEditableFiledProperty(item, editable, 'mandatory') || item.get('unique', false),
    disableFieldType: inConfigOptionBlackList(fieldTypeConfig, 'type') || !isEditableFiledProperty(item, editable, 'type'),
    disabledEditable: inConfigOptionBlackList(fieldTypeConfig, 'editable') || !isEditableFiledProperty(item, editable, 'editable'),
    disabledDisplay: inConfigOptionBlackList(fieldTypeConfig, 'display') || !isEditableFiledProperty(item, editable, 'display'),
    disabledShowInList: inConfigOptionBlackList(fieldTypeConfig, 'showInList') || !isEditableFiledProperty(item, editable, 'show_in_list'),
    disableSearchable: inConfigOptionBlackList(fieldTypeConfig, 'searchable') || !isEditableFiledProperty(item, editable, 'searchable'),
    disableMultiple: inConfigOptionBlackList(fieldTypeConfig, 'multiple') || !isEditableFiledProperty(item, editable, 'multiple'),
    disableSelectList: inConfigOptionBlackList(fieldTypeConfig, 'selectOptions') || !isEditableFiledProperty(item, editable, 'select_list'),
    disableSelectOptions: !item.get('select_list', false) || !isEditableFiledProperty(item, editable, 'select_options'),
    disableHelp: inConfigOptionBlackList(fieldTypeConfig, 'help') || !isEditableFiledProperty(item, editable, 'help'),
    disableDescription: inConfigOptionBlackList(fieldTypeConfig, 'description') || !isEditableFiledProperty(item, editable, 'description'),
    disableDefaultValue: inConfigOptionBlackList(fieldTypeConfig, 'defaultValue') || !isEditableFiledProperty(item, editable, 'default_value'),
    isErrorTitle: (props.errors) && props.errors.get('title', false),
    isErrorFieldName: (props.errors) && props.errors.get('fieldName', false),
  });
};

const mapDispatchToProps = (dispatch, {
  item = Map(), existingFields = List(), updateField, removeField, setError,
}) => ({

  onChangeTitle: (path, value) => {
    const isValidTitle = validateFieldTitle(value);
    if (isValidTitle !== true) {
      setError('title', isValidTitle);
    } else {
      setError('title');
    }
    updateField('title', value);
  },

  onChangeFieldName: (path, value) => {
    const isValidKey = validateFieldKey(value, existingFields);
    if (isValidKey !== true) {
      setError('fieldName', isValidKey);
    } else {
      setError('fieldName');
    }
    updateField('field_name', value);
  },

  onChangeEntityField: (path, value) => {
    updateField(path, value);
  },

  onChangeIsParams: (e) => {
    const { value } = e.target;
    if (value) {
      updateField(['uiFlags', 'isParam'], true);
    } else if(!value) {
      removeField(['uiFlags', 'isParam']);
    }
  },

  onChange: (e) => {
    const { id, value } = e.target;
    updateField(id, value);
    if (id === 'unique' && value === true) {
      updateField('mandatory', true);
      removeField('default_value');
    }
    if (id === 'select_list' && value === false) {
      removeField('select_options', '');
    }
    if (id === 'select_list' && value === true) {
      updateField('select_options', item.get('select_options', ''));
    }
  },

  onChangePlay: (plays) => {
    updateField('plays', List(plays.split(',')));
  },

  onChangeType: (value) => {
    if (value === 'text') {
      removeField('type');
    } else {
      updateField('type', value);
    }

    const oldFieldType = item.get('type', 'text');
    const properties = Map({
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
    const fieldTypeConfig = getConfig(['customFields', 'fields'], List())
      .find(config => config.get('id', '') === value, null, Map());

    properties.forEach((fields, property) => {
      if (inConfigOptionBlackList(fieldTypeConfig, property)) {
        fields.forEach((fieldName) => {
          const resetValue = (fieldName === 'select_options') ? '' : false;
          updateField(fieldName, resetValue);
        });
      }
    });
    const stillTextable = textable.includes(oldFieldType) && textable.includes(value);
    if (!stillTextable) {
      removeField('default_value');
    }
  },
});

const mergeProps = (stateProps, dispatchProps, {
    entity, errors, existingFields, mode, removeField, setError, setItem, updateField, ...otherOwnProps
  }) => ({
    ...otherOwnProps,
    ...stateProps,
    ...dispatchProps,
  });

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(CustomFieldForm);
