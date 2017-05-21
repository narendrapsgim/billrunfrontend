import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { Form, Panel } from 'react-bootstrap';
import { Step, Stepper, StepLabel } from 'material-ui/Stepper';
import StepUpload from './StepUpload';
import StepMapper from './StepMapper';
import StepFinish from './StepFinish';
import { ActionButtons } from '../Elements';
import { itemSelector } from '../../selectors/entitySelector';
import {
  initImporter,
  deleteImporter,
  updateImporterValue,
  deleteImporterValue,
} from '../../actions/importerActions';


class Importer extends Component {

  static propTypes = {
    item: PropTypes.instanceOf(Immutable.Map),
    dispatch: PropTypes.func.isRequired,
  }

  static defaultProps = {
    item: Immutable.Map(),
  };

  state = {
    stepIndex: 0,
  }

  componentDidMount() {
    this.props.dispatch(initImporter());
  }

  componentWillUnmount() {
    this.props.dispatch(deleteImporter());
  }

  onChange = (path, value) => {
    this.props.dispatch(updateImporterValue(path, value));
  }

  onDelete = (path) => {
    this.props.dispatch(deleteImporterValue(path));
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
    const { item } = this.props;
    const { stepIndex } = this.state;
    switch (stepIndex) {
      case 0:
        return (
          <StepUpload
            item={item}
            onChange={this.onChange}
            onDelete={this.onDelete}
          />
        );
      case 1:
        return (
          <StepMapper
            item={item}
            onChange={this.onChange}
            onDelete={this.onDelete}
          />
        );
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

const mapStateToProps = (state, props) => ({
  item: itemSelector(state, props, 'importer'),
});

export default connect(mapStateToProps)(Importer);
