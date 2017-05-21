import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { FormGroup, Col, ControlLabel } from 'react-bootstrap';
import Field from '../Field';
import { getSettings } from '../../actions/settingsActions';
import { entityFieldSelector } from '../../selectors/settingsSelector';


class EntityFields extends Component {

  static propTypes = {
    entity: PropTypes.instanceOf(Immutable.Map),
    entityName: PropTypes.string.isRequired,
    fields: PropTypes.instanceOf(Immutable.List),
    editable: PropTypes.bool,
    onChangeField: PropTypes.func,
    dispatch: PropTypes.func.isRequired,
  };

  static defaultProps = {
    entity: Immutable.Map(),
    fields: Immutable.List(),
    editable: true,
    onChangeField: () => {},
  }

  componentDidMount() {
    const { entityName, fields } = this.props;
    if (fields.isEmpty()) {
      this.props.dispatch(getSettings(entityName));
    }
  }

  filterPrinableFields = field => (field.get('display', false) !== false && field.get('editable', false) !== false);

  onChangeField = (field, e) => {
    const { value } = e.target;
    this.props.onChangeField(field, value);
  }

  renderField = (field, key) => {
    const { entity, editable } = this.props;
    const fieldName = field.get('field_name', '');
    const fieldNamePath = fieldName.split('.');
    const value = entity.getIn(fieldNamePath, '');
    const onChange = (e) => {
      this.onChangeField(fieldNamePath, e);
    };
    return (
      <FormGroup controlId={fieldName} key={key} >
        <Col componentClass={ControlLabel} sm={3} lg={2}>
          { field.get('title', fieldName) }
        </Col>
        <Col sm={8} lg={9}>
          <Field onChange={onChange} id={fieldName} value={value} editable={editable} />
        </Col>
      </FormGroup>
    );
  };

  renderFields = () => {
    const { fields } = this.props;
    return fields
      .filter(this.filterPrinableFields)
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
