import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { Form, FormGroup, Col } from 'react-bootstrap';
import Field from '@/components/Field';


const Allowances = ({ data, onChange }) => {

  const onChangeValue = (key, value) => {
    onChange('billrun', ['allowances', key], value);
  }

  const onToggleAllowances = (e) => {
    const { value } = e.target;
    onChangeValue('enabled', value);
  }

  const onToggleIncludedInAllowance = (e) => {
    const { value } = e.target;
    onChangeValue('included_in_allowance', value);
  }

  const onToggleTaxablePaidFirst = (e) => {
    const { value } = e.target;
    onChangeValue('taxable_paid_first', value);
  }

  return (
    <div className="Allowances">
      <Form horizontal>
        <FormGroup>
          <Col sm={10} smOffset={2} className="mt10">
            <Field
              fieldType="checkbox"
              label="Enabled allowances"
              value={data.getIn(['allowances', 'enabled'], '')}
              onChange={onToggleAllowances}
            />
          </Col>
        </FormGroup>
        <FormGroup>
          <Col sm={10} smOffset={2} className="mt10">
            <Field
              fieldType="checkbox"
              label="Included in allowance"
              value={data.getIn(['allowances', 'included_in_allowance'], '')}
              onChange={onToggleIncludedInAllowance}
            />
          </Col>
        </FormGroup>
        <FormGroup>
          <Col sm={10} smOffset={2} className="mt10">
            <Field
              fieldType="checkbox"
              label="Taxable paid first"
              value={data.getIn(['allowances', 'taxable_paid_first'], '')}
              onChange={onToggleTaxablePaidFirst}
            />
          </Col>
        </FormGroup>
      </Form>
    </div>
  );
}

Allowances.defaultProps = {
  data: Immutable.Map(),
};

Allowances.propTypes = {
  data: PropTypes.instanceOf(Immutable.Map),
  onChange: PropTypes.func.isRequired,
};

export default Allowances;
