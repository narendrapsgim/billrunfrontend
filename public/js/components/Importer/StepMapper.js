import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import { Col, Label, FormGroup, ControlLabel } from 'react-bootstrap';
import Select from 'react-select';
import MapField from './MapField';


const StepMapper = (props) => {
  const { item, fields, mapperPrefix } = props;
  const fileContent = item.get('fileContent', []) || [];
  const linkerField = item.getIn(['linker', 'field'], '') || '';
  const linkerValue = item.getIn(['linker', 'value'], '') || '';
  const headers = fileContent[0];

  const onChangeLinkerField = (value) => {
    if (value !== '') {
      props.onChange(['linker', 'field'], value);
    } else {
      props.onDelete(['linker', 'field']);
    }
  };
  const onChangeLinkerValue = (value) => {
    if (value !== '') {
      props.onChange(['linker', 'value'], value);
    } else {
      props.onDelete(['linker', 'value']);
    }
  };

  const soptFields = (f1, f2) => {
    // Sort by : mandatory -> unique -> other by ABC
    if (f1.mandatory && !f2.mandatory) {
      return -1;
    }
    if (!f1.mandatory && f2.mandatory) {
      return 1;
    }
    if (f1.unique && !f2.unique) {
      return -1;
    }
    if (!f1.unique && f2.unique) {
      return 1;
    }
    return f1.label > f2.label ? 1 : -1;
  };

  const filterFields = field => // filter : only Not generated and editabe fields
    (!field.generated && field.editable && (!field.hasOwnProperty('linker') || !field.linker));

  const renderLinkers = () => {
    const linkersOptions = fields
      .filter(field => (field.hasOwnProperty('linker') && field.linker))
      .map(field => ({
        value: field.value,
        label: field.label,
      }));

    const csvFields = headers.map((option, index) => ({
      label: option,
      value: `${mapperPrefix}${index}`,
    }));

    if (linkersOptions.length === 0) {
      return null;
    }

    return (
      <div>
        <FormGroup>
          <Col sm={3} componentClass={ControlLabel}>Link to field</Col>
          <Col sm={9}>
            <Select
              onChange={onChangeLinkerField}
              options={linkersOptions}
              value={linkerField}
              placeholder="Select field to link..."
            />
          </Col>
        </FormGroup>
        <FormGroup>
          <Col sm={3} componentClass={ControlLabel}>Link by value from</Col>
          <Col sm={9}>
            <Select
              onChange={onChangeLinkerValue}
              options={csvFields}
              value={linkerValue}
              placeholder="Select CSV field to link..."
            />
          </Col>
        </FormGroup>
      </div>
    );
  };

  const renderFields = () => fields
    .filter(filterFields)
    .sort(soptFields)
    .map(field => (
      <MapField
        key={`header_${field.value}`}
        mapFrom={field}
        mapTo={item.getIn(['map', field.value], '')}
        options={headers}
        mapperPrefix={mapperPrefix}
        onChange={props.onChange}
        onDelete={props.onDelete}
      />
  ));

  const renderContent = () => {
    if (fileContent.length === 0) {
      return (<Label bsStyle="default">Please upload file.</Label>);
    }
    if (headers.length === 0) {
      return (<Label bsStyle="default">No CSV headers was found, please check your file.</Label>);
    }

    const mapfields = renderFields();
    const linkers = renderLinkers();

    return (
      <div>
        <div>{mapfields}</div>
        {linkers !== null && (
          <div>
            <hr />
            <h4>Linker</h4>
            {linkers}
          </div>
        )}
      </div>
    );
  };

  return (
    <Col md={12} className="StepMapper scrollbox">
      {renderContent()}
    </Col>
  );
};

StepMapper.defaultProps = {
  item: Immutable.Map(),
  fields: [],
  mapperPrefix: '',
  onChange: () => {},
  onDelete: () => {},
};

StepMapper.propTypes = {
  item: PropTypes.instanceOf(Immutable.Map),
  fields: PropTypes.array,
  mapperPrefix: PropTypes.string,
  onChange: PropTypes.func,
  onDelete: PropTypes.func,
};

export default StepMapper;
