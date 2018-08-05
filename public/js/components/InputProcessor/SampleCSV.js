import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { HelpBlock } from 'react-bootstrap';
import Immutable from 'immutable';
/* COMPONENTS */
import Field from '../Field';
import { CreateButton } from '../Elements';
import SelectDelimiter from './SampleCSV/SelectDelimiter';
import { allCheckedSelector } from '../../selectors/inputProcessorSelector';
import SelectCSV from './SampleCSV/SelectCSV';
import SelectJSON from './SampleCSV/SelectJSON';
import CSVFields from './SampleCSV/CSVFields';
import { showConfirmModal } from '../../actions/guiStateActions/pageActions';

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
    allChecked: PropTypes.bool,
  }

  static defaultProps = {
    type: '',
    errors: Immutable.Map(),
    allChecked: false,
  }

  removeAllFields = () => {
    const r = confirm("Are you sure you want to remove all fields?");
    if (r) {
      this.props.onRemoveAllFields.call(this);
    }
  }

  toggleCheckAllFields = (e) => {
    const { checked } = e.target;
    const { allChecked } = this.props;
    const check = allChecked ? 'uncheck' : 'check';
    const confirm = {
      message: `Are you sure you want to ${check} all fields?`,
      onOk: () => this.props.checkAllFields(checked),
      type: 'confirm',
    };
    this.props.dispatch(showConfirmModal(confirm));
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
          onCheckedField,
          allChecked } = this.props;

    const selectDelimiterHTML =
      type === 'api'
      ? (null)
      : (<SelectDelimiter settings={settings}
                          onSetDelimiterType={onSetDelimiterType}
                          onChangeDelimiter={onChangeDelimiter} />);

    const fieldsHTML = (<CSVFields onMoveFieldUp={onMoveFieldUp} onMoveFieldDown={onMoveFieldDown} onChangeCSVField={onChangeCSVField} onRemoveField={onRemoveField} settings={settings} onSetFieldWidth={onSetFieldWidth} onCheckedField={onCheckedField} />);
    const check = allChecked ? 'Uncheck All' : 'Check All';
    const setFieldsHTML = (
      <div className="panel panel-default">
        <div className="panel-heading">
          CDR Fields
        </div>
        <div className="panel-body">
          <div className="form-group">
            <div className="col-lg-4">
              <label>&nbsp;&nbsp;Field name - Only checked fields will be saved in the system</label>
            </div>
          </div>
          <div className="form-group">
            <div className="col-lg-4">
              <label title={check} className="btn btn-default btn-sm" style={{ borderRadius: 3, backgroundColor: '#eeeeee'}}>
                <input type="checkbox"
                  disabled={settings.get('unfiltered_fields', []).size < 1}
                  className="btn btn-default btn-xs"
                  onChange={this.toggleCheckAllFields}
                  checked={check === 'Uncheck All'}
                />
              </label>
            </div>

            { (settings.get('delimiter_type') === 'fixed') &&
              <div className="col-lg-2" style={{ marginLeft: 35 }}>
                <label>Width</label>
              </div>
            }
            <div className="col-lg-3" style={{ marginLeft: 30 }}>
              <button type="button"
                disabled={settings.get('unfiltered_fields', []).size < 1}
                className="btn btn-default btn-sm"
                onClick={this.removeAllFields}>
                <i className="fa fa-trash-o danger-red" /> Remove All
              </button>
            </div>
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

const mapStateToProps = (state, props) => ({
  allChecked: allCheckedSelector(state, props),
});
export default connect(mapStateToProps)(SampleCSV);
