import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import { FormGroup, ControlLabel, Col, Panel } from 'react-bootstrap';
import Field from '../Field';

const StepValidate = ({ fields, getFormatedRows }) => {
  const rows = getFormatedRows(1);

  const renderLinker = (linker, fieldName) => {
    const curField = fields.find(field => field.value === linker.get('field', ''));
    return (
      <Panel header="Linker" className="mb0" key={`linker-${fieldName}`}>
        <FormGroup>
          <Col sm={3} componentClass={ControlLabel}>
            { curField ? curField.label : linker.get('field', '') }
          </Col>
          <Col sm={9}>
            <Field value={linker.get('value', '')} disabled={true} />
          </Col>
        </FormGroup>
      </Panel>
    );
  };

  const renderValue = (value, field) => {
    switch (field.type) {
      case 'ranges':
      case 'range':
        return (
          <Field value={value} disabled={true} fieldType={field.type} compact={true} removable={false} />
        );
      default: return (
        <Field value={value} disabled={true} />
      );
    }
  };

  const renderRow = (value, fieldName) => {
    const curField = fields.find(field => field.value === fieldName);
    return (
      <FormGroup key={fieldName}>
        <Col sm={3} componentClass={ControlLabel}>
          { curField ? curField.label : fieldName }
        </Col>
        <Col sm={9}>
          { renderValue(value, curField) }
        </Col>
      </FormGroup>
    );
  };

  return (
    <div className="StepValidate">
      <div className="row-fields scrollbox">
        { rows
          .get(0, Immutable.Map())
          .filter((value, fieldName) => fieldName !== '__LINKER__')
          .map(renderRow)
          .toArray()
        }
        { rows
          .get(0, Immutable.Map())
          .filter((value, fieldName) => fieldName === '__LINKER__')
          .map(renderLinker)
          .toArray()
        }
      </div>
    </div>
  );
};

StepValidate.propTypes = {
  fields: PropTypes.array,
  getFormatedRows: PropTypes.func,
};

StepValidate.defaultProps = {
  fields: [],
  getFormatedRows: () => Immutable.List(),
};

export default StepValidate;
