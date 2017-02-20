import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Map, List } from 'immutable';
import { Panel } from 'react-bootstrap';
import LimitedDestination from './LimitedDestination';
import PlanSearch from '../Elements/PlanSearch';

const LimitedDestinations = ({ onSelectPlan, limitedDestinations, onChange, allRates }) => (
  <div className="LimitedDestinations">
    <Panel>
      <PlanSearch onSelectPlan={onSelectPlan} />
    </Panel>
    <LimitedDestination
      rates={limitedDestinations.get('BASE', List())}
      onChange={onChange}
      allRates={allRates}
      name="BASE"
    />
    {
      limitedDestinations
           .keySeq()
           .filter(n => n !== 'BASE')
           .map((name, key) => (
             <LimitedDestination
               key={key}
               rates={limitedDestinations.get(name, List())}
               onChange={onChange}
               allRates={allRates}
               name={name}
             />
           ))
    }
  </div>
);

LimitedDestinations.defaultProps = {
  limitedDestinations: Map(),
  allRates: [],
};

LimitedDestinations.propTypes = {
  limitedDestinations: PropTypes.instanceOf(Map),
  allRates: PropTypes.array,
  onSelectPlan: React.PropTypes.func.isRequired,
  onChange: React.PropTypes.func.isRequired,
};

export default connect()(LimitedDestinations);
