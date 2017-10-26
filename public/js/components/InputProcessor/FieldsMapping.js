import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import Select from 'react-select';
import { Row, Col } from 'react-bootstrap';
import Field from '../Field';
import Help from '../Help';
import UsageTypesSelector from '../UsageTypes/UsageTypesSelector';
import { getUnitLabel } from '../../common/Util';

export default class FieldsMapping extends Component {

  static propTypes = {
    settings: PropTypes.instanceOf(Immutable.Map),
    usageTypes: PropTypes.instanceOf(Immutable.List),
    usageTypesData: PropTypes.instanceOf(Immutable.List),
    propertyTypes: PropTypes.instanceOf(Immutable.List),
    onSetStaticUsaget: PropTypes.func,
    onSetFieldMapping: PropTypes.func,
  };

  static defaultProps = {
    settings: Immutable.Map(),
    usageTypes: Immutable.List(),
    usageTypesData: Immutable.List(),
    propertyTypes: Immutable.List(),
    onSetStaticUsaget: () => {},
    onSetFieldMapping: () => {},
  };

  constructor(props) {
    super(props);

    this.onChangePattern = this.onChangePattern.bind(this);
    this.onChangeUsaget  = this.onChangeUsaget.bind(this);
    this.addUsagetMapping = this.addUsagetMapping.bind(this);
    this.onChangeUsaget = this.onChangeUsaget.bind(this);
    this.onSetType = this.onSetType.bind(this);
    this.onChangeStaticUsaget = this.onChangeStaticUsaget.bind(this);

    this.state = {
      pattern: "",
      usaget: "",
      unit: '',
      separateTime: false,
      volumeType: 'field',
      volumeFields: [],
      volumeHardCodedValue: '',
    };
  }

  componentWillMount() {
    if (this.props.settings.getIn(['processor', 'time_field'])) {
      this.setState({separateTime: true});
    }
  }

  onChangePattern(e) {
    this.setState({pattern: e.target.value});
  }

  changeUsaget(val, setStaticUsaget) {
    this.setState({ usaget: val });
    if (setStaticUsaget) {
      this.props.onSetStaticUsaget(val);
    }
  }

  onChangeUsaget(val) {
    this.changeUsaget(val, false);
  }

  onChangeStaticUsaget(usaget) {
    this.changeUsaget(usaget, true);
  }

  onChangeStaticUom = (value) => {
    const e = {
      target: {
        id: 'default_unit',
        value,
      },
    };
    this.props.onSetFieldMapping(e);
  }

  onChangeStaticUsagetVolumeType = (e) => {
    const { value } = e.target;
    const eModified = {
      target: {
        id: 'default_volume_type',
        value,
      },
    };
    this.onChangeStaticUsagetVolumeField('');
    this.props.onSetFieldMapping(eModified);
  }

  onChangeStaticUsagetHardCodedVolume = (e) => {
    this.props.onSetFieldMapping(e);
  }

  onChangeStaticUsagetVolumeField = (volumes) => {
    const value = (volumes.length) ? volumes.split(',') : [];
    const e = {
      target: {
        id: 'default_volume_src',
        value,
      },
    };
    this.props.onSetFieldMapping(e);
  }

  onChangeUom = (unit) => {
    this.setState({ unit });
  }

  addUsagetMapping(e) {
    const { usaget, pattern, unit, volumeType, volumeFields, volumeHardCodedValue } = this.state;
    const volumeSrc = (volumeType === 'field' ? volumeFields : volumeHardCodedValue);
    const { onError } = this.props;
    if (!this.props.settings.getIn(['processor', 'src_field'])) {
      onError("Please select usage type field");
      return;
    }
    if (!usaget || !pattern || !unit || !volumeType || !volumeSrc) {
      onError('Please input a value, usage type, unit and volume field/value');
      return;
    }
    this.props.onAddUsagetMapping.call(this, { usaget, pattern, unit, volumeType, volumeSrc });
    this.setState({ pattern: '', usaget: '', unit: '', volumeType: 'field', volumeFields: [], volumeHardCodedValue: '' });
  }

  removeUsagetMapping(index, e) {
    this.props.onRemoveUsagetMapping.call(this, index);
  }

  onSetType(e) {
    const { value } = e.target;
    this.props.setUsagetType(value);
  }

