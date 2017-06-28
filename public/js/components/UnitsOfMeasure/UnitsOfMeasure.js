import React, { PropTypes, Component } from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { InputGroup } from 'react-bootstrap';
import Select from 'react-select';
import { propertyTypeSelector } from '../../selectors/settingsSelector';

class UnitsOfMeasure extends Component {

  static propTypes = {
    propertyTypes: PropTypes.instanceOf(Immutable.List),
    propertyType: PropTypes.string,
    propertyTypeFieldName: PropTypes.string,
    unit: PropTypes.string,
    unitFieldName: PropTypes.string,
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
  };

  static defaultProps = {
    propertyTypes: Immutable.List(),
    propertyType: '',
    propertyTypeFieldName: 'property_type',
    unit: '',
    unitFieldName: 'unit',
    onChange: () => {},
    disabled: false,
  };

  getAvailablePropertyTypes = () => {
    const { propertyTypes } = this.props;
    return propertyTypes.map(prop => ({ value: prop.get('type', ''), label: prop.get('type', '') })).toArray();
  };

  getAvailableUnitsOfMeasure = () => {
    const { propertyTypes, propertyType } = this.props;
    const uom = (propertyTypes.find(prop => prop.get('type', '') === propertyType) || Immutable.Map()).get('uom', Immutable.List());
    return uom.map(unit => ({ value: unit.get('name', ''), label: unit.get('label', '') })).toArray();
  };

  onChangePropertyType = (value) => {
    const { propertyTypeFieldName } = this.props;
    this.props.onChange(propertyTypeFieldName, value);
    this.onChangeUnit('');
  }

  onChangeUnit = (value) => {
    const { unitFieldName } = this.props;
    this.props.onChange(unitFieldName, value);
  }

  render() {
    const { propertyType, unit, disabled } = this.props;

    return (
      <InputGroup>
        <Select
          onChange={this.onChangePropertyType}
          value={propertyType}
          options={this.getAvailablePropertyTypes()}
          disabled={disabled}
        />
        <Select
          onChange={this.onChangeUnit}
          value={unit}
          options={this.getAvailableUnitsOfMeasure()}
          disabled={disabled}
        />
      </InputGroup>
    );
  }
}

const mapStateToProps = (state, props) => ({
  propertyTypes: propertyTypeSelector(state, props),
});

export default connect(mapStateToProps)(UnitsOfMeasure);
