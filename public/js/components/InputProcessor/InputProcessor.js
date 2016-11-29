import React, { Component } from 'react';
import { connect } from 'react-redux';

import Immutable from 'immutable';
import _ from 'lodash';

import { setProcessorType, setParserSetting, setInputProcessorTemplate, clearInputProcessor, getProcessorSettings, setName, setDelimiterType, setDelimiter, setFields, setFieldMapping, setFieldWidth, addCSVField, addUsagetMapping, setCustomerMapping, setRatingField, setReceiverField, saveInputProcessorSettings, removeCSVField, removeAllCSVFields, mapUsaget, removeUsagetMapping, deleteInputProcessor, setUsagetType, setLineKey, setStaticUsaget, moveCSVFieldUp, moveCSVFieldDown, changeCSVField, unsetField } from '../../actions/inputProcessorActions';
import { getSettings } from '../../actions/settingsActions';
import { showSuccess, showWarning, showDanger } from '../../actions/alertsActions';

/* COMPONENTS */
import Templates from '../../Templates';
import SampleCSV from './SampleCSV';
import FieldsMapping from './FieldsMapping';
import CalculatorMapping from './CalculatorMapping';
import Receiver from './Receiver';
import APIDetails from './APIDetails';

import {
  Step,
  Stepper,
  StepLabel,
} from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';

class InputProcessor extends Component {
  constructor(props) {
    super(props);

    this.onSetReceiverCheckboxField = this.onSetReceiverCheckboxField.bind(this);
    this.onSetCalculatorMapping = this.onSetCalculatorMapping.bind(this);
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
        "parser",
        "processor",
        "customer_identification_fields",
        "receiver"
      ]
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { file_type, action, template, type, format } = this.props.location.query;
    if (action !== "new") dispatch(getProcessorSettings(file_type));
    else if (template) dispatch(setInputProcessorTemplate(Templates[template]));
    dispatch(getSettings(["usage_types"]));
    if (action === 'new' && (type === 'api' && format === 'json')) {
      dispatch(setParserSetting('type', 'realtime'));
      dispatch(setDelimiterType('json'));
      dispatch(setProcessorType('realtime'));
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

  buildJSONFields = (field, obj) => {
    if (typeof obj[field] === "object" && !Array.isArray(obj[field])) {
      const nested = Object.keys(obj[field]).map(key => this.buildJSONFields(key, obj[field]));
      return nested.map(n => `${field}.${n}`);
    }
    return field;
  };

  onSelectJSON = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = (evt => {
      if (evt.target.readyState === FileReader.DONE) {
        try {
          const json = JSON.parse(evt.target.result);
          const fields =
            Object.keys(json)
                  .map(key =>
                    this.buildJSONFields(key, json));
          this.props.dispatch(setFields(_.flattenDeep(fields)));
        } catch(err) {
          alert("Not a valid JSON");
        }
      }
    });
    const blob = file.slice(0, file.size - 1);
    reader.readAsText(blob);
  };
  
  onSelectSampleCSV(e) {
    let file = e.target.files[0];
    let reader = new FileReader();
    if (!this.props.settings.get('delimiter')) return;
    reader.onloadend = (evt => {
      if (evt.target.readyState == FileReader.DONE) {
        /* Only need first line */
        let lines = evt.target.result.split('\n');
        let header = lines[0];
        let fields = header.split(this.props.settings.get('delimiter')).map(field => { return field.replace(/[^a-zA-Z_\d]/g, "_").toLowerCase(); });
        this.props.dispatch(setFields(fields));
      }
    });
    let blob = file.slice(0, file.size - 1);
    reader.readAsText(blob);
  }

  onAddField(val, e) {
    this.props.dispatch(addCSVField(""));
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
    const { value, dataset: {field} } = e.target;
    this.props.dispatch(setFieldWidth(field, value));
  }
  
