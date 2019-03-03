import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import { Col, Label, FormGroup, ControlLabel, Panel } from 'react-bootstrap';
import Select from 'react-select';
import MapField from './MapField';


const StepMapper = (props) => {
  const { item, fields, ignoredHeaders, mapperPrefix, defaultFieldsValues } = props;
  const fileContent = item.get('fileContent', []) || [];
  const linkerField = item.getIn(['linker', 'field'], '') || '';
  const linkerValue = item.getIn(['linker', 'value'], '') || '';
  const headers = fileContent[0] || [];

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

    const indexf1 = fields.findIndex(field => field.value === f1.value);
    const indexf2 = fields.findIndex(field => field.value === f2.value);
    return indexf1 > indexf2 ? 1 : -1;
  };

  const filterFields = field => // filter : only Not generated and editabe fields
    (!field.generated && field.editable && (!field.hasOwnProperty('linker') || !field.linker));

  const csvHeaders = headers
    .map((header, key) => ({
      label: header,
      value: `${mapperPrefix}${key}`,
    }))
    .filter(option => !ignoredHeaders.includes(option.label));

  const renderLinkers = () => {
    const linkersOptions = fields
      .filter(field => (field.hasOwnProperty('linker') && field.linker))
      .map(field => ({
        value: field.value,
        label: field.label,
      }));

    if (linkersOptions.length === 0) {
      return null;
    }

    return (
      <div>
        <FormGroup>
          <Col sm={3} componentClass={ControlLabel}>Link to field<span className="danger-red"> *</span></Col>
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
          <Col sm={3} componentClass={ControlLabel}>Link by value from<span className="danger-red"> *</span></Col>
          <Col sm={9}>
            <Select
              onChange={onChangeLinkerValue}
              options={csvHeaders}
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
    .map((field) => {
      const defaultValue = defaultFieldsValues.find(def => def.key === field.value);
      return (
        <MapField
          key={`header_${field.value}`}
          defaultValue={defaultValue ? defaultValue.value : undefined}
          mapFrom={field}
          mapTo={item.getIn(['map', field.value], '')}
          options={csvHeaders}
          mapperPrefix={mapperPrefix}
          onChange={props.onChange}
          onDelete={props.onDelete}
        />
      );
    });

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
          <Panel header="Linker" className="mb0">
            {linkers}
          </Panel>
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
  defaultFieldsValues: [],
  ignoredHeaders: [],
  mapperPrefix: '',
  onChange: () => {},
  onDelete: () => {},
};

StepMapper.propTypes = {
  item: PropTypes.instanceOf(Immutable.Map),
  fields: PropTypes.array,
  defaultFieldsValues: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      value: PropTypes.string,
    }),
  ),
  ignoredHeaders: PropTypes.array,
  mapperPrefix: PropTypes.string,
  onChange: PropTypes.func,
  onDelete: PropTypes.func,
};

export default StepMapper;
