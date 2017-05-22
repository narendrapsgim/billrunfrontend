import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import { FormGroup, ControlLabel, Col } from 'react-bootstrap';

import Select from 'react-select';


const MapField = (props) => {
  const { mapFrom, mappedTo, index, options, usedOptions } = props;
  const onChange = (value) => {
    props.onChange(['map', index], value);
  };
  const filteredOptions = options.filter(option => (
    option.value === mappedTo
    || (!usedOptions.includes(option.value) && !option.generated)
  ));

  return (
    <FormGroup>
      <Col sm={3} componentClass={ControlLabel}>{mapFrom}</Col>
      <Col sm={9}>
        <Select
          onChange={onChange}
          options={filteredOptions}
          value={mappedTo}
          placeholder="Select field to map..."
        />
      </Col>
    </FormGroup>
  );
};

MapField.defaultProps = {
  mapFrom: '',
  mappedTo: '',
  options: [],
  usedOptions: Immutable.List(),
  onChange: () => {},
};

MapField.propTypes = {
  index: PropTypes.number.isRequired,
  mapFrom: PropTypes.string,
  mappedTo: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string
    }),
  ),
  usedOptions: PropTypes.instanceOf(Immutable.List),
  onChange: PropTypes.func,
};

export default MapField;
