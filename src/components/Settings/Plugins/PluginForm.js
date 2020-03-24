import React from 'react';
import PropTypes from 'prop-types';
import { Form, FormGroup, Col } from 'react-bootstrap';
import Immutable from 'immutable';
import Field from '@/components/Field';
import { EntityFields } from '@/components/Entity';


const PluginForm = ({
  item,
  onChangeEnabled,
  onChange,
  onRemove
}) => (
  <Form horizontal>

    <EntityFields
      entityName="plugins"
      entity={item.getIn(['configuration', 'values'], Immutable.Map())}
      onChangeField={onChange}
      onRemoveField={onRemove}
      fields={item.getIn(['configuration', 'fields'], Immutable.List())}
    />

    <FormGroup>
      <Col sm={7} smOffset={3}>
        <Field
          fieldType="checkbox"
          label="Enabled"
          value={item.get('enabled', false)}
          onChange={onChangeEnabled}
        />
      </Col>
    </FormGroup>
  </Form>
);

PluginForm.propTypes = {
  item: PropTypes.instanceOf(Immutable.Map),
  onChangeEnabled: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};

PluginForm.defaultProps = {
  item: Immutable.Map(),
};

export default PluginForm;
