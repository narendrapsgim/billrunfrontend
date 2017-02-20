import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormGroup, Col, ControlLabel, FormControl } from 'react-bootstrap';

const BalanceThreshold = (props) => {
  const { name, ppId, value } = props;

  const onChange = (e) => {
    props.onChange(ppId, e.target.value);
  };

  return (
    <FormGroup>
      <Col componentClass={ControlLabel} md={2}>
        { name }
      </Col>
      <Col md={9}>
        <FormControl type="number" onChange={onChange} value={value} />
      </Col>
    </FormGroup>
  );
};


BalanceThreshold.defaultProps = {
  name: '',
  value: '',
  ppId: '',
};

BalanceThreshold.propTypes = {
  name: PropTypes.string,
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
