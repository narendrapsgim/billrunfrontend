import React from 'react';
import PropTypes from 'prop-types';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';

const ExportGeneratorSteps = ({ stepIndex }) => (
  <div className="br-stepper">
    <Stepper activeStep={stepIndex}>
      <Step>
        <StepLabel>Choose Input</StepLabel>
      </Step>
      <Step>
        <StepLabel>Segmentation</StepLabel>
      </Step>

      <Step>
        <StepLabel>FTP Details</StepLabel>
      </Step>
    </Stepper>
  </div>
)


ExportGeneratorSteps.propTypes = {
  stepIndex: PropTypes.number.isRequired
}


export default ExportGeneratorSteps;
