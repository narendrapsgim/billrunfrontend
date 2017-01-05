import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Immutable from 'immutable';
import _ from 'lodash';
import { Step, Stepper, StepLabel } from 'material-ui/Stepper';
import { setProcessorType, setParserSetting, setInputProcessorTemplate, clearInputProcessor, getProcessorSettings, setName, setDelimiterType, setDelimiter, setFields, setFieldMapping, setFieldWidth, addCSVField, addUsagetMapping, setCustomerMapping, setRatingField, setReceiverField, saveInputProcessorSettings, removeCSVField, removeAllCSVFields, mapUsaget, removeUsagetMapping, deleteInputProcessor, setUsagetType, setLineKey, setStaticUsaget, moveCSVFieldUp, moveCSVFieldDown, changeCSVField, unsetField, setRealtimeField, setRealtimeDefaultField } from '../../actions/inputProcessorActions';
import { getSettings } from '../../actions/settingsActions';
import { showSuccess, showDanger } from '../../actions/alertsActions';
import { setPageTitle } from '../../actions/guiStateActions/pageActions';
import Templates from '../../Templates';
import SampleCSV from './SampleCSV';
import FieldsMapping from './FieldsMapping';
import CalculatorMapping from './CalculatorMapping';
import Receiver from './Receiver';
import RealtimeMapping from './RealtimeMapping';


class InputProcessor extends Component {

  static propTypes = {
    settings: PropTypes.instanceOf(Immutable.Map),
    dispatch: PropTypes.func.isRequired,
    router: React.PropTypes.shape({
      push: React.PropTypes.func.isRequired,
    }).isRequired,
  };

  static defaultProps = {
    settings: Immutable.Map(),
  };

  constructor(props) {
    super(props);

    this.onSetReceiverCheckboxField = this.onSetReceiverCheckboxField.bind(this);
    this.onRemoveUsagetMapping = this.onRemoveUsagetMapping.bind(this);
    this.onSetCustomerMapping = this.onSetCustomerMapping.bind(this);
    this.onSetReceiverField = this.onSetReceiverField.bind(this);
    this.onSetDelimiterType = this.onSetDelimiterType.bind(this);
    this.onAddUsagetMapping = this.onAddUsagetMapping.bind(this);
    this.onChangeDelimiter = this.onChangeDelimiter.bind(this);
    this.onSelectSampleCSV = this.onSelectSampleCSV.bind(this);
    this.onSetFieldMapping = this.onSetFieldMapping.bind(this);
    this.onRemoveAllFields = this.onRemoveAllFields.bind(this);
    this.onSetStaticUsaget = this.onSetStaticUsaget.bind(this);
    this.addUsagetMapping = this.addUsagetMapping.bind(this);
    this.onSetFieldWidth = this.onSetFieldWidth.bind(this);
    this.onRemoveField = this.onRemoveField.bind(this);
    this.setUsagetType = this.setUsagetType.bind(this);
    this.onSetLineKey = this.onSetLineKey.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.onChangeName = this.onChangeName.bind(this);
    this.onSetRating = this.onSetRating.bind(this);
    this.onAddField = this.onAddField.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handlePrev = this.handlePrev.bind(this);
    this.onError = this.onError.bind(this);
    this.goBack = this.goBack.bind(this);

    this.state = {
      stepIndex: 0,
      finished: 0,
      steps: [
        'parser',
        'processor',
        'customer_identification_fields',
        'receiver',
      ],
    };
  }

  componentDidMount() {
    const { file_type, action, template, type, format } = this.props.location.query;
    if (action !== 'new') {
      this.props.dispatch(getProcessorSettings(file_type));
    } else if (template) {
      this.props.dispatch(setInputProcessorTemplate(Templates[template]));
    }
    this.props.dispatch(getSettings(['usage_types']));
    if (action === 'new' && (type === 'api' && format === 'json')) {
      this.props.dispatch(setParserSetting('type', 'realtime'));
      this.props.dispatch(setDelimiterType('json'));
      this.props.dispatch(setProcessorType('realtime'));
    }
    const pageTitle = (action === 'new') ? 'Create New Input Processor' : 'Edit Input Processor';
    this.props.dispatch(setPageTitle(pageTitle));

  }

  componentWillReceiveProps(nextProps) {
    const { settings, location: { query: { action } } } = this.props;
    const name = settings.get('file_type', '');
    const newName = nextProps.settings.get('file_type', '');
    if (action !== 'new' && newName !== name) {
      this.props.dispatch(setPageTitle(`Edit Input Processor - ${newName}`));
    }
  }

  componentWillUnmount() {
    this.props.dispatch(clearInputProcessor());
  }

  onChangeName(e) {
    this.props.dispatch(setName(e.target.value));
  }

