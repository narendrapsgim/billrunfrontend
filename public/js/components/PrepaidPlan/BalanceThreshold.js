import React from 'react';
import { connect } from 'react-redux';

import { FormGroup, Col, ControlLabel, FormControl } from 'react-bootstrap';

const BalanceThreshold = (props) => {
  const { name, pp_id, value } = props;

  const onChange = (e) => {
    props.onChange(pp_id, e.target.value);
  };
  
  return (
    <FormGroup>
      <Col componentClass={ ControlLabel } md={ 2 }>
	{ name }
      </Col>
      <Col md={ 9 }>
	<FormControl type="number"
		     onChange={ onChange }
		     value={ value }
	/>
      </Col>
    </FormGroup>
  );
};

export default connect()(BalanceThreshold);
