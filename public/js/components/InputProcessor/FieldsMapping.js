import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import Select from 'react-select';
import Field from '../Field';
import Help from '../Help';
import UsageTypesSelector from '../UsageTypes/UsageTypesSelector';
import { getUnitLabel } from '../../common/Util';

export default class FieldsMapping extends Component {

  static propTypes = {
    usageTypes: PropTypes.instanceOf(Immutable.List),
    usageTypesData: PropTypes.instanceOf(Immutable.List),
    propertyTypes: PropTypes.instanceOf(Immutable.List),
    onSetStaticUsaget: PropTypes.func,
    onSetFieldMapping: PropTypes.func,
  };

  static defaultProps = {
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
      separateTime: false
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

  onChangeUom = (unit) => {
    this.setState({ unit });
  }

  addUsagetMapping(e) {
    const { usaget, pattern, unit } = this.state;
    const { onError } = this.props;
    if (!this.props.settings.getIn(['processor', 'src_field'])) {
      onError("Please select usage type field");
      return;
    }
    if (!usaget || !pattern || !unit) {
      onError('Please input a value, usage type and unit');
      return;
    }
    this.props.onAddUsagetMapping.call(this, { usaget, pattern, unit });
    this.setState({ pattern: '', usaget: '', unit: '' });
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

  onChangeVolume = (volumes) => {
    const volumesList = (volumes.length) ? volumes.split(',') : [];
    const e = {
      target: {
        value: Immutable.List(volumesList),
        id: 'volume_field',
      },
    };
    this.props.onSetFieldMapping(e);
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
  }

  render() {
    const { separateTime, usaget, unit } = this.state;
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
    const volumeOptions = settings.get('fields', Immutable.List()).sortBy(field => field).map(field => ({
      label: field,
      value: field,
    })).toArray();
    const volume = settings.getIn(['processor', 'volume_field'], Immutable.List());
    const volumeList = (typeof volume === 'string') ? volume : volume.join(',');
    const aprice = settings.getIn(['processor', 'aprice_field'], null);
    const apriceInputProps = {
      fieldType: 'select',
      placeholder: 'Select price field...',
      options: volumeOptions,
      onChange: this.onChangeApriceField,
    };

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
                  <small style={{ verticalAlign: 'bottom' }}>&nbsp;Time in separate field</small>
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
            <label htmlFor="volume_field">Volume</label>
            <p className="help-block">Amount calculated (multiple selection will sum fields)</p>
          </div>
          <div className="col-lg-9">
            <div className="col-lg-1" style={{marginTop: 8}}>
              <i className="fa fa-long-arrow-right"></i>
            </div>
            <div className="col-lg-9">
              <Select
                inputProps={{ id: 'volume_field' }}
                multi={true}
                value={volumeList}
                options={volumeOptions}
                onChange={this.onChangeVolume}
              />
            </div>
          </div>
          <div className="form-group">
            <div className="col-lg-offset-3 col-lg-9">
              <div className="col-lg-offset-1 col-lg-9">
                <Field
                  fieldType="toggeledInput"
                  value={aprice}
                  onChange={this.onChangeApriceExists}
                  label="Pre-rated"
                  inputProps={apriceInputProps}
                />
              </div>
              <div className="col-lg-1">
                <Help contents="In case the CDR is already rated, the price will not be calculated" />
              </div>
            </div>
          </div>
        </div>
        <div className="separator" />
        <div className="form-group">
          <div className="col-lg-2">
            <label>Usage types</label>
            <p className="help-block">Types of usages</p>
          </div>
          <div className="col-lg-1" style={{ marginTop: 8 }}>
            <label><input type="radio" style={{ verticalAlign: 'top' }}
                          name="usage_types_type"
                          value="static"
                          checked={settings.get('usaget_type', '') === "static"}
                          onChange={this.onSetType} />
              &nbsp;Static
            </label>
          </div>
          <div className="col-lg-9">
            <div className="col-lg-1" style={{marginTop: 8}}>
              <i className="fa fa-long-arrow-right"></i>
            </div>

            <div className="col-lg-10">
              <UsageTypesSelector
                usaget={defaultUsaget}
                unit={defaultUsagetUnit}
                onChangeUsaget={this.onChangeStaticUsaget}
                onChangeUnit={this.onChangeStaticUom}
                enabled={settings.get('usaget_type', '') === 'static'}
              />
            </div>
          </div>
        </div>
        <div className="form-group">
          <div className="col-lg-offset-2 col-lg-1" style={{ marginTop: 8 }}>
            <label><input type="radio" style={{ verticalAlign: 'top' }}
                          name="usage_types_type"
                          value="dynamic"
                          checked={settings.get('usaget_type', '') === "dynamic"}
                          onChange={this.onSetType} />
              &nbsp;Dynamic
            </label>
          </div>
          <div className="col-lg-9">
            <div className="col-lg-1" style={{marginTop: 8}}>
              <i className="fa fa-long-arrow-right"></i>
            </div>
            <div className="col-lg-9">
              <select id="src_field"
                      className="form-control"
                      onChange={onSetFieldMapping}
                      value={settings.getIn(['processor', 'src_field'], '')}
                      disabled={settings.get('usaget_type', '') !== "dynamic"}>
                { available_fields }
              </select>
            </div>
          </div>
        </div>
        <div className="form-group">
          <div className="col-lg-offset-3 col-lg-7">
            <div className="col-lg-offset-1 col-lg-10">
              <div className="col-lg-3">
                <strong>Input Value</strong>
              </div>
              <div className="col-lg-3">
                <strong>Usage Type</strong>
              </div>
              <div className="col-lg-4">
                <strong>Unit</strong>
              </div>
            </div>
          </div>
        </div>
            {
              settings.getIn(['processor', 'usaget_mapping'], Immutable.List()).map((usage_t, key) => (
                <div className="form-group" key={key}>
                  <div className="col-lg-offset-3 col-lg-7">
                    <div className="col-lg-offset-1 col-lg-10">
                      <div className="col-lg-3">{usage_t.get('pattern', '')}</div>
                      <div className="col-lg-3">{usage_t.get('usaget', '')}</div>
                      <div className="col-lg-3"> {getUnitLabel(propertyTypes, usageTypesData, usage_t.get('usaget', ''), usage_t.get('unit', ''))}</div>
                      <div className="col-lg-2">
                        <button type="button"
                                className="btn btn-default btn-sm"
                                disabled={settings.get('usaget_type', '') !== "dynamic"}
                                onClick={this.removeUsagetMapping.bind(this, key)}>
                          <i className="fa fa-trash-o danger-red" /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            }
        <div className="form-group">
          <div className="col-lg-offset-3 col-lg-7">
            <div className="col-lg-offset-1 col-lg-12">
              <div className="col-lg-3">
                <input className="form-control"
                       onChange={this.onChangePattern}
                       disabled={settings.get('usaget_type', '') !== "dynamic"}
                       value={this.state.pattern} />
              </div>
              <div className="col-lg-8">
                <UsageTypesSelector
                  usaget={usaget}
                  unit={unit}
                  onChangeUsaget={this.onChangeUsaget}
                  onChangeUnit={this.onChangeUom}
                  enabled={settings.get('usaget_type', '') === 'dynamic'}
                />
              </div>
              <div className="col-lg-1">
                <button type="button"
                        className="btn btn-primary btn-sm"
                        onClick={this.addUsagetMapping}>
                  <i className="fa fa-plus"/> Add Mapping
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    );
  }
}
