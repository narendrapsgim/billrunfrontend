import React from 'react';
import { connect } from 'react-redux';

import { Panel } from 'react-bootstrap';

const limitedDestination_el = (destination) => (
  <Panel>
    { destination.size }
  </Panel>
);

const LimitedDestinations = (props) => {
  return (
    <div className="LimitedDestinations">
      {
        props.limitedDestinations
             .keySeq()
             .map(v => limitedDestination_el(props.limitedDestinations.get(v)))
      }
    </div>
  );
};

export default connect()(LimitedDestinations);
