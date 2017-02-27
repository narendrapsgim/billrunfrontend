import React, { PropTypes } from 'react';
import Select from 'react-select';
import { Form, FormGroup, Col, ControlLabel } from 'react-bootstrap';


const Currency = (props) => {
  const { data, currencies } = props;
  const onChangeCurrency = (value) => {
    props.onChange('pricing', 'currency', value);
  };
  return (
    <div className="CurrencyTax">
      <Form horizontal>
        <FormGroup controlId="currency" key="currency">
          <Col componentClass={ControlLabel} md={2}>
            Currency
          </Col>
          <Col sm={6}>
            <Select options={currencies} value={data} onChange={onChangeCurrency} />
          </Col>
        </FormGroup>
      </Form>
    </div>
  );
};

Currency.defaultProps = {
  data: '',
  currencies: [],
};

Currency.propTypes = {
  onChange: PropTypes.func.isRequired,
  data: PropTypes.string,
  currencies: PropTypes.arrayOf(React.PropTypes.object),
};


export default Currency;
