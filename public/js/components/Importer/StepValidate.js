import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import { FormGroup, ControlLabel, Col } from 'react-bootstrap';
import Field from '../Field';

const StepValidate = ({ fields, getFormatedRows }) => {
  const rows = getFormatedRows(1);

  const renderLinker = linker => (
    <div key="linker-validate">
      <hr />
      <h5>Linker</h5>
      <FormGroup>
        <Col sm={3} componentClass={ControlLabel}>
          { linker.get('field', '') }
        </Col>
        <Col sm={9}>
          <Field value={linker.get('value', '')} disabled={true} />
        </Col>
      </FormGroup>
    </div>
  );

  const renderRow = (value, fieldName) => {
    const curField = fields.find(field => field.value === fieldName);
    return (
      <FormGroup key={fieldName}>
        <Col sm={3} componentClass={ControlLabel}>
          { curField ? curField.label : fieldName }
        </Col>
        <Col sm={9}>
          <Field value={value} disabled={true} />
        </Col>
      </FormGroup>
    );
  };

  return (
    <Col md={12} className="StepValidate">
      <h4>Example Import</h4>
      <hr style={{ marginTop: 10 }} />
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
    </Col>
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
