import React from 'react';
import PropTypes from 'prop-types';
import { Form, FormGroup, Col } from 'react-bootstrap';
import Immutable from 'immutable';
import Field from '@/components/Field';


const PluginForm = ({
  item,
  onChangeEnabled,
}) => (
  <Form horizontal>
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
};

PluginForm.defaultProps = {
  item: Immutable.Map(),
};

export default PluginForm;
