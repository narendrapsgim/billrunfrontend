import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import { FormGroup, ControlLabel, Col } from 'react-bootstrap';
import Select from 'react-select';
import { readAsText } from 'promise-file-reader';


const StepUpload = (props) => {
  const { item, selectedEntity, delimiterOptions, entityOptions } = props;
  const delimiter = item.get('fileDelimiter', '');
  const entity = item.get('entity', '');

  const onfileReset = (e) => {
    e.target.value = null;
  };

  const onfileUpload = (e) => {
    const file = e.target.files[0];
    readAsText(file)
      .then((fileContent) => {
        props.onChange('fileContent', fileContent);
      })
      .catch(() => {
        props.onChange('fileContent', '');
      });
  };

  const onChangeDelimiter = (value) => {
    if (value.length) {
      props.onChange('fileDelimiter', value);
    } else {
      props.onDelete('fileDelimiter');
    }
  };

  const onChangeEntity = (value) => {
    if (value.length) {
      props.onChange('entity', value);
    } else {
      props.onDelete('entity');
    }
  };


  return (
    <Col md={12} className="StepUpload">
      { !selectedEntity && (
        <FormGroup>
          <Col sm={3} componentClass={ControlLabel}>Entity</Col>
          <Col sm={9}>
            <Select
              onChange={onChangeEntity}
              options={entityOptions}
              value={entity}
              placeholder="Select entity to import...."
            />
          </Col>
        </FormGroup>
      )}
      <FormGroup>
        <Col sm={3} componentClass={ControlLabel}>Delimiter</Col>
        <Col sm={9}>
          <Select
            allowCreate
            onChange={onChangeDelimiter}
            options={delimiterOptions}
            value={delimiter}
            placeholder="Select or add new"
            addLabelText="{label}"
          />
        </Col>
      </FormGroup>
      <FormGroup>
        <Col sm={3} componentClass={ControlLabel}>Upload CSV</Col>
        <Col sm={9}>
          <input type="file" accept=".csv" onChange={onfileUpload} onClick={onfileReset} />
        </Col>
      </FormGroup>
    </Col>
  );
};

StepUpload.defaultProps = {
  item: Immutable.Map(),
  selectedEntity: false,
  delimiterOptions: [
    { value: '	', label: 'Tab' }, // eslint-disable-line no-tabs
    { value: ' ', label: 'Space' },
    { value: ',', label: 'Comma (,)' },
  ],
  entityOptions: [
    { value: 'customer', label: 'Customers' }, // eslint-disable-line no-tabs
    { value: 'subscription', label: 'Subscriptions' },
  ],
  onChange: () => {},
  onDelete: () => {},
};

StepUpload.propTypes = {
  item: PropTypes.instanceOf(Immutable.Map),
  selectedEntity: PropTypes.bool,
  delimiterOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    }),
  ),
  entityOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    }),
  ),
  onChange: PropTypes.func,
  onDelete: PropTypes.func,
};

export default StepUpload;
