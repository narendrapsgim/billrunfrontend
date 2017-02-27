import React, { PropTypes } from 'react';
import { Form, FormControl, FormGroup, Col, InputGroup, ControlLabel } from 'react-bootstrap';

const Tax = (props) => {
  const { vat } = props;
  const onChange = (e) => {
    const { value } = e.target;
    props.onChange('pricing', 'vat', value);
  };
  return (
    <div className="Security">
      <Form horizontal>
        <FormGroup controlId="vat" key="vat">
          <Col componentClass={ControlLabel} md={2}>
            VAT
          </Col>
          <Col sm={6}>
            <InputGroup>
              <FormControl type="text" name="vat" onChange={onChange} value={vat} />
              <InputGroup.Addon>%</InputGroup.Addon>
            </InputGroup>
          </Col>
        </FormGroup>
      </Form>
    </div>
  );
};

Tax.defaultProps = {
  vat: '',
};

Tax.propTypes = {
  vat: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  onChange: PropTypes.func.isRequired,
};


export default Tax;
