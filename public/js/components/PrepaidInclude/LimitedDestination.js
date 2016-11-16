import React from 'react';
import { connect } from 'react-redux';

import { Panel } from 'react-bootstrap';
import Select from 'react-select';

const LimitedDestination = (props) => {
  const onChange = (value) => {
    props.onChange(props.name, value.split(','));
  };

  const { name, rates, allRates } = props;

  return (
    <div className="LimitedDestination">
      <Panel header={ <h3>{ name }</h3> }>
        <Select multi={ true }
                value={ rates.join(',') }
                options={ allRates }
                onChange={ onChange } />
      </Panel>
    </div>
  );
};

export default connect()(LimitedDestination);
