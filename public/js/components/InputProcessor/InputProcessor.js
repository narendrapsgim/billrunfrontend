import React, { Component } from 'react';
import { connect } from 'react-redux';

import { clearInputProcessor, getProcessorSettings, setName, setDelimiterType, setDelimiter, setFields, setFieldMapping, setFieldWidth, addCSVField, addUsagetMapping, setCustomerMapping, setRatingField, setReceiverField, saveInputProcessorSettings } from '../../actions/inputProcessorActions';

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
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

class InputProcessor extends Component {
  constructor(props) {
    super(props);

    this.onSetReceiverCheckboxField = this.onSetReceiverCheckboxField.bind(this);
    this.onSetCalculatorMapping = this.onSetCalculatorMapping.bind(this);
    this.onSetCustomerMapping = this.onSetCustomerMapping.bind(this);
    this.onSetReceiverField = this.onSetReceiverField.bind(this);
    this.onSetDelimiterType = this.onSetDelimiterType.bind(this);
    this.onAddUsagetMapping = this.onAddUsagetMapping.bind(this);
    this.onChangeDelimiter = this.onChangeDelimiter.bind(this);
    this.onSelectSampleCSV = this.onSelectSampleCSV.bind(this);
    this.onSetFieldMapping = this.onSetFieldMapping.bind(this);
    this.onSetFieldWidth = this.onSetFieldWidth.bind(this);
    this.onChangeName = this.onChangeName.bind(this);
    this.onSetRating = this.onSetRating.bind(this);
    this.onAddField = this.onAddField.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handlePrev = this.handlePrev.bind(this);

    this.state = {
      stepIndex: 0,
      finished: 0
    };
  }

  componentWillMount() {
    const { dispatch, fileType } = this.props;
    dispatch(getProcessorSettings(fileType));
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
        let fields = header.split(this.props.settings.get('delimiter'));
        this.props.dispatch(setFields(fields));
      }
    });
    let blob = file.slice(0, file.size - 1);
    reader.readAsText(blob);
  }

  onAddField(val, e) {
    this.props.dispatch(addCSVField(val));
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

  onAddUsagetMapping(val, e) {
    this.props.dispatch(addUsagetMapping(val));
  }

  onSetCustomerMapping(e) {
    const { value: mapping, id: field } = e.target;
    this.props.dispatch(setCustomerMapping(field, mapping));
  }

  onSetRating(e) {
    const { dataset: {usaget, rate_key}, value } = e.target;
    this.props.dispatch(setRatingField(usaget, rate_key, value));
  }

  onSetReceiverField(e) {
    const { id, value } = e.target;
    this.props.dispatch(setReceiverField(id, value));
  }
  
  onSetReceiverCheckboxField(e) {
    const { id, checked } = e.target;
    this.props.dispatch(setReceiverField(id, checked));
  }
  
  save() {
    this.props.dispatch(saveInputProcessorSettings(this.props.settings));
  }
  
  handleNext() {
    const { stepIndex } = this.state;
    if (this.state.finished) {
      this.save();
      return;
    }
    const totalSteps = 3; // TODO: don't hardcode
    let finished = (stepIndex + 1) === totalSteps;
    this.setState({
      stepIndex: stepIndex + 1,
      finished
    });
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
  
  render() {
    let { stepIndex } = this.state;
    const { settings } = this.props;

    const steps = [
      (<SampleCSV onChangeName={this.onChangeName} onSetDelimiterType={this.onSetDelimiterType} onChangeDelimiter={this.onChangeDelimiter} onSelectSampleCSV={this.onSelectSampleCSV} onAddField={this.onAddField} onSetFieldWidth={this.onSetFieldWidth} settings={settings} />),
      (<FieldsMapping onSetFieldMapping={this.onSetFieldMapping} onAddUsagetMapping={this.onAddUsagetMapping} settings={settings} />),
      (<CalculatorMapping onSetCalculatorMapping={this.onSetCalculatorMapping} onSetRating={this.onSetRating} onSetCustomerMapping={this.onSetCustomerMapping} settings={settings} />),
      (<Receiver onSetReceiverField={this.onSetReceiverField} onSetReceiverCheckboxField={this.onSetReceiverCheckboxField} settings={settings.get('receiver')} />)
    ];

    return (
      <div className="InputProcessor">
        <h3>Input Processor</h3>
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
          <FlatButton
              label={stepIndex === 0 ? "Cancel" : "Back"}
              onTouchTap={this.handlePrev}
              style={{marginRight: 12}} />
          <RaisedButton
              label={stepIndex === (steps.length - 1) ? "Finish" : "Next"}
              primary={true}
              onTouchTap={this.handleNext} />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return { settings: state.inputProcessor };
}

export default connect(mapStateToProps)(InputProcessor);
