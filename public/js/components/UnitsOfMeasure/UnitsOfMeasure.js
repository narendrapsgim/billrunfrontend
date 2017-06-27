import React, { PropTypes, Component } from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { Col, ControlLabel } from 'react-bootstrap';
import Select from 'react-select';
import { propertyTypeSelector } from '../../selectors/settingsSelector';

class UnitsOfMeasure extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    propertyTypes: PropTypes.instanceOf(Immutable.List),
    propertyType: PropTypes.string,
    unit: PropTypes.string,
    onChange: PropTypes.func,
    propertyTypeLabel: PropTypes.string,
    unitLabel: PropTypes.string,
  };

  static defaultProps = {
    propertyTypes: Immutable.List(),
    propertyType: '',
    unit: '',
    onChange: () => {},
    propertyTypeLabel: 'Property Type',
    unitLabel: 'Unit',
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
    this.props.onChange('property_type', value);
  }

  onChangeUnit = (value) => {
    this.props.onChange('unit', value);
  }

  render() {
    const { propertyType, unit, propertyTypeLabel, unitLabel } = this.props;

    return (
      <div>
        <Col componentClass={ControlLabel} md={4}>
          {propertyTypeLabel}
        </Col>
        <Col sm={5}>
          <Select
            onChange={this.onChange}
            value={propertyType}
            options={this.getAvailablePropertyTypes()}
          />
        </Col>

        <Col componentClass={ControlLabel} md={4}>
          {unitLabel}
        </Col>
        <Col sm={5}>
          <Select
            onChange={this.onChange}
            value={unit}
            options={this.getAvailableUnitsOfMeasure()}
          />
        </Col>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  propertyTypes: propertyTypeSelector(state, props),
});

export default connect(mapStateToProps)(UnitsOfMeasure);
