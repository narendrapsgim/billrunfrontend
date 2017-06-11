import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import Select from 'react-select';

export default class FieldsMapping extends Component {

  static propTypes = {
    usageTypes: PropTypes.instanceOf(Immutable.List),
    addUsagetMapping: PropTypes.func,
    onSetStaticUsaget: PropTypes.func,
  };

  static defaultProps = {
    usageTypes: Immutable.List(),
    addUsagetMapping: () => {},
    onSetStaticUsaget: () => {},
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
    const { usageTypes } = this.props;

    const found = usageTypes.find(usaget => (usaget === val));
    if (!found) {
      this.props.addUsagetMapping(val)
      .then(
        (response) => {
          if (response.status) {
            this.setState({ usaget: val });
            if (setStaticUsaget) {
              this.props.onSetStaticUsaget(val);
            }
          }
        }
      );
    } else {
      this.setState({ usaget: val });
      if (setStaticUsaget) {
        this.props.onSetStaticUsaget(val);
      }
    }
  }

  onChangeUsaget(val) {
    this.changeUsaget(val, false);
  }

  onChangeStaticUsaget(usaget) {
    this.changeUsaget(usaget, true);
  }

  addUsagetMapping(e) {
    const { usaget, pattern } = this.state;
    const { onError } = this.props;
    if (!this.props.settings.getIn(['processor', 'src_field'])) {
      onError("Please select usage type field");
      return;
    }
    if (!usaget || !pattern){
      onError("Please input a value and unit type");
      return;
    }
    this.props.onAddUsagetMapping.call(this, {usaget, pattern});
    this.setState({pattern: "", usaget: ""});
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

  render() {
    const { separateTime } = this.state;
    const { settings,
            usageTypes,
            onSetFieldMapping } = this.props;

    const available_fields = [(<option disabled value="" key={-1}>Select Field...</option>),
                              ...settings.get('fields', Immutable.List()).sortBy(field => field).map((field, key) => (
                                <option value={field} key={key}>{field}</option>
                              ))];
    const available_units = usageTypes.sortBy(usaget => usaget).map((usaget, key) => {
      return {value: usaget, label: usaget};
    }).toJS();

    const defaultUsaget = settings.get('usaget_type', '') !== 'static' ? '' : settings.getIn(['processor', 'default_usaget'], '')
    const volumeOptions = settings.get('fields', Immutable.List()).sortBy(field => field).map(field => ({
      label: field,
      value: field,
    })).toArray();
    const volume = settings.getIn(['processor', 'volume_field'], Immutable.List());
    const volumeList = (typeof volume === 'string') ? volume : volume.join(',');

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
            <div className="col-lg-9">
              <Select
                  id="unit"
                  options={available_units}
                  allowCreate={true}
                  value={defaultUsaget}
                  disabled={settings.get('usaget_type', '') !== "static"}
                  style={{marginTop: 3}}
                  onChange={this.onChangeStaticUsaget}
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
              <div className="col-lg-5">
                <strong>Input Value</strong>
              </div>
              <div className="col-lg-5">
                <strong>Usage Type</strong>
              </div>
            </div>
          </div>
        </div>
            {
              settings.getIn(['processor', 'usaget_mapping'], Immutable.List()).map((usage_t, key) => (
                <div className="form-group" key={key}>
                  <div className="col-lg-offset-3 col-lg-7">
                    <div className="col-lg-offset-1 col-lg-10">
                      <div className="col-lg-5">{usage_t.get('pattern', '')}</div>
                      <div className="col-lg-5">{usage_t.get('usaget', '')}</div>
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
            <div className="col-lg-offset-1 col-lg-10">
              <div className="col-lg-5">
                <input className="form-control"
                       onChange={this.onChangePattern}
                       disabled={settings.get('usaget_type', '') !== "dynamic"}
                       value={this.state.pattern} />
              </div>
              <div className="col-lg-5">
                <Select
                    id="unit"
                    options={available_units}
                    allowCreate={true}
                    value={this.state.usaget}
                    style={{marginTop: 3}}
                    disabled={settings.get('usaget_type', '') !== "dynamic"}
                    onChange={this.onChangeUsaget}
                />
              </div>
              <div className="col-lg-2">
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
