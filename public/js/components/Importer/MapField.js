import React, { PropTypes } from 'react';
import { FormGroup, ControlLabel, Col, Label, InputGroup } from 'react-bootstrap';
import Select from 'react-select';


const MapField = (props) => {
  const { mapFrom, mapTo, options } = props;

  const onChange = (value) => {
    if (value !== '') {
      props.onChange(['map', mapFrom.value], value);
    } else {
      props.onDelete(['map', mapFrom.value]);
    }
  };

  const selectFiled = () => (
    <Select
      allowCreate={true}
      onChange={onChange}
      options={options}
      value={mapTo}
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
  mapTo: '',
  options: [],
  onChange: () => {},
  onDelete: () => {},
};

MapField.propTypes = {
  mapFrom: PropTypes.object,
  mapTo: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    }),
  ),
  onChange: PropTypes.func,
  onDelete: PropTypes.func,
};

export default MapField;
