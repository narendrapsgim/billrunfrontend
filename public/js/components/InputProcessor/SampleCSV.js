import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { HelpBlock } from 'react-bootstrap';
import Immutable from 'immutable';
/* COMPONENTS */
import Field from '../Field';
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
          onAddField } = this.props;

    const selectDelimiterHTML =
      type === 'api'
      ? (null)
      : (<SelectDelimiter settings={settings}
                          onSetDelimiterType={onSetDelimiterType}
                          onChangeDelimiter={onChangeDelimiter} />);

    const fieldsHTML = (<CSVFields onMoveFieldUp={onMoveFieldUp} onMoveFieldDown={onMoveFieldDown} onChangeCSVField={onChangeCSVField} onRemoveField={onRemoveField} settings={settings} onSetFieldWidth={onSetFieldWidth} />);

    const setFieldsHTML = (
      <div className="panel panel-default">
        <div className="panel-heading">
          CDR Fields
        </div>
        <div className="panel-body">
          <div className="form-group">
            <div className="col-lg-4">
              <label>Field name</label>&nbsp;&nbsp;
              <button type="button"
                      disabled={settings.get('fields', []).size < 1}
                      className="btn btn-default btn-xs"
                      onClick={this.removeAllFields}>
                <i className="fa fa-trash-o" /> Remove all
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
              <button type="button"
                      className="btn btn-primary btn-sm"
                      onClick={onAddField}>
                <i className="fa fa-plus"/> Add Field
              </button>
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
          <label htmlFor="file_type">CSV has header?</label>
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
          <label htmlFor="file_type">CSV has footer?</label>
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
