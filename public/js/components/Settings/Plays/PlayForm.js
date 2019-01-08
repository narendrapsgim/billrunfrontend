import React, { PropTypes } from 'react';
import { Form, FormGroup, Col, ControlLabel } from 'react-bootstrap';
import Immutable from 'immutable';
import Field from '../../Field';


const PlayForm = ({
  item,
  isAllowedDisableAction,
  isAllowedEditName,
  isAllowedEditDefault,
  onChangeName,
  onChangeLabel,
  onChangeDefault,
  onChangeEnabled,
}) => (
  <Form horizontal>
    {isAllowedEditName && (
      <FormGroup>
        <Col componentClass={ControlLabel} sm={3}>
          Name
        </Col>
        <Col sm={7}>
          <Field
            onChange={onChangeName}
            value={item.get('name', '')}
          />
        </Col>
      </FormGroup>
    )}
    <FormGroup>
      <Col componentClass={ControlLabel} sm={3}>
        Description
      </Col>
      <Col sm={7}>
        <Field
          onChange={onChangeLabel}
          value={item.get('label', '')}
        />
      </Col>
    </FormGroup>
    {isAllowedEditDefault && (
      <FormGroup>
        <Col sm={7} smOffset={3}>
          <Field
            fieldType="checkbox"
            label="Default"
            value={item.get('default', false)}
            onChange={onChangeDefault}
          />
        </Col>
      </FormGroup>
    )}
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

PlayForm.propTypes = {
  item: PropTypes.instanceOf(Immutable.Map),
  isAllowedDisableAction: PropTypes.bool,
  isAllowedEditName: PropTypes.bool,
  isAllowedEditDefault: PropTypes.bool,
  onChangeName: PropTypes.func.isRequired,
  onChangeLabel: PropTypes.func.isRequired,
  onChangeDefault: PropTypes.func.isRequired,
  onChangeEnabled: PropTypes.func.isRequired,
};

PlayForm.defaultProps = {
  item: Immutable.Map(),
  isAllowedDisableAction: true,
  isAllowedEditName: true,
  isAllowedEditDefault: true,
};

export default PlayForm;
