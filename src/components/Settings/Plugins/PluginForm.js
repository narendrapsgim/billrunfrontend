import React from 'react';
import PropTypes from 'prop-types';
import { Form, FormGroup, Col } from 'react-bootstrap';
import Immutable from 'immutable';
import Field from '@/components/Field';


const PluginForm = ({
  item,
  isAllowedDisableAction,
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
          disabled={!isAllowedDisableAction}
        />
      </Col>
    </FormGroup>
  </Form>
);

PluginForm.propTypes = {
  item: PropTypes.instanceOf(Immutable.Map),
  isAllowedDisableAction: PropTypes.bool,
  onChangeEnabled: PropTypes.func.isRequired,
};

PluginForm.defaultProps = {
  item: Immutable.Map(),
  isAllowedDisableAction: true,
};

export default PluginForm;
