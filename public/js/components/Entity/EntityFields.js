import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { MenuItem, DropdownButton, InputGroup } from 'react-bootstrap';
import classNames from 'classnames';
import { titleCase } from 'change-case';
import EntityField from './EntityField';
import { getSettings } from '../../actions/settingsActions';
import { entityFieldSelector } from '../../selectors/settingsSelector';


class EntityFields extends Component {

  static propTypes = {
    entity: PropTypes.instanceOf(Immutable.Map),
    entityName: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
    ]).isRequired,
    fields: PropTypes.instanceOf(Immutable.List),
    highlightPramas: PropTypes.instanceOf(Immutable.List),
    fieldsFilter: PropTypes.func,
    editable: PropTypes.bool,
    onChangeField: PropTypes.func,
    dispatch: PropTypes.func.isRequired,
  };

  static defaultProps = {
    entity: Immutable.Map(),
    fields: Immutable.List(),
    highlightPramas: Immutable.List(),
    fieldsFilter: null,
    editable: true,
    onChangeField: () => {},
  }

  componentDidMount() {
    const { entityName, fields, entity } = this.props;
    if (fields.isEmpty()) {
      this.props.dispatch(getSettings(entityName));
    }
    // fix problem when empty params object converted to array
    if (entity.has('params') && Immutable.is(entity.get('params', Immutable.List()), Immutable.List())) {
      this.props.onChangeField(['params'], Immutable.Map());
    }
  }

  getParamsOptions = () => {
    const { fields, fieldsFilter, highlightPramas } = this.props;
    const fieldFilterFunction = fieldsFilter !== null ? fieldsFilter : this.filterPrintableFields;
    return fields
      .filter(fieldFilterFunction)
      .filter(field => !this.filterParamsFields(field))
      .map(field => ({
        label: titleCase(field.get('title', '')),
        value: field.get('field_name', '').split('.')[1],
      }))
      .sort(a => (highlightPramas.includes(`params.${a.value}`) ? -1 : 1));
  }

  onAddParam = (key) => {
    this.props.onChangeField(['params', key], null);
  }

  filterPrintableFields = field => (
    field.get('display', false) !== false
    && field.get('editable', false) !== false
    && field.get('field_name', '') !== 'tariff_category'
  );

  filterParamsFields = (field) => {
    const { entity } = this.props;
    const fieldPath = field.get('field_name', '').split('.');
    return !(fieldPath[0] === 'params' && !entity.hasIn(fieldPath));
  }

  renderField = (field, key) => {
    const { entity, editable, onChangeField } = this.props;
    return (
      <EntityField
        key={`key_${field.get('field_name', key)}`}
        field={field}
        entity={entity}
        editable={editable}
        onChange={onChangeField}
      />
    );
  };

  renderFields = () => {
    const { fields, fieldsFilter } = this.props;
    const fieldFilterFunction = fieldsFilter !== null ? fieldsFilter : this.filterPrintableFields;
    return fields
      .filter(fieldFilterFunction)
      .filter(this.filterParamsFields)
      .map(this.renderField);
  }

  renderAddParamButton = (options) => {
    const { highlightPramas } = this.props;
    const menuItems = options.map((option) => {
      const highlight = highlightPramas.includes(`params.${option.value}`);
      const menuItemClass = classNames({
        'disable-label': !highlight,
      });
      const onSelect = () => { this.onAddParam(option.value); };
      return (
        <MenuItem key={option.value} eventKey={option.value} onSelect={onSelect}>
          <span className={menuItemClass}>{option.label}</span>
        </MenuItem>
      );
    });
    return (
      <DropdownButton id="add-param-input" componentClass={InputGroup.Button} className="btn-primary btn btn-xs btn-default" title="Add parameter" >
        { menuItems }
      </DropdownButton>
    );
  }

  render() {
    const { editable } = this.props;
    const entityfields = this.renderFields();
    const paramsOptions = this.getParamsOptions();
    if (!entityfields.isEmpty() || !paramsOptions.isEmpty()) {
      return (
        <div className="EntityFields">
          { entityfields }
          { (!paramsOptions.isEmpty() && editable) && this.renderAddParamButton(paramsOptions) }
        </div>
      );
    }
    return null;
  }
}

const mapStateToProps = (state, props) => ({
  fields: entityFieldSelector(state, props),
});

export default connect(mapStateToProps)(EntityFields);
