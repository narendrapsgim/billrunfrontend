import React, { PropTypes } from 'react';
import { FormGroup, ControlLabel, Col, Label, InputGroup } from 'react-bootstrap';
import Select from 'react-select';


const MapField = (props) => {
  const { mapFrom, mappedTo, options } = props;
  const onChange = (value) => {
    if (value !== '') {
      const scvIndex = isNaN(value) ? value : value - 1;// fix react-selet 0 as value
      props.onChange(['map', mapFrom.value], scvIndex);
    } else {
      props.onDelete(['map', mapFrom.value]);
    }
  };

  const filteredOptions = options.map((option, key) => ({
    label: option,
    value: key + 1, // fix react-selet 0 as value
  }));

  const value = (isNaN(mappedTo) || mappedTo === '') ? mappedTo : mappedTo + 1; // fix react-selet 0 as value

  const selectFiled = () => (
    <Select
      allowCreate={true}
      onChange={onChange}
      options={filteredOptions}
      value={value}
      placeholder="Select CSV field or set default value..."
      addLabelText={'Click to set default value "{label}" for all rows'}
    />
);

  const mandatory = mapFrom.mandatory ? <span className="danger-red"> *</span> : '';
  const unique = mapFrom.unique ? <Label bsStyle="info">Unique field</Label> : '';
  return (
    <FormGroup>
      <Col sm={3} componentClass={ControlLabel}>{mapFrom.label}{mandatory}</Col>
      <Col sm={9}>
        { unique === ''
          ? selectFiled()
          : (
            <InputGroup>
              {selectFiled()}
              <InputGroup.Addon>{unique}</InputGroup.Addon>
            </InputGroup>
          )
        }
      </Col>
    </FormGroup>
  );
};

MapField.defaultProps = {
  mapFrom: '',
  mappedTo: '',
  options: [],
  onChange: () => {},
  onDelete: () => {},
};

MapField.propTypes = {
  mapFrom: PropTypes.object,
  mappedTo: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  options: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func,
  onDelete: PropTypes.func,
};

export default MapField;