  onSetDelimiterType(e) {
    this.props.dispatch(setDelimiterType(e.target.value));
  }

  onChangeDelimiter(e) {
    this.props.dispatch(setDelimiter(e.target.value));
  }

  onSelectJSON = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = ((evt) => {
      if (evt.target.readyState === FileReader.DONE) {
        try {
          const json = JSON.parse(evt.target.result);
          const fields =
            Object.keys(json)
                  .map(key =>
                    this.buildJSONFields(key, json));
          this.props.dispatch(setFields(_.flattenDeep(fields)));
        } catch (err) {
          this.props.dispatch(showDanger('Not a valid JSON'));
        }
      }
    });
    const blob = file.slice(0, file.size - 1);
    reader.readAsText(blob);
  };

  onSelectSampleCSV(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    if (!this.props.settings.get('delimiter')) return;
    reader.onloadend = ((evt) => {
      if (evt.target.readyState == FileReader.DONE) {
        /* Only need first line */
        const lines = evt.target.result.split('\n');
        const header = lines[0];
        const fields = header.split(this.props.settings.get('delimiter')).map(field => field.replace(/[^a-zA-Z_\d]/g, '_').toLowerCase());
        this.props.dispatch(setFields(fields));
      }
    });
    const blob = file.slice(0, file.size - 1);
    reader.readAsText(blob);
  }

  onAddField(val, e) {
    this.props.dispatch(addCSVField(''));
  }

  onRemoveField(index, e) {
    this.props.dispatch(removeCSVField(index));
  }

  onRemoveAllFields() {
    this.props.dispatch(removeAllCSVFields());
  }

  onSetFieldMapping(e) {
    const { value: mapping, id: field } = e.target;
    this.props.dispatch(setFieldMapping(field, mapping));
  }

  onSetFieldWidth(e) {
    const { value, dataset: { field } } = e.target;
    this.props.dispatch(setFieldWidth(field, value));
  }

  onAddUsagetMapping(val) {
    this.props.dispatch(mapUsaget(val));
  }

  onSetStaticUsaget(val) {
    this.props.dispatch(setStaticUsaget(val));
  }

  onRemoveUsagetMapping(index, e) {
    this.props.dispatch(removeUsagetMapping(index));
  }

  onSetCustomerMapping(field, mapping, index) {
    this.props.dispatch(setCustomerMapping(field, mapping, index));
  }

  onSetRating(e) {
    const { dataset: { usaget, rate_key }, value } = e.target;
    this.props.dispatch(setRatingField(usaget, rate_key, value));
  }

  onSetLineKey(e) {
    const { dataset: { usaget }, value } = e.target;
    this.props.dispatch(setLineKey(usaget, value));
  }

  onSetReceiverField(e) {
    const { id, value } = e.target;
    this.props.dispatch(setReceiverField(id, value));
  }

  onSetReceiverCheckboxField(e) {
    const { id, checked } = e.target;
    this.props.dispatch(setReceiverField(id, checked));
  }

  onMoveFieldUp = (index) => {
    this.props.dispatch(moveCSVFieldUp(index));
  };

  onMoveFieldDown = (index) => {
    this.props.dispatch(moveCSVFieldDown(index));
  };

  onChangeCSVField = (index, value) => {
    this.props.dispatch(changeCSVField(index, value));
  };

  onChangeRealtimeField = (e) => {
    const { id, value } = e.target;
    this.props.dispatch(setRealtimeField(id, value));
  };

  onChangeRealtimeDefaultField = (e) => {
    const { id, value } = e.target;
    this.props.dispatch(setRealtimeDefaultField(id, value));
  };

  onError(message) {
    this.props.dispatch(showDanger(message));
  }

  setUsagetType(val) {
    this.props.dispatch(setUsagetType(val));
  }

  unsetField = (fieldPath) => {
    this.props.dispatch(unsetField(fieldPath));
  }

  buildJSONFields = (field, obj) => {
    if (typeof obj[field] === 'object' && !Array.isArray(obj[field])) {
      const nested = Object.keys(obj[field]).map(key => this.buildJSONFields(key, obj[field]));
      return nested.map(n => `${field}.${n}`);
    }
    return field;
  };

  addUsagetMapping(val) {
    this.props.dispatch(addUsagetMapping(val));
  }

  goBack() {
    this.props.router.push('/input_processors');
  }

  handleNext() {
    const { stepIndex } = this.state;
    const cb = (err) => {
      if (err) return;
      if (this.state.finished) {
        this.props.dispatch(showSuccess('Input processor saved successfully!'));
        this.goBack();
      } else {
        const totalSteps = this.state.steps.length - 1;
        const finished = (stepIndex + 1) === totalSteps;
        this.setState({
          stepIndex: stepIndex + 1,
          finished,
        });
      }
    };
    const part = this.state.finished ? false : this.state.steps[stepIndex];
    this.props.dispatch(saveInputProcessorSettings(this.props.settings, cb, part));
  }

  handlePrev() {
    const { stepIndex } = this.state;
    if (stepIndex > 0) {
      this.setState({ stepIndex: stepIndex - 1, finished: 0 });
    } else {
      const r = confirm('Are you sure you want to stop editing input processor ?');
      if (r) {
        this.props.dispatch(clearInputProcessor());
        this.goBack();
      }
    }
  }

  handleCancel() {
    const r = confirm('Are you sure you want to stop editing input processor ?');
    const { dispatch, fileType } = this.props;
    if (r) {
      if (fileType !== true) {
        dispatch(clearInputProcessor());
        this.goBack();
      } else {
        const cb = (err) => {
          if (err) {
            dispatch(showDanger('Please try again'));
            return;
          }
          dispatch(clearInputProcessor());
          this.goBack();
        };
        dispatch(deleteInputProcessor(this.props.settings.get('file_type'), cb));
      }
    }
  }

  renderStepper = () => {
    const { stepIndex } = this.state;
    const { type } = this.props.location.query;
    return (
      <Stepper activeStep={stepIndex}>
        <Step>
          <StepLabel>CDR Fields</StepLabel>
        </Step>
        <Step>
          <StepLabel>Field Mapping</StepLabel>
        </Step>
        <Step>
          <StepLabel>Calculator Mapping</StepLabel>
        </Step>
        <Step>
          <StepLabel>{type === 'api' ? 'Realtime Mapping' : 'Receiver' }</StepLabel>
        </Step>
      </Stepper>
    );
  }

  render() {
    const { stepIndex } = this.state;
    const { settings, usage_types } = this.props;
    const { action, type, format } = this.props.location.query;

    const steps = [
      (<SampleCSV onChangeName={this.onChangeName} onSetDelimiterType={this.onSetDelimiterType} onChangeDelimiter={this.onChangeDelimiter} onSelectSampleCSV={this.onSelectSampleCSV} onAddField={this.onAddField} onSetFieldWidth={this.onSetFieldWidth} onRemoveField={this.onRemoveField} onRemoveAllFields={this.onRemoveAllFields} settings={settings} onMoveFieldUp={this.onMoveFieldUp} onMoveFieldDown={this.onMoveFieldDown} onChangeCSVField={this.onChangeCSVField} type={type} format={format} onSelectJSON={this.onSelectJSON} />),
      (<FieldsMapping onSetFieldMapping={this.onSetFieldMapping} onAddUsagetMapping={this.onAddUsagetMapping} addUsagetMapping={this.addUsagetMapping} onRemoveUsagetMapping={this.onRemoveUsagetMapping} onError={this.onError} onSetStaticUsaget={this.onSetStaticUsaget} setUsagetType={this.setUsagetType} settings={settings} usageTypes={usage_types} unsetField={this.unsetField} />),
      (<CalculatorMapping onSetRating={this.onSetRating} onSetCustomerMapping={this.onSetCustomerMapping} onSetLineKey={this.onSetLineKey} settings={settings} />),
    ];
    if (type === 'api') {
      steps.push(<RealtimeMapping settings={settings} onChange={this.onChangeRealtimeField} onChangeDefault={this.onChangeRealtimeDefaultField} />);
    } else {
      steps.push(<Receiver onSetReceiverField={this.onSetReceiverField} onSetReceiverCheckboxField={this.onSetReceiverCheckboxField} settings={settings.get('receiver', Immutable.Map())} />);
    }

    return (
      <div>
        <div className="row">
          <div className="col-lg-12">
            <div className="panel panel-default">
              <div className="panel-heading">
                { this.renderStepper() }
              </div>
              <div className="panel-body">
                <div className="contents bordered-container">
                  { steps[stepIndex] }
                </div>
              </div>
              <div style={{ marginTop: 12, float: 'right' }}>
                <button className="btn btn-default" onClick={this.handleCancel} style={{ marginRight: 12 }} > Cancel </button>
                { (stepIndex > 0) &&
                  <button className="btn btn-default" onClick={this.handlePrev} style={{ marginRight: 12 }} > Back </button>
                }
                <button className="btn btn-primary" onClick={this.handleNext} > { stepIndex === (steps.length - 1) ? 'Finish' : 'Next' }</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


const mapStateToProps = state => ({
  settings: state.inputProcessor,
  usage_types: state.settings.get('usage_types', Immutable.List()),
});

export default withRouter(connect(mapStateToProps)(InputProcessor));
