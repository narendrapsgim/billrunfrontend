import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import { Form, FormGroup, Col, ControlLabel, HelpBlock } from 'react-bootstrap';
import Select from 'react-select';
import changeCase from 'change-case';
import Field from '../Field';
import { ModalWrapper } from '../Elements';

class UsageTypeForm extends Component {

  static propTypes = {
    item: PropTypes.instanceOf(Immutable.Map),
    onCancel: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    onUpdateItem: PropTypes.func.isRequired,
    propertyTypes: PropTypes.instanceOf(Immutable.List),
    selectUoms: PropTypes.bool,
    editBase: PropTypes.bool,
  };

  static defaultProps = {
    item: Immutable.Map(),
    propertyTypes: Immutable.List(),
    selectUoms: false,
    editBase: true,
  };

  state = {
    activityTypeError: '',
    propertyTypeError: '',
  }

  onChangeField = (e) => {
    const { id, value } = e.target;
    const keys = (id === 'label' ? ['usage_type', 'label'] : [id]);
    const values = (id === 'label' ? [changeCase.snakeCase(value), value] : [value]);
    this.setState({ activityTypeError: value === '' ? 'Activity type required' : '' });
    this.props.onUpdateItem(keys, values);
  };

  onChangePropertyType = (value) => {
    this.setState({ propertyTypeError: value === '' ? 'Property type required' : '' });
    this.props.onUpdateItem(['property_type', 'invoice_uom', 'input_uom'], [value, '', '']);
  };

  onChangeInvoiceUom = (value) => {
    this.props.onUpdateItem('invoice_uom', value);
  };

  onChangeInputUom = (value) => {
    this.props.onUpdateItem('input_uom', value);
  };

  getAvailablePropertyTypes = () => (this.props.propertyTypes.map(prop => ({ value: prop.get('type', ''), label: prop.get('type', '') })).toArray());

  getUom = propertyType => ((this.props.propertyTypes.find(prop => prop.get('type', '') === propertyType) || Immutable.Map()).get('uom', Immutable.List()));

  getAvailableUom = () => {
    const { item } = this.props;
    const uom = this.getUom(item.get('property_type', ''));
    return uom.map(unit => ({ value: unit.get('name', ''), label: unit.get('label', '') })).toArray();
  };

  render() {
    const uom = this.getAvailableUom();
    return (
      <ModalWrapper title="Activity Type" show={true} onOk={this.props.onSave} onCancel={this.props.onCancel} labelOk="OK" >
        <Form horizontal>

          <FormGroup validationState={this.state.activityTypeError !== '' ? 'error' : null}>
            <Col componentClass={ControlLabel} md={4}>
              Activity Type
            </Col>
            <Col sm={5}>
              <Field
                id="label"
                onChange={this.onChangeField}
                value={this.props.item.get('label', '')}
                disabled={!this.props.editBase}
              />
              { this.state.activityTypeError !== '' ? <HelpBlock>{this.state.activityTypeError}</HelpBlock> : ''}
            </Col>

          </FormGroup>

          <FormGroup validationState={this.state.propertyTypeError !== '' ? 'error' : null}>
            <Col componentClass={ControlLabel} md={4}>
              Property Type
            </Col>
            <Col sm={5}>
              <Select
                id="property_type"
                onChange={this.onChangePropertyType}
                value={this.props.item.get('property_type', '')}
                options={this.getAvailablePropertyTypes()}
                disabled={!this.props.editBase}
              />
              { this.state.propertyTypeError !== '' ? <HelpBlock>{this.state.propertyTypeError}</HelpBlock> : ''}
            </Col>
          </FormGroup>

          {this.props.selectUoms &&
            [(<FormGroup>
              <Col componentClass={ControlLabel} md={4}>
                Invoice Unit of Measure
              </Col>
              <Col sm={5}>
                <Select
                  id="invoice_uom"
                  onChange={this.onChangeInvoiceUom}
                  value={this.props.item.get('invoice_uom', '')}
                  options={uom}
                />
              </Col>
            </FormGroup>),
            (<FormGroup>
              <Col componentClass={ControlLabel} md={4}>
                Default Unit of Measure
              </Col>
              <Col sm={5}>
                <Select
                  id="input_uom"
                  onChange={this.onChangeInputUom}
                  value={this.props.item.get('input_uom', '')}
                  options={uom}
                />
              </Col>
            </FormGroup>)]
        }

        </Form>
      </ModalWrapper>
    );
  }
}

export default UsageTypeForm;
