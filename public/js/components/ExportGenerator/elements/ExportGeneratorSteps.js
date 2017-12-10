import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Step, Stepper, StepLabel} from 'material-ui/Stepper';

class ExportGeneratorSteps extends Component {
  static propTypes = {
    stepIndex: React.PropTypes.number.isRequired
  }

  render() {
    let stepStyle = {color: '#4cae4c'};
    return (
      <div className="br-stepper">
        <Stepper activeStep={this.props.stepIndex}>
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
  }
}

/*ExportGeneratorSteps.contextTypes = {
  stepIndex: React.PropTypes.number
};*/

function mapStateToProps(state, props) {
  return {};
}

export default connect(mapStateToProps)(ExportGeneratorSteps);
