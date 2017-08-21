import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
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
    fieldsFilter: PropTypes.func,
    editable: PropTypes.bool,
    onChangeField: PropTypes.func,
    dispatch: PropTypes.func.isRequired,
  };

  static defaultProps = {
    entity: Immutable.Map(),
    fields: Immutable.List(),
    fieldsFilter: null,
    editable: true,
    onChangeField: () => {},
  }

  componentDidMount() {
    const { entityName, fields } = this.props;
    if (fields.isEmpty()) {
      this.props.dispatch(getSettings(entityName));
    }
  }

  filterPrintableFields = field => (
    field.get('display', false) !== false
    && field.get('editable', false) !== false
  );

  renderField = (field, key) => {
    const { entity, editable, onChangeField } = this.props;
    return (
      <EntityField
        key={key}
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
      .map(this.renderField);
  }

  render() {
    const entityfields = this.renderFields();
    if (!entityfields.isEmpty()) {
      return (
        <div className="EntityFields">
          { entityfields }
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
