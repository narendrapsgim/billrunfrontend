import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import { Form, Panel } from 'react-bootstrap';
import { Step, Stepper, StepLabel } from 'material-ui/Stepper';
import StepUpload from './StepUpload';
import StepMapper from './StepMapper';
import StepFinish from './StepFinish';
import { ActionButtons } from '../Elements';

class Importer extends Component {

  static propTypes = {
    existinGrousNames: PropTypes.instanceOf(Immutable.List),
  }

  static defaultProps = {
    existinGrousNames: Immutable.List(),
  };

  state = {
    stepIndex: 0,
  }

  renderStepper = () => {
    const { stepIndex } = this.state;
    return (
      <Stepper activeStep={stepIndex}>
        <Step key={0}>
          <StepLabel>Upload File</StepLabel>
        </Step>
        <Step key={1}>
          <StepLabel>Field Map</StepLabel>
        </Step>
        <Step key={2}>
          <StepLabel>Finish</StepLabel>
        </Step>
      </Stepper>
    );
  }

  renderStepContent = () => {
    const { stepIndex } = this.state;
    switch (stepIndex) {
      case 0:
        return (<StepUpload />);
      case 1:
        return (<StepMapper />);
      case 2:
        return (<StepFinish />);

      default:
        return (<p>Not valid Step</p>);
    }
  }

  renderActionButtons = () => {
    const { stepIndex } = this.state;
    return (
      <ActionButtons
        cancelLabel="Next"
        onClickCancel={this.nextStep}
        disableCancel={stepIndex === 2}
        saveLabel="Back"
        disableSave={stepIndex === 0}
        onClickSave={this.prevStep}
        reversed={true}
      />
    );
  }

  nextStep = () => {
    const { stepIndex } = this.state;
    this.setState({ stepIndex: stepIndex + 1 });
  }

  prevStep = () => {
    const { stepIndex } = this.state;
    this.setState({ stepIndex: stepIndex - 1 });
  }

  render() {
    return (
      <div>
        <Panel header={this.renderStepper()}>
          <Form horizontal>
            {this.renderStepContent()}
          </Form>
        </Panel>
        {this.renderActionButtons()}
      </div>
    );
  }
}


export default Importer;
