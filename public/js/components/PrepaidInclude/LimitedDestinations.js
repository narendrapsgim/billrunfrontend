import React from 'react';
import { connect } from 'react-redux';
import { List } from 'immutable';

import { Panel } from 'react-bootstrap';
import Select from 'react-select';
import Products from '../Plan/components/Products';

const LimitedDestination = connect()((props) => {
  const onChange = (value) => {
    props.onChange(props.name, value.split(','));
  };

  return (
    <Panel header={ <h3>{ props.name }</h3> }>
      <Select multi={ true }
              value={ props.rates.join(',') }
              onChange={ onChange } />
    </Panel>
  );
});

const LimitedDestinations = (props) => (
  <div className="LimitedDestinations">
    {
      props.limitedDestinations
           .keySeq()
           .map(name => (
             <LimitedDestination
                 rates={ props.limitedDestinations.get(name, List()) }
                 onChange={ props.onChange }
                 name={ name }
             />
           ))
    }
  </div>
);

export default connect()(LimitedDestinations);
