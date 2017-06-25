import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import { FormGroup, Col, ControlLabel } from 'react-bootstrap';
import CsiMapper from './CsiMapper';
import Field from '../../Field';


class Csi extends Component {

  static propTypes = {
    csi: PropTypes.instanceOf(Immutable.Map),
    fileTypes: PropTypes.instanceOf(Immutable.Iterable),
    disabled: PropTypes.bool,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    csi: Immutable.Map(),
    fileTypes: Immutable.List(),
    disabled: false,
    onChange: () => {},
  };

  shouldComponentUpdate(nextProps, nextState) { // eslint-disable-line no-unused-vars
    return this.props.disabled !== nextProps.disabled
      || !Immutable.is(this.props.fileTypes, nextProps.fileTypes)
      || !Immutable.is(this.props.csi, nextProps.csi);
  }

  onChangeProvider = (e) => {
    const { value } = e.target;
    const { csi } = this.props;
    const newCSI = csi.set('provider', value);
    this.props.onChange(newCSI);
  }

  onChangeOptionalCharges = (e) => {
    const { value } = e.target;
    const { csi } = this.props;
    const newCSI = csi.set('apply_optional_charges', value);
    this.props.onChange(newCSI);
  }

  onChangeAuthToken = (e) => {
    const { value } = e.target;
    const { csi } = this.props;
    const newCSI = csi.set('auth_code', value);
    this.props.onChange(newCSI);
  }

  renderProviderOptions = () => {
    const { csi } = this.props;
    return csi.get('available_providers',Immutable.Map({})).map((name, key) => (
      <option key={key} value={key}>{name}</option>
    ));
  }

  onChangeTaxationMapping = (fileType, usaget, field, value) => {
    const { csi } = this.props;
    const newCSI = csi.update('taxation_mapping', Immutable.List(), (list) => {
      const taxationMapIndex = list.findIndex(taxationMap => (
        taxationMap.get('file_type', '') === fileType
        && taxationMap.get('usaget', '') === usaget
      ));
      if (taxationMapIndex === -1) {
        const newTaxationMap = Immutable.Map({
          usaget,
          file_type: fileType,
          [field]: value,
        });
        return list.push(newTaxationMap);
      }
      return list.setIn([taxationMapIndex, field], value);
    });
    this.props.onChange(newCSI);
  }

  getMapperFileType = (fileType) => {
    const { csi } = this.props;
    return csi
      .get('taxation_mapping', Immutable.List())
      .find(taxationMap => (
          taxationMap.get('file_type', '') === fileType.get('fileType', '')
          && taxationMap.get('usaget', '') === fileType.get('usageType', '')
        ), null, Immutable.Map()
      );
  }

  renderTaxationMapping = () => {
    const { fileTypes, disabled } = this.props;
    return fileTypes.map((fileType, idx) => (
      <CsiMapper
        key={idx}
        csiMap={this.getMapperFileType(fileType)}
        fileType={fileType.get('fileType', '')}
        usageType={fileType.get('usageType', '')}
        options={fileType.get('customKeys', Immutable.List())}
        disabled={disabled}
        onChange={this.onChangeTaxationMapping}
      />
    )).toArray();
  }

  render() {
    const { csi, disabled } = this.props;
    const checkboxStyle = { marginTop: 10 };
    return (
      <div className="csi">

        <FormGroup>
          <Col componentClass={ControlLabel} md={2}>
            Authentication Token
          </Col>
          <Col sm={6}>
            <Field value={csi.get('auth_code', '')} onChange={this.onChangeAuthToken} disabled={disabled} />
          </Col>
        </FormGroup>

        <FormGroup>
          <Col componentClass={ControlLabel} md={2}>
            Provider
          </Col>
          <Col sm={6}>
            <select value={csi.get('provider', '')} className="form-control" onChange={this.onChangeProvider} disabled={disabled}>
              <option value="">Select...</option>
              { this.renderProviderOptions() }
            </select>
          </Col>
        </FormGroup>

        <FormGroup>
          <Col componentClass={ControlLabel} md={2}>
            Apply Optional Charges
          </Col>
          <Col sm={6} style={checkboxStyle}>
            <Field fieldType="checkbox" value={csi.get('apply_optional_charges', '')} onChange={this.onChangeOptionalCharges} disabled={disabled} />
          </Col>
        </FormGroup>

        { this.renderTaxationMapping() }

      </div>
    );
  }
}

export default Csi;
