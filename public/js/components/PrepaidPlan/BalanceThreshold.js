import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormGroup, Col, ControlLabel } from 'react-bootstrap';
import Field from '../Field';

const BalanceThreshold = (props) => {
  const { name, ppId, value, editable } = props;

  const onChange = (e) => {
    props.onChange(ppId, e.target.value);
  };

  return (
    <FormGroup>
      <Col componentClass={ControlLabel} md={2}>
        { name }
      </Col>
      <Col md={9}>
        <Field fieldType="number" onChange={onChange} value={value} editable={editable} />
      </Col>
    </FormGroup>
  );
};


BalanceThreshold.defaultProps = {
  name: '',
  value: '',
  ppId: '',
  editable: true,
};

BalanceThreshold.propTypes = {
  name: PropTypes.string,
  editable: PropTypes.bool,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  ppId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  onChange: PropTypes.func.isRequired,
};

export default connect()(BalanceThreshold);
