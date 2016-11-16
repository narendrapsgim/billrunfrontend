import React from 'react';
import { connect } from 'react-redux';
import { Map } from 'immutable';

import { Form, Panel } from 'react-bootstrap';
import Select from 'react-select';
import BalanceThreshold from './BalanceThreshold';

const Thresholds = (props) => {
  const { plan, pp_includes } = props;

  const pp_include_name = (pp_id) => {
    return props.pp_includes
		.find(pp => pp.get('external_id') === parseInt(pp_id, 10), Map())
		.get('name');
  };
  
  const threshold_el = (pp_id, key) => {
    const name = pp_include_name(pp_id);
    return (
      <BalanceThreshold key={ key }
			name={ name }
			pp_id={ pp_id }
			value={ plan.getIn(['pp_threshold', pp_id], 0) }
			onChange={ props.onChangeThreshold } />
    );
  };
  
  const options = pp_includes.map(pp => (
    { value: pp.get('external_id').toString(),
      label: pp.get('name') }
  )).toJS();
  
  return (
    <div className="Thresholds">
      <Form horizontal>
	<Panel header={ <h3>Select balance</h3> }>
	  <Select placeholder="Select" options={ options } onChange={ props.onAddBalance } />
	</Panel>
	<hr/>
	<Panel>
	  {
	    plan.get('pp_threshold', Map())
		.keySeq().filter(i => i !== 'on_load')
		.map(threshold_el)
	  }
	</Panel>
      </Form>
    </div>
  );
};

export default connect()(Thresholds);
