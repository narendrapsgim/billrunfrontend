import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import { FormGroup, ControlLabel, Col } from 'react-bootstrap';
import Field from '../Field';
import { getFieldName, getFieldNameType } from '../../common/Util';

const StepValidate = (props) => {
  const rows = props.getFormatedRows(1);
  const entity = props.item.get('entity', '');

  return (
    <Col md={12} className="StepValidate">
      <h4>Example Import</h4>
      <hr />
      <div>
        { rows.get(0, Immutable.Map()).map((value, fieldName) => (
          <FormGroup key={fieldName}>
            <Col sm={3} componentClass={ControlLabel}>
              {getFieldName(fieldName, getFieldNameType(entity))}
            </Col>
            <Col sm={9}>
              <Field value={value} disabled={true} />
            </Col>
          </FormGroup>
        ))
        .toArray()
      }
      </div>
    </Col>
  );
};

StepValidate.propTypes = {
  item: PropTypes.instanceOf(Immutable.Map),
  getFormatedRows: PropTypes.func,
};

StepValidate.defaultProps = {
  item: Immutable.Map(),
  getFormatedRows: () => Immutable.List(),
};

export default StepValidate;
