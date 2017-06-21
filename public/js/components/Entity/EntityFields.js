import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { FormGroup, Col, ControlLabel } from 'react-bootstrap';
import Select from 'react-select';
import Field from '../Field';
import { getSettings } from '../../actions/settingsActions';
import { entityFieldSelector } from '../../selectors/settingsSelector';


class EntityFields extends Component {

  static propTypes = {
    entity: PropTypes.instanceOf(Immutable.Map),
    entityName: PropTypes.string.isRequired,
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

  filterPrintableFields = field => (field.get('display', false) !== false && field.get('editable', false) !== false);

  onChangeField = (field, e) => {
    const { value } = e.target;
    this.props.onChangeField(field, value);
  }

  renderField = (field, key) => {
    const { entity, editable } = this.props;
    const fieldName = field.get('field_name', '');
    const fieldNamePath = fieldName.split('.');
    const multiple = field.get('multiple', false);
    const selectList = field.get('select_list', false);
    const multipleOptions = !selectList ? [] : field.get('select_options', '').split(',').map(option => ({ value: option, label: option }));
    const hasOptions = multipleOptions.length > 0;
    const isSelect = multiple || hasOptions;
    const sm = isSelect ? 4 : 8;
    const lg = isSelect ? 4 : 9;
    const fieldVal = entity.getIn(fieldNamePath, '');
    const value = (Array.isArray(fieldVal) || Immutable.List.isList(fieldVal)) ? fieldVal.join(',') : fieldVal;
    const onChange = (e) => {
      this.onChangeField(fieldNamePath, e);
    };
    const onChangeSelect = (val) => {
      this.props.onChangeField(fieldNamePath, val.split(','));
    };
    return (
      <FormGroup controlId={fieldName} key={key} >
        <Col componentClass={ControlLabel} sm={3} lg={2}>
          { field.get('title', fieldName) }
        </Col>
        <Col sm={sm} lg={lg}>
          {isSelect && editable
            ? (<Select
              id={fieldName}
              multi={multiple}
              value={value}
              onChange={onChangeSelect}
              options={multipleOptions}
              allowCreate={!hasOptions}
            />)
            : (<Field onChange={onChange} id={fieldName} value={value} editable={editable} />)
          }
        </Col>
      </FormGroup>
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
