import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import { Form, FormGroup, Col, ControlLabel } from 'react-bootstrap';
import Select from 'react-select';
import Field from '../../Field';
import { ModalWrapper } from '../../Elements';

const UsageTypeForm = ({ item, onCancel, onSave, onUpdateItem, propertyTypes }) => {
  const onChangeField = (e) => {
    const { id, value } = e.target;
    onUpdateItem(id, value);
  };

  const onChangePropertyType = (value) => {
    onUpdateItem(['property_type', 'invoice_uom', 'input_uom'], [value, '', '']);
  };

  const onChangeInvoiceUom = (value) => {
    onUpdateItem('invoice_uom', value);
  };

  const onChangeInputUom = (value) => {
    onUpdateItem('input_uom', value);
  };

  const getAvailablePropertyTypes = () => (propertyTypes.map(prop => ({ value: prop.get('type', ''), label: prop.get('type', '') })).toArray());

  const getUom = propertyType => ((propertyTypes.find(prop => prop.get('type', '') === propertyType) || Immutable.Map()).get('uom', Immutable.List()));

  const getAvailableUom = () => {
    const uom = getUom(item.get('property_type', ''));
    return uom.map(unit => ({ value: unit.get('name', ''), label: unit.get('label', '') })).toArray();
  };

  const uom = getAvailableUom();

  return (
    <ModalWrapper title="Edit Usage Type" show={true} onOk={onSave} onCancel={onCancel} labelOk="Save" >
      <Form horizontal>

        <FormGroup>
          <Col componentClass={ControlLabel} md={4}>
            Usage Type
          </Col>
          <Col sm={5}>
            <Field id="usage_type" onChange={onChangeField} value={item.get('usage_type', '')} />
          </Col>
        </FormGroup>

        <FormGroup>
          <Col componentClass={ControlLabel} md={4}>
            Label
          </Col>
          <Col sm={5}>
            <Field id="label" onChange={onChangeField} value={item.get('label', '')} />
          </Col>
        </FormGroup>

        <FormGroup>
          <Col componentClass={ControlLabel} md={4}>
            Property Type
          </Col>
          <Col sm={5}>
            <Select
              id="property_type"
              onChange={onChangePropertyType}
              value={item.get('property_type', '')}
              options={getAvailablePropertyTypes()}
            />
          </Col>
        </FormGroup>

        <FormGroup>
          <Col componentClass={ControlLabel} md={4}>
            Invoice Unit of Measure
          </Col>
          <Col sm={5}>
            <Select
              id="invoice_uom"
              onChange={onChangeInvoiceUom}
              value={item.get('invoice_uom', '')}
              options={uom}
            />
          </Col>
        </FormGroup>

        <FormGroup>
          <Col componentClass={ControlLabel} md={4}>
            Default Unit of Measure
          </Col>
          <Col sm={5}>
            <Select
              id="input_uom"
              onChange={onChangeInputUom}
              value={item.get('input_uom', '')}
              options={uom}
            />
          </Col>
        </FormGroup>

      </Form>
    </ModalWrapper>
  );
};

UsageTypeForm.propTypes = {
  item: PropTypes.instanceOf(Immutable.Map),
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onUpdateItem: PropTypes.func.isRequired,
  propertyTypes: PropTypes.instanceOf(Immutable.List),
};

UsageTypeForm.defaultProps = {
  item: Immutable.Map(),
  propertyTypes: Immutable.List(),
};

export default UsageTypeForm;