  onSetCalculatorMapping(e) {
    const { value: mapping, id: field } = e.target;
    this.props.dispatch(setCalculatorMapping(field, mapping));
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

  setUsagetType(val) {
    this.props.dispatch(setUsagetType(val));
  }
  
  onSetCustomerMapping(e) {
    const { value: mapping, id: field } = e.target;
    this.props.dispatch(setCustomerMapping(field, mapping));
  }

  onSetRating(e) {
    const { dataset: {usaget, rate_key}, value } = e.target;
    this.props.dispatch(setRatingField(usaget, rate_key, value));
  }

  onSetLineKey(e) {
    const { dataset: {usaget}, value } = e.target;
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

  addUsagetMapping(val) {
    this.props.dispatch(addUsagetMapping(val));
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
  
  unsetField = (field_path) => {
    this.props.dispatch(unsetField(field_path));
  }

  onError(message) {
    this.props.dispatch(showDanger(message));
  }

  goBack() {
    this.context.router.push({
      pathname: "input_processors"
    });
  }
  
  handleNext() {
    const { stepIndex } = this.state;
    const cb = (err) => {
      if (err) return;
      if (this.state.finished) {
        this.props.dispatch(showSuccess("Input processor saved successfully!"));
        this.goBack();
      } else {
        const totalSteps = this.state.steps.length - 1;
        const finished = (stepIndex + 1) === totalSteps;
        this.setState({
          stepIndex: stepIndex + 1,
          finished
        });
      }
    };
    const part = this.state.finished ? false : this.state.steps[stepIndex];
    this.props.dispatch(saveInputProcessorSettings(this.props.settings, cb, part));
  }

  handlePrev() {
    const { stepIndex } = this.state;
    if (stepIndex > 0) return this.setState({stepIndex: stepIndex - 1, finished: 0});
    let r = confirm("are you sure you want to stop editing input processor?");
    if (r) {
      this.props.dispatch(clearInputProcessor());
      this.goBack();
    }
  }

  handleCancel() {
    let r = confirm("are you sure you want to stop editing input processor?");
    const { dispatch, fileType } = this.props;
    if (r) {
      if (fileType !== true) {
        dispatch(clearInputProcessor());
        this.goBack();
      } else {
        const cb = (err) => {
          if (err) {
            dispatch(showDanger("Please try again"));
            return;
          }
          dispatch(clearInputProcessor());
          this.goBack();
        };
        dispatch(deleteInputProcessor(this.props.settings.get('file_type'), cb));
      }
    }
  }

  render() {
    let { stepIndex } = this.state;
    const { settings, usage_types } = this.props;
    const { action, type, format } = this.props.location.query;

    const steps = [
      (<SampleCSV onChangeName={this.onChangeName} onSetDelimiterType={this.onSetDelimiterType} onChangeDelimiter={this.onChangeDelimiter} onSelectSampleCSV={this.onSelectSampleCSV} onAddField={this.onAddField} onSetFieldWidth={this.onSetFieldWidth} onRemoveField={this.onRemoveField} onRemoveAllFields={this.onRemoveAllFields} settings={settings}  onMoveFieldUp={this.onMoveFieldUp} onMoveFieldDown={this.onMoveFieldDown} onChangeCSVField={this.onChangeCSVField} type={type} format={format} onSelectJSON={ this.onSelectJSON } />),
      (<FieldsMapping onSetFieldMapping={this.onSetFieldMapping} onAddUsagetMapping={this.onAddUsagetMapping} addUsagetMapping={this.addUsagetMapping} onRemoveUsagetMapping={this.onRemoveUsagetMapping} onError={this.onError} onSetStaticUsaget={this.onSetStaticUsaget} setUsagetType={this.setUsagetType} settings={settings} usageTypes={usage_types}  unsetField={this.unsetField} />),
      (<CalculatorMapping onSetCalculatorMapping={this.onSetCalculatorMapping} onSetRating={this.onSetRating} onSetCustomerMapping={this.onSetCustomerMapping} onSetLineKey={this.onSetLineKey} settings={settings} type={type} format={format} />)
    ];
    if (type === 'api') {
      steps.push((<APIDetails />));
    } else {
      steps.push((<Receiver onSetReceiverField={this.onSetReceiverField} onSetReceiverCheckboxField={this.onSetReceiverCheckboxField} settings={settings.get('receiver')} />));
    }

    const title = action === 'new' ? "New input processor" : `Edit input processor - ${settings.get('file_type')}`;
    
    return (
      <div>
        <div className="row">
          <div className="col-lg-12">
            <div className="panel panel-default">
              <div className="panel-heading">
                { title }
              </div>
              <div className="panel-body">
                <Stepper activeStep={stepIndex}>
                  <Step>
                    <StepLabel>Select CSV</StepLabel>
                  </Step>
                  <Step>
                    <StepLabel>Field Mapping</StepLabel>
                  </Step>
                  <Step>
                    <StepLabel>Calculator Mapping</StepLabel>
                  </Step>
                  <Step>
                    {
                      type === "api"
                      ? (<StepLabel>API Details</StepLabel>)
                      : (<StepLabel>Receiver</StepLabel>)
                    }
                  </Step>
                </Stepper>
                <div className="contents bordered-container">
                  { steps[stepIndex] }
                </div>
              </div>
              <div style={{marginTop: 12, float: "right"}}>
                <button className="btn btn-default"
                        onClick={this.handleCancel}
                        style={{marginRight: 12}}>
                  Cancel
                </button>
                {(() => {
                   if (stepIndex > 0) {
                     return (
                       <button className="btn btn-default"
                               onClick={this.handlePrev}
                               style={{marginRight: 12}}>
                         Back
                       </button>
                     );
                   }
                 })()}                 
                       <button className="btn btn-primary"
                               onClick={this.handleNext}>
                         { stepIndex === (steps.length - 1) ? "Finish" : "Next" }
                       </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

InputProcessor.contextTypes = {
  router: React.PropTypes.object.isRequired
};

function mapStateToProps(state, props) {
  return { settings: state.inputProcessor,
           usage_types: state.settings.get('usage_types', Immutable.List()) };
}

export default connect(mapStateToProps)(InputProcessor);
