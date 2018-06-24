import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { HelpBlock } from 'react-bootstrap';
import Immutable from 'immutable';
/* COMPONENTS */
import Field from '../Field';
import { CreateButton } from '../Elements';
import SelectDelimiter from './SampleCSV/SelectDelimiter';
import SelectCSV from './SampleCSV/SelectCSV';
import SelectJSON from './SampleCSV/SelectJSON';
import CSVFields from './SampleCSV/CSVFields';

class SampleCSV extends Component {

  static propTypes = {
    settings: PropTypes.instanceOf(Immutable.Map).isRequired,
    type: PropTypes.string,
    action: PropTypes.string.isRequired,
    errors: PropTypes.instanceOf(Immutable.Map),
    onChangeName: PropTypes.func.isRequired,
    onSetDelimiterType: PropTypes.func.isRequired,
    onChangeDelimiter: PropTypes.func.isRequired,
    onSelectSampleCSV: PropTypes.func.isRequired,
    onSelectJSON: PropTypes.func.isRequired,
    onSetFieldWidth: PropTypes.func.isRequired,
    onRemoveField: PropTypes.func.isRequired,
    onMoveFieldUp: PropTypes.func.isRequired,
    onMoveFieldDown: PropTypes.func.isRequired,
    onChangeCSVField: PropTypes.func.isRequired,
    onAddField: PropTypes.func.isRequired,
    onChangeInputProcessorField: PropTypes.func.isRequired,
    onCheckedField: PropTypes.func.isRequired,
    checkAllFields: PropTypes.func.isRequired,
  }

  static defaultProps = {
    type: '',
    errors: Immutable.Map(),
  }

  removeAllFields = () => {
    const r = confirm("Are you sure you want to remove all fields?");
    if (r) {
      this.props.onRemoveAllFields.call(this);
    }
  }

  componentDidMount() {
    this.initDefaultValues();
  }

  initDefaultValues = () => {
    const { type, settings } = this.props;
    if (type !== 'api') {
      if (settings.get('csv_has_footer', null) === null) {
        this.props.onChangeInputProcessorField(['csv_has_footer'], false);
      }
      if (settings.get('csv_has_header', null) === null) {
        this.props.onChangeInputProcessorField(['csv_has_header'], false);
      }
    }
  }

