import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { List } from 'immutable';
import { Panel } from 'react-bootstrap';
import Select from 'react-select';

const LimitedDestination = ({ name, rates, allRates, onChange }) => {
  const onChangeValue = (value) => {
    onChange(name, value.split(','));
  };

  return (
    <div className="LimitedDestination">
      <Panel header={<h3>{ name }</h3>}>
        <Select
          multi={true}
          value={rates.join(',')}
          options={allRates}
          onChange={onChangeValue}
        />
      </Panel>
    </div>
  );
};

LimitedDestination.defaultProps = {
  name: '',
  rates: List(),
  allRates: [],
};

LimitedDestination.propTypes = {
  name: PropTypes.string,
  rates: PropTypes.instanceOf(List),
  allRates: PropTypes.array,
  onChange: PropTypes.func.isRequired,
};

export default connect()(LimitedDestination);
