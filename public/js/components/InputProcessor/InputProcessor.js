import React, { Component } from 'react';
import { connect } from 'react-redux';

import { setDelimiter, setFields, setFieldMapping, addCSVField, addUsagetMapping, setCustomerMapping, setRatingField, saveInputProcessorSettings } from '../../actions/inputProcessorActions';

import SampleCSV from './SampleCSV';
import FieldsMapping from './FieldsMapping';
import CalculatorMapping from './CalculatorMapping';

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

    this.onSetCalculatorMapping = this.onSetCalculatorMapping.bind(this);
    this.onChangeDelimiter = this.onChangeDelimiter.bind(this);
    this.onSelectSampleCSV = this.onSelectSampleCSV.bind(this);
    this.onSetFieldMapping = this.onSetFieldMapping.bind(this);
    this.onSetRating = this.onSetRating.bind(this);
    this.onAddField = this.onAddField.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handlePrev = this.handlePrev.bind(this);

    this.state = {
      stepIndex: 0,
      finished: 0
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.stepIndex !== this.state.stepIndex;
  }
  
  onChangeDelimiter(e) {
    this.props.dispatch(setDelimiter(e.target.value));
  }
  
  onSelectSampleCSV(e) {
    let file = e.target.files[0];
    let reader = new FileReader();
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

  save() {
    this.props.dispatch(saveInputProcessorSettings(this.props.settings));
  }
  
  handleNext() {
    const { stepIndex } = this.state;
    if (this.state.finished) {
      this.save();
      return;
    }
    const totalSteps = 2; // TODO: don't hardcode
    let finished = (stepIndex + 1) === totalSteps;
    this.setState({
      stepIndex: stepIndex + 1,
      finished
    });
  }

  handlePrev() {
    const { stepIndex } = this.state;
    if (stepIndex > 0) this.setState({stepIndex: stepIndex - 1, finished: 0});
  }
  
  render() {
    let { stepIndex } = this.state;

    const steps = [
      (<SampleCSV onChangeDelimiter={this.onChangeDelimiter} onSelectSampleCSV={this.onSelectSampleCSV} onAddField={this.onAddField} />),
      (<FieldsMapping onSetFieldMapping={this.onSetFieldMapping} onAddUsagetMapping={this.onAddUsagetMapping} />),
      (<CalculatorMapping onSetCalculatorMapping={this.onSetCalculatorMapping} onSetRating={this.onSetRating} />)
    ];

    return (
      <div className="InputProcessor container">
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
        </Stepper>
        <div className="contents bordered-container">
          { steps[stepIndex] }
        </div>
        <div style={{marginTop: 12, float: "right"}}>
          <FlatButton
              label="Back"
              onTouchTap={this.handlePrev}
              disabled={this.stepIndex === 0}
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
  return {settings: state.inputProcessor};
}

export default connect(mapStateToProps)(InputProcessor);