  render() {
    const { settings,
          type,
          action,
          errors,
          onChangeName,
          onSetDelimiterType,
          onChangeDelimiter,
          onSelectSampleCSV,
          onSelectJSON,
          onSetFieldWidth,
          onRemoveField,
          onMoveFieldUp,
          onMoveFieldDown,
          onChangeCSVField,
          onAddField,
          onCheckedField } = this.props;

    const selectDelimiterHTML =
      type === 'api'
      ? (null)
      : (<SelectDelimiter settings={settings}
                          onSetDelimiterType={onSetDelimiterType}
                          onChangeDelimiter={onChangeDelimiter} />);

    const fieldsHTML = (<CSVFields onMoveFieldUp={onMoveFieldUp} onMoveFieldDown={onMoveFieldDown} onChangeCSVField={onChangeCSVField} onRemoveField={onRemoveField} settings={settings} onSetFieldWidth={onSetFieldWidth} onCheckedField={onCheckedField} />);

    const check = settings.get('unfiltered_fields', Immutable.List()).reduce((acc, curr) => acc && curr.get('checked') === true, true) === true ? 'Uncheck' : 'Check';

    const setFieldsHTML = (
      <div className="panel panel-default">
        <div className="panel-heading">
          CDR Fields
        </div>
        <div className="panel-body">
          <div className="form-group">
            <div className="col-lg-1">
              <label>&nbsp;&nbsp;Field name</label>
            </div>
            <div className="col-lg-4">
              <p className="help-block">Notice: Only checked fields will be saved in the system</p>
            </div>
          </div>
          <div className="form-group">
            <div className="col-lg-4">
              <label style={{ border: 2 }}>
                <input type="checkbox" style={{ marginLeft: 14 }}
                  disabled={settings.get('unfiltered_fields', []).size < 1}
                  className="btn btn-default btn-xs"
                  onClick={this.props.checkAllFields}
                  checked={check === 'Uncheck'}
                />
                &nbsp;{check} All &nbsp;&nbsp;
              </label>
              <button type="button"
                      disabled={settings.get('unfiltered_fields', []).size < 1}
                      className="btn btn-default btn-xs"
                      onClick={this.removeAllFields}>
                <i className="fa fa-trash-o danger-red" /> Remove All
              </button>
            </div>
            { (settings.get('delimiter_type') === 'fixed') &&
              <div className="col-lg-2">
                <label>Width</label>
              </div>
            }
          </div>
          { fieldsHTML }
          <div className="form-group">
            <div className="col-lg-2">
              <CreateButton onClick={onAddField} label="Add Field" />
            </div>
          </div>
        </div>
      </div>
    );

    const selectCSVHTML =
      type === "api"
      ? (<div><SelectJSON onSelectJSON={ onSelectJSON } settings={ settings } /></div>)
      : (<div><SelectCSV onSelectSampleCSV={onSelectSampleCSV} settings={settings} /></div>);

    const onChangeCsvFooter = (e) => {
      const { value } = e.target;
      this.props.onChangeInputProcessorField(['csv_has_footer'], value);
    };

    const onChangeCsvHeader = (e) => {
      const { value } = e.target;
      this.props.onChangeInputProcessorField(['csv_has_header'], value);
    };

    const selectHeaderHTML = () => (
      type === 'api'
      ? (null)
      : (<div className="form-group">
        <div className="col-lg-3">
          <label htmlFor="file_type">Skip CSV header?</label>
        </div>
        <div className="col-lg-9">
          <div className="col-lg-1" style={{ marginTop: 8 }}>
            <i className="fa fa-long-arrow-right" />
          </div>
          <div className={'col-lg-7'} style={{ marginTop: 8 }}>
            <Field id="csvHeader" value={settings.get('csv_has_header', false)} onChange={onChangeCsvHeader} fieldType="checkbox" />
          </div>
        </div>
      </div>)
    );

    const selectFooterHTML = () => (
      type === 'api'
      ? (null)
      : (<div className="form-group">
        <div className="col-lg-3">
          <label htmlFor="file_type">Skip CSV footer?</label>
        </div>
        <div className="col-lg-9">
          <div className="col-lg-1" style={{ marginTop: 8 }}>
            <i className="fa fa-long-arrow-right" />
          </div>
          <div className={'col-lg-7'} style={{ marginTop: 8 }}>
            <Field id="csvFooter" value={settings.get('csv_has_footer', false)} onChange={onChangeCsvFooter} fieldType="checkbox" />
          </div>
        </div>
      </div>)
    );

    return (
      <form className="InputProcessor form-horizontal">
        <div className="form-group">
          <div className="col-lg-3">
            <label htmlFor="file_type">Name</label>
          </div>
          <div className="col-lg-9">
            <div className="col-lg-1" style={{marginTop: 8}}>
              <i className="fa fa-long-arrow-right"></i>
            </div>
            <div className={`col-lg-7${(errors.get('name', '').length > 0) ? ' has-error' : ''}`}>
              <Field id="file_type" onChange={onChangeName} value={settings.get('file_type', '')} disabled={action !== 'new'} />
              {(errors.get('name', '').length > 0) && <HelpBlock>{errors.get('name', '')}</HelpBlock>}
            </div>
          </div>
        </div>
        { selectDelimiterHTML }
        { selectHeaderHTML() }
        { selectFooterHTML() }
        { selectCSVHTML }
        { setFieldsHTML }
      </form>
    );
  }
}

export default connect()(SampleCSV);
