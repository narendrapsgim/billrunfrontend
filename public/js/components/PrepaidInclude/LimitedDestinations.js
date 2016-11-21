import React from 'react';
import { connect } from 'react-redux';
import { List } from 'immutable';

import LimitedDestination from './LimitedDestination';
import { Panel } from 'react-bootstrap';
import PlanSearch from '../Elements/PlanSearch';

const LimitedDestinations = (props) => (
  <div className="LimitedDestinations">
    <Panel>
      <PlanSearch onSelectPlan={ props.onSelectPlan } />
    </Panel>
    <LimitedDestination
        rates={ props.limitedDestinations.get("BASE", List()) }
        onChange={ props.onChange }
        allRates={ props.allRates }
        name="BASE"
    />
    {
      props.limitedDestinations
           .keySeq()
           .filter(n => n !== 'BASE')
           .map((name, key) => (
             <LimitedDestination
                 key={ key }
                 rates={ props.limitedDestinations.get(name, List()) }
                 onChange={ props.onChange }
                 allRates={ props.allRates }
                 name={ name }
             />
           ))
    }
  </div>
);

export default connect()(LimitedDestinations);
