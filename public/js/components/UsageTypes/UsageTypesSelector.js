import React, { PropTypes, Component } from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { Button, Col, FormGroup, InputGroup } from 'react-bootstrap';
import Select from 'react-select';
import { getSettings, updateSetting, saveSettings } from '../../actions/settingsActions';
import { usageTypesDataSelector, propertyTypeSelector } from '../../selectors/settingsSelector';
import UsageTypeForm from '../UsageTypes/UsageTypeForm';

class UsageTypesSelector extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    usageTypes: PropTypes.instanceOf(Immutable.List),
    propertyTypes: PropTypes.instanceOf(Immutable.List),
    usaget: PropTypes.string,
    unit: PropTypes.string,
    onChangeUsaget: PropTypes.func,
    onChangeUnit: PropTypes.func,
    enabled: PropTypes.bool,
  };

  static defaultProps = {
    usageTypes: Immutable.List(),
    propertyTypes: Immutable.List(),
    usaget: '',
    unit: '',
    onChangeUsaget: () => {},
    onChangeUnit: () => {},
    enabled: true,
  };

  state = {
    currentItem: null,
    selectedUsaget: Immutable.Map(),
  }

  componentWillMount() {
    this.props.dispatch(getSettings(['usage_types', 'property_types']));
  }

  componentDidMount() {
    this.loadSelectedUsaget();
  }

  loadSelectedUsaget = () => {
    const { usageTypes, usaget } = this.props;
    const selectedUsaget = usageTypes.find(usageType => usageType.get('usage_type', '') === usaget) || Immutable.Map();
    this.setState({ selectedUsaget });
  }

  onChangeUsaget = (usaget) => {
    const usageType = usaget || Immutable.Map();
    this.setState({ selectedUsaget: usageType });
    this.props.onChangeUsaget(usageType.get('usage_type', ''));
    this.onChangeUnit('');
  }

  onChangeUnit = (unit) => {
    this.props.onChangeUnit(unit);
  }

  onCancelNewUsageType = () => {
    this.setState({ currentItem: null });
  }

  onSaveNewUsageType = () => {
    const { usageTypes } = this.props;
    const { currentItem } = this.state;
    this.setState({
      currentItem: null,
      selectedUsaget: currentItem,
    });
    this.props.dispatch(updateSetting('usage_types', usageTypes.size, currentItem));
    this.props.dispatch(saveSettings('usage_types'));
    this.props.onChangeUsaget(currentItem.get('usage_type', ''));
  }

  onClickNewUsageType = () => {
    this.setState({ currentItem: Immutable.Map() });
  }

  onUpdateUsageType = (fieldNames, fieldValues) => {
    const { currentItem } = this.state;
    const keys = Array.isArray(fieldNames) ? fieldNames : [fieldNames];
    const values = Array.isArray(fieldValues) ? fieldValues : [fieldValues];
    this.setState({
      currentItem: currentItem.withMutations((itemwithMutations) => {
        keys.forEach((key, index) => itemwithMutations.set(key, values[index]));
      }),
    });
  }

  getAvailableUsageTypes = () => {
    const { usageTypes } = this.props;
    return usageTypes.map(usaget => ({
      value: usaget,
      label: usaget.get('label', ''),
    })).toJS();
  }

  getAvailableUnits = () => {
    const { propertyTypes } = this.props;
    const { selectedUsaget } = this.state;
    const uom = (propertyTypes.find(prop => prop.get('type', '') === selectedUsaget.get('property_type', '')) || Immutable.Map()).get('uom', Immutable.List());
    return uom.map(unit => ({ value: unit.get('name', ''), label: unit.get('label', '') })).toArray();
  }

  renderUsageTypeSelect = () => {
    const { enabled, usaget } = this.props;
    return (
      <Select
        options={this.getAvailableUsageTypes()}
        value={usaget}
        style={{ marginTop: 3 }}
        disabled={!enabled}
        onChange={this.onChangeUsaget}
      />);
  }

  renderAddUsageTypeButton = () => (
    <Button className="btn-primary" onClick={this.onClickNewUsageType} disabled={!this.props.enabled}>
      <i className="fa fa-plus" />&nbsp;
    </Button>
  );

  renderUnitSelect = () => {
    const { enabled, unit } = this.props;
    return (
      <Select
        onChange={this.onChangeUnit}
        value={unit}
        options={this.getAvailableUnits()}
        disabled={!enabled}
      />);
  }

  renderNewUsageTypeForm = () => {
    const { propertyTypes } = this.props;
    const { currentItem } = this.state;
    return currentItem &&
      (<UsageTypeForm
        item={currentItem}
        propertyTypes={propertyTypes}
        onUpdateItem={this.onUpdateUsageType}
        onSave={this.onSaveNewUsageType}
        onCancel={this.onCancelNewUsageType}
      />);
  };

  render() {
    return (
      <Col md={12}>
        <Col md={6}>
          <FormGroup>
            <InputGroup>
              <InputGroup.Button>
                {this.renderAddUsageTypeButton()}
              </InputGroup.Button>
              {this.renderUsageTypeSelect()}
            </InputGroup>
          </FormGroup>
        </Col>
        <Col md={4}>
          {this.renderUnitSelect()}
        </Col>
        {this.renderNewUsageTypeForm()}
      </Col>
    );
  }
}

const mapStateToProps = (state, props) => ({
  usageTypes: usageTypesDataSelector(state, props),
  propertyTypes: propertyTypeSelector(state, props),
});

export default connect(mapStateToProps)(UsageTypesSelector);
