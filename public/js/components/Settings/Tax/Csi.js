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
    fileTypes: Immutable.Map(),
    disabled: false,
    onChange: () => {},
  };

  shouldComponentUpdate(nextProps, nextState) { // eslint-disable-line no-unused-vars
    return this.props.disabled !== nextProps.disabled
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
    return csi.get('providers', ['03']).map(option => (
      <option key={option} value={option}>{option}</option>
    ));
  }

  onChangeTaxationMapping = (fileType, filed, value) => {
    const { csi } = this.props;
    const newCSI = csi.update('taxation_mapping', Immutable.List(), (list) => {
      const taxationMapIndex = list.findIndex(taxationMap => taxationMap.get('file_type', '') === fileType);
      if (taxationMapIndex === -1) {
        const newTaxationMap = Immutable.Map({
          file_type: fileType,
          [filed]: value,
        });
        return list.push(newTaxationMap);
      }
      return list.setIn([taxationMapIndex, filed], value);
    });
    this.props.onChange(newCSI);
  }

  renderTaxationMapping = () => {
    const { csi, fileTypes, disabled } = this.props;
    return fileTypes.map((inputProssesor, idx) => {
      const mapper = csi
        .get('taxation_mapping', Immutable.List())
        .find(taxationMap => taxationMap.get('file_type', '') === inputProssesor.get('file_type', ''),
          null,
          Immutable.Map()
        );
      return (
        <CsiMapper
          key={idx}
          fileType={inputProssesor}
          csiMap={mapper}
          disabled={disabled}
          onChange={this.onChangeTaxationMapping}
        />
      );
    }).toArray();
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