  onChangeSeparateTime = (e) => {
    const { checked } = e.target;
    if (!checked) this.props.unsetField(['processor', 'time_field']);
    this.setState({separateTime: !this.state.separateTime});
  };

  onChangeDynamicUsagetVolumeType = (e) => {
    const { value } = e.target;
    this.setState({ volumeType: value, volumeHardCodedValue: '', volumeFields: [] });
  }

  onChangeDynamicUsagetHardCodedVolume = (e) => {
    const { value } = e.target;
    this.setState({ volumeHardCodedValue: value });
  }

  onChangeDynamicUsagetVolumeField = (volumes) => {
    const volumeFields = (volumes.length) ? volumes.split(',') : [];
    this.setState({ volumeFields });
  }

  onChangeApriceField = (value) => {
    const e = {
      target: {
        value,
        id: 'aprice_field',
      },
    };
    this.props.onSetFieldMapping(e);
  }

  onChangeApriceExists = () => {
    this.onChangeApriceField(undefined);
    this.onChangeApriceMultExists();
  }

  onChangeApriceMult = (e) => {
    this.props.onSetFieldMapping(e);
  }

  onChangeApriceMultExists = () => {
    const e = {
      target: {
        value: undefined,
        id: 'aprice_mult',
      },
    };
    this.onChangeApriceMult(e);
  }

  getVolumeOptions = () => this.props.settings.get('fields', Immutable.List()).sortBy(field => field).map(field => ({
    label: field,
    value: field,
  })).toArray();

