import React, { Component } from 'react';
import { connect } from 'react-redux';

import { clearInputProcessor, getProcessorSettings, setName, setDelimiterType, setDelimiter, setFields, setFieldMapping, setFieldWidth, addCSVField, addUsagetMapping, setCustomerMapping, setRatingField, setReceiverField, saveInputProcessorSettings, removeCSVField, removeAllCSVFields, mapUsaget, removeUsagetMapping, deleteInputProcessor, setUsagetType, setLineKey, setStaticUsaget } from '../../actions/inputProcessorActions';
import { getSettings } from '../../actions/settingsActions';
import { showStatusMessage } from '../../actions/commonActions';

import SampleCSV from './SampleCSV';
import FieldsMapping from './FieldsMapping';
import CalculatorMapping from './CalculatorMapping';
import Receiver from './Receiver';
import _ from 'lodash';

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
    const { file_type, action } = this.props.location.query;
    dispatch(clearInputProcessor());
    if (action !== "new") dispatch(getProcessorSettings(file_type));
    dispatch(getSettings(["usage_types"]));
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
    if (!val || _.isEmpty(val.replace(/ /g, ''))) {
      this.props.dispatch(showStatusMessage("Please input field name", 'error'));
      return;
    };
    const value = val.replace(/[^a-zA-Z_]/g, "_").toLowerCase();
    const fields = this.props.settings.get('fields');
    if (fields.includes(value)) {
      this.props.dispatch(showStatusMessage("Field already exists", "error"));
      return;
    }
    this.props.dispatch(addCSVField(value));
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

  onError(message) {
    this.props.dispatch(showStatusMessage(message, 'error'));
  }

  handleNext() {
    const { stepIndex } = this.state;
    const cb = (err) => {
      if (err) return;
      if (this.state.finished) {
        this.props.dispatch(showStatusMessage("Input processor saved successfully!", "success"));
        this.props.onCancel();
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
      this.props.onCancel();
    }
  }

  handleCancel() {
    let r = confirm("are you sure you want to stop editing input processor?");
    const { dispatch, fileType } = this.props;
    if (r) {
      if (fileType !== true) {
        dispatch(clearInputProcessor());
        this.props.onCancel();
      } else {
        const cb = (err) => {
          if (err) {
            dispatch(showStatusMessage("Please try again", "error"));
            return;
          }
          dispatch(clearInputProcessor());
          this.props.onCancel();
        };
        dispatch(deleteInputProcessor(this.props.settings.get('file_type'), cb));
      }
    }
  }

  render() {
    let { stepIndex } = this.state;
    const { settings, usage_types } = this.props;

    const steps = [
      (<SampleCSV onChangeName={this.onChangeName} onSetDelimiterType={this.onSetDelimiterType} onChangeDelimiter={this.onChangeDelimiter} onSelectSampleCSV={this.onSelectSampleCSV} onAddField={this.onAddField} onSetFieldWidth={this.onSetFieldWidth} onRemoveField={this.onRemoveField} onRemoveAllFields={this.onRemoveAllFields} settings={settings} />),
      (<FieldsMapping onSetFieldMapping={this.onSetFieldMapping} onAddUsagetMapping={this.onAddUsagetMapping} addUsagetMapping={this.addUsagetMapping} onRemoveUsagetMapping={this.onRemoveUsagetMapping} onError={this.onError} onSetStaticUsaget={this.onSetStaticUsaget} setUsagetType={this.setUsagetType} settings={settings} usageTypes={usage_types} />),
      (<CalculatorMapping onSetCalculatorMapping={this.onSetCalculatorMapping} onSetRating={this.onSetRating} onSetCustomerMapping={this.onSetCustomerMapping} onSetLineKey={this.onSetLineKey} settings={settings} />),
      (<Receiver onSetReceiverField={this.onSetReceiverField} onSetReceiverCheckboxField={this.onSetReceiverCheckboxField} settings={settings.get('receiver')} />)
    ];

    return (
      <div className="InputProcessor">
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
            <StepLabel>Receiver</StepLabel>
          </Step>
        </Stepper>
        <div className="contents bordered-container">
          { steps[stepIndex] }
        </div>
        <div style={{marginTop: 12, float: "right"}}>
          <button className="btn btn-danger"
                  onClick={this.handleCancel}
                  style={{marginRight: 12}}>
            Cancel
          </button>
          {(() => {
             if (stepIndex > 0) {
               return (
                 <button className="btn"
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
    );
  }
}

function mapStateToProps(state, props) {
  return { settings: state.inputProcessor,
           usage_types: state.settings.get('usage_types') };
}

export default connect(mapStateToProps)(InputProcessor);
