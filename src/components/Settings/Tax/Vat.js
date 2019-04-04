import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { InputGroup, FormGroup, Col, ControlLabel } from 'react-bootstrap';
import Field from '@/components/Field';

const Vat = ({ vat, disabled, onChange }) => (
  <div className="vat">
    <FormGroup>
      <Col componentClass={ControlLabel} md={2}>
        VAT
      </Col>
      <Col sm={6}>
        <InputGroup>
          <Field onChange={onChange} value={vat} disabled={disabled} />
          <InputGroup.Addon>%</InputGroup.Addon>
        </InputGroup>
      </Col>
    </FormGroup>
  </div>
);

Vat.defaultProps = {
  vat: '',
  disabled: Immutable.Map(),
  onChange: () => {},
};

Vat.propTypes = {
  vat: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
};

export default Vat;