  renderPrice = () => {
    const { settings } = this.props;
    const aprice = settings.getIn(['processor', 'aprice_field'], null);
    const apriceInputProps = {
      fieldType: 'select',
      placeholder: 'Select price field...',
      options: this.getVolumeOptions(),
      onChange: this.onChangeApriceField,
    };
    const apriceMult = settings.getIn(['processor', 'aprice_mult']) || '';
    const apriceMultInputProps = {
      fieldType: 'number',
      id: 'aprice_mult',
      onChange: this.onChangeApriceMult,
    };
    return (
      <div>
        <div className="separator" />
        <div className="form-group">
          <div className="col-lg-3">
            <label htmlFor="price_field">Price</label>
            <p className="help-block">When checked, the price will be taken directly from the record instead of being calculated</p>
          </div>
          <div className="col-lg-9">
            <div className="col-lg-1" style={{ marginTop: 8 }}>
              <i className="fa fa-long-arrow-right" />
            </div>

            <div className="col-lg-9 form-inner-edit-row">
              <Field
                fieldType="toggeledInput"
                value={aprice}
                onChange={this.onChangeApriceExists}
                label="Pre priced"
                inputProps={apriceInputProps}
              />
            </div>

            <div className="col-lg-9 col-lg-offset-1 form-inner-edit-row">
              <Field
                fieldType="toggeledInput"
                value={apriceMult}
                disabledValue=""
                disabled={aprice === null || aprice === undefined}
                onChange={this.onChangeApriceMultExists}
                label="Multiply by constant"
                inputProps={apriceMultInputProps}
              />
            </div>
            <div className="col-lg-1">
              <Help contents="When checked, the price taken will be multiply by the constant entered" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const {
      separateTime,
      usaget,
      unit,
      volumeType,
      volumeFields,
      volumeHardCodedValue,
    } = this.state;
    const { settings,
            usageTypes,
            usageTypesData,
            propertyTypes,
            onSetFieldMapping } = this.props;

    const available_fields = [(<option disabled value="" key={-1}>Select Field...</option>),
                              ...settings.get('fields', Immutable.List()).sortBy(field => field).map((field, key) => (
                                <option value={field} key={key}>{field}</option>
                              ))];
    const available_units = usageTypes.sortBy(usaget => usaget).map((usaget, key) => {
      return {value: usaget, label: usaget};
    }).toJS();

    const defaultUsaget = settings.get('usaget_type', '') !== 'static' ? '' : settings.getIn(['processor', 'default_usaget'], '');
    const defaultUsagetUnit = settings.get('usaget_type', '') !== 'static' ? '' : settings.getIn(['processor', 'default_unit'], '');

    const defaultVolumeType = settings.get('usaget_type', '') !== 'static' ? '' : settings.getIn(['processor', 'default_volume_type'], 'field');
    const defaultVolumeSrc = settings.get('usaget_type', '') !== 'static' ? '' : settings.getIn(['processor', 'default_volume_src'], []);
    const volumeOptions = this.getVolumeOptions();

    return (
      <form className="form-horizontal FieldsMapping">
        <div className="form-group">
          <div className="col-lg-3">
            <label htmlFor="date_field">Date Time</label>
            <p className="help-block">Date and time of record creation</p>
          </div>
          <div className="col-lg-9">
            <div className="col-lg-1" style={{marginTop: 8}}>
              <i className="fa fa-long-arrow-right"></i>
            </div>
            <div className="col-lg-9">
              <select id="date_field"
                      className="form-control"
                      onChange={onSetFieldMapping}
                      value={settings.getIn(['processor', 'date_field'], '')}>
                { available_fields }
              </select>
            </div>
          </div>
        </div>
        <div className="form-group">
          <div className="col-lg-offset-3 col-lg-9">
            <div className="col-lg-offset-1 col-lg-9">
              <div className="input-group">
                <div className="input-group-addon">
                  <input type="checkbox"
                         checked={separateTime}
                         onChange={this.onChangeSeparateTime}
                  />
                  <small style={{ verticalAlign: 'bottom' }}>&nbsp;Time in a separate field</small>
                </div>
                <select id="time_field"
                        className="form-control"
                        onChange={onSetFieldMapping}
                        disabled={!separateTime}
                        value={settings.getIn(['processor', 'time_field'], '')}>
                  { available_fields }
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="separator" />
        <div className="form-group">
          <div className="col-lg-3">
            <label>Usage types / volumes</label>
            <p className="help-block">Types of usages and volumes</p>
          </div>
          <div className="col-lg-9">
            <div className="col-lg-1" style={{marginTop: 8}}>
              <i className="fa fa-long-arrow-right"></i>
            </div>

            <div className="col-lg-4 form-inner-edit-row" style={{ marginTop: 8 }}>
              <label htmlFor="static">
                <input
                  type="radio"
                  style={{ verticalAlign: 'top' }}
                  name="usage_types_type"
                  value="static"
                  checked={settings.get('usaget_type', '') === 'static'}
                  onChange={this.onSetType}
                />
                &nbsp;Static
              </label>
            </div>

            <div className="col-lg-4 form-inner-edit-row" style={{ marginTop: 8 }}>
              <label htmlFor="dynamic">
                <input
                  type="radio"
                  style={{ verticalAlign: 'top' }}
                  name="usage_types_type"
                  value="dynamic"
                  checked={settings.get('usaget_type', '') === 'dynamic'}
                  onChange={this.onSetType}
                />
                &nbsp;Dynamic
              </label>
            </div>
          </div>

          {
            settings.get('usaget_type', '') === 'static' &&
            (
              <Col sm={12}>
                <Row className="form-inner-edit-row">
                  <div className="col-lg-7">
                    <div className="col-lg-7">
                      <strong>Usage Type</strong>
                    </div>
                    <div className="col-lg-5">
                      <strong>Unit</strong>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <strong>Volume field / value</strong>
                  </div>
                </Row>
                <Row>
                  <div className="col-lg-7">
                    <UsageTypesSelector
                      usaget={defaultUsaget}
                      unit={defaultUsagetUnit}
                      onChangeUsaget={this.onChangeStaticUsaget}
                      onChangeUnit={this.onChangeStaticUom}
                      enabled={settings.get('usaget_type', '') === 'static'}
                    />
                  </div>
                  <div className="col-lg-1">
                    <Field
                      fieldType="radio"
                      name="static-usaget-volume-type"
                      id="static-usaget-volume-type-field"
                      value="field"
                      checked={defaultVolumeType === 'field'}
                      onChange={this.onChangeStaticUsagetVolumeType}
                      label="By field"
                    />
                    <Field
                      fieldType="radio"
                      name="static-usaget-volume-type"
                      id="static-usaget-volume-type-value"
                      value="value"
                      checked={defaultVolumeType === 'value'}
                      onChange={this.onChangeStaticUsagetVolumeType}
                      label="By value"
                    />
                  </div>
                  <div className="col-lg-3">
                    {
                      defaultVolumeType === 'field'
                      ? (<Select
                        multi={true}
                        value={defaultVolumeSrc.join(',')}
                        options={volumeOptions}
                        onChange={this.onChangeStaticUsagetVolumeField}
                      />)
                      : (<Field
                        fieldType="number"
                        id="default_volume_src"
                        value={defaultVolumeSrc}
                        onChange={this.onChangeStaticUsagetHardCodedVolume}
                      />)
                    }
                  </div>
                </Row>
              </Col>)
          }
          {
            settings.get('usaget_type', '') === 'dynamic' &&
            (<div className="col-lg-12 form-inner-edit-row">
              <Row>
                <div className="form-inner-edit-row col-lg-6">
                  <select
                    id="src_field"
                    className="form-control"
                    onChange={onSetFieldMapping}
                    value={settings.getIn(['processor', 'src_field'], '')}
                    disabled={settings.get('usaget_type', '') !== 'dynamic'}
                  >
                      { available_fields }
                  </select>
                </div>
              </Row>

              <div className="form-group">
                <div className="col-lg-2">
                  <strong>Input Value</strong>
                </div>
                <div className="col-lg-4 pl0 pr0">
                  <div className="col-lg-7">
                    <strong>Usage Type</strong>
                  </div>
                  <div className="col-lg-5">
                    <strong>Unit</strong>
                  </div>
                </div>
                <div className="col-lg-4">
                  <strong>Volume field / value</strong>
                </div>
              </div>
              {
                settings.getIn(['processor', 'usaget_mapping'], Immutable.List()).map((usageType, key) => (
                  <div className="form-group" key={key}>
                    <div className="col-lg-2">{usageType.get('pattern', '')}</div>
                    <div className="col-lg-4 pl0 pr0">
                      <div className="col-lg-7">{usageType.get('usaget', '')}</div>
                      <div className="col-lg-5"> {getUnitLabel(propertyTypes, usageTypesData, usageType.get('usaget', ''), usageType.get('unit', ''))}</div>
                    </div>
                    <div className="col-lg-4">
                      {
                        usageType.get('volume_type', 'field') === 'field'
                        ? usageType.get('volume_src', []).join(', ')
                        : usageType.get('volume_src', '')
                      }
                    </div>
                    <div className="col-lg-1">
                      <button
                        type="button"
                        className="btn btn-default btn-sm"
                        disabled={settings.get('usaget_type', '') !== 'dynamic'}
                        onClick={this.removeUsagetMapping.bind(this, key)}
                      >
                        <i className="fa fa-trash-o danger-red" /> Remove
                      </button>
                    </div>
                  </div>
                ))
              }
              <div className="form-group">
                <div className="col-lg-2">
                  <input
                    className="form-control"
                    onChange={this.onChangePattern}
                    disabled={settings.get('usaget_type', '') !== 'dynamic'}
                    value={this.state.pattern}
                  />
                </div>
                <div className="col-lg-4">
                  <UsageTypesSelector
                    usaget={usaget}
                    unit={unit}
                    onChangeUsaget={this.onChangeUsaget}
                    onChangeUnit={this.onChangeUom}
                    enabled={settings.get('usaget_type', '') === 'dynamic'}
                  />
                </div>
                <div className="col-lg-1">
                  <Field
                    fieldType="radio"
                    name="dynamic-usaget-volume-type"
                    id="dynamic-usaget-volume-type-field"
                    value="field"
                    checked={volumeType === 'field'}
                    onChange={this.onChangeDynamicUsagetVolumeType}
                    label="By field"
                  />
                  <Field
                    fieldType="radio"
                    name="dynamic-usaget-volume-type"
                    id="dynamic-usaget-volume-type-value"
                    value="value"
                    checked={volumeType === 'value'}
                    onChange={this.onChangeDynamicUsagetVolumeType}
                    label="By value"
                  />
                </div>
                <div className="col-lg-3">
                  {
                    volumeType === 'field'
                    ? (<Select
                      multi={true}
                      value={volumeFields}
                      options={volumeOptions}
                      onChange={this.onChangeDynamicUsagetVolumeField}
                    />)
                    : (<Field
                      fieldType="number"
                      value={volumeHardCodedValue}
                      onChange={this.onChangeDynamicUsagetHardCodedVolume}
                    />)
                  }
                </div>
                <div className="col-lg-1">
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={this.addUsagetMapping}
                  >
                    <i className="fa fa-plus" /> Add Mapping
                  </button>
                </div>
              </div>
            </div>)
          }
        </div>

        { this.renderPrice() }
      </form>
    );
  }
}
