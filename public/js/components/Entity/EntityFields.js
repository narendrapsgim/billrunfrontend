import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { FormGroup, Col, ControlLabel } from 'react-bootstrap';
import Field from '../Field';
import { getSettings } from '../../actions/settingsActions';

class EntityFields extends Component {
  static defaultProps = {
    entity: Immutable.Map(),
    fields: Immutable.List(),
    onChangeField: () => {},
    editable: true,
  };

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    entityName: PropTypes.string.isRequired,
    entity: PropTypes.instanceOf(Immutable.Map),
    fields: PropTypes.instanceOf(Immutable.List),
    onChangeField: PropTypes.func,
    editable: PropTypes.bool,
  };

  componentDidMount() {
    const { entityName } = this.props;
    this.props.dispatch(getSettings(entityName));
  }

  filterPrinableFields = field => (field.get('display', false) !== false && field.get('editable', false) !== false);

  hasFieldsToDisplay = () => {
    const { fields } = this.props;
    return !fields
      .filter(this.filterPrinableFields)
      .isEmpty();
  }

  onChangeField = (field, e) => {
    const { value } = e.target;
    this.props.onChangeField(field, value);
  }

  renderField = (field, key) => {
    const { entity, editable } = this.props;
    const fieldName = field.get('field_name', '');
    const fieldNamePath = fieldName.split('.');
    return (
      <FormGroup controlId={fieldName} key={key} >
        <Col componentClass={ControlLabel} sm={3} lg={2}>
          { field.get('title', fieldName) }
        </Col>
        <Col sm={8} lg={9}>
          {editable
            ? <Field onChange={this.onChangeField.bind(this, fieldNamePath)} id={fieldName} value={entity.getIn(fieldNamePath, '')} />
            : entity.get(fieldName, '')
          }
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
    return (this.hasFieldsToDisplay() &&
      <div>
        { this.renderFields() }
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  fields: state.settings.getIn([props.entityName, 'fields']),
});

export default withRouter(connect(mapStateToProps)(EntityFields));
