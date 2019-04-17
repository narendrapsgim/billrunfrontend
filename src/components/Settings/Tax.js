import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { Form, FormGroup, Col, ControlLabel, Panel } from 'react-bootstrap';
import Field from '@/components/Field';
import Csi from './Tax/Csi';


const Tax = ({ data, csiOptions, onChange }) => {

  const isCSI = data.get('tax_type', '') === 'CSI';

  const onChangeTaxType = (e) => {
    const { value } = e.target;
    onChange('taxation', 'tax_type', value);
  }

  const onChangeCsi = (csi) => {
    onChange('taxation', 'CSI', csi);
  }

  return (
    <div className="tax">
      <Form horizontal>
        <FormGroup controlId="tax_type">
          <Col componentClass={ControlLabel} sm={3} lg={2}>
            Tax Type
          </Col>
          <Col sm={8} lg={9}>
            <span style={{ display: 'inline-block', marginRight: 20 }}>
              <Field fieldType="radio" onChange={onChangeTaxType} name="tax_type" value="vat" label="Custom" checked={!isCSI} />
            </span>
            <span style={{ display: 'inline-block' }}>
              <Field fieldType="radio" onChange={onChangeTaxType} name="tax_type" value="CSI" label="CSI" checked={isCSI} />
            </span>
          </Col>
        </FormGroup>
        {isCSI && (<hr />)}
        {isCSI && (
          <Panel header="CSI Configurations">
            <Csi
              csi={data.get('CSI', Immutable.Map())}
              onChange={onChangeCsi}
              fileTypes={csiOptions}
            />
          </Panel>
        )}
      </Form>
    </div>
  );
};

Tax.propTypes = {
  data: PropTypes.instanceOf(Immutable.Map),
  csiOptions: PropTypes.instanceOf(Immutable.Iterable),
  onChange: PropTypes.func.isRequired,
};

Tax.defaultProps = {
  data: Immutable.Map(),
  csiOptions: Immutable.List(),
};

export default Tax;
