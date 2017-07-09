import React, { PropTypes } from 'react';
import { FormGroup, ControlLabel, Col, Label, InputGroup, HelpBlock } from 'react-bootstrap';
import Select from 'react-select';


const MapField = (props) => {
  const { mapFrom, mapTo, defaultValue, options } = props;

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

  const mandatory = (mapFrom.mandatory && defaultValue.length === 0) ? <span className="danger-red"> *</span> : '';
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
        {defaultValue.length > 0 && (
          <HelpBlock className="mb0 mt0">
            Default value if no value is selected:&nbsp;
            <Label bsStyle="primary" style={{ padding: '1px 6px', fontWeight: 'bold' }} >
              {defaultValue}
            </Label>
          </HelpBlock>
        )}
      </Col>
    </FormGroup>
  );
};

MapField.defaultProps = {
  mapFrom: '',
  mapTo: '',
  defaultValue: '',
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
  defaultValue: PropTypes.string,
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
