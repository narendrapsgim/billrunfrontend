import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { Form, Panel } from 'react-bootstrap';
import { Step, Stepper, StepLabel } from 'material-ui/Stepper';
import StepUpload from './StepUpload';
import StepMapper from './StepMapper';
import StepValidate from './StepValidate';
import StepResult from './StepResult';
import { ActionButtons } from '../Elements';
import { itemSelector } from '../../selectors/entitySelector';
import {
  initImporter,
  deleteImporter,
  updateImporterValue,
  deleteImporterValue,
  sendImport,
} from '../../actions/importerActions';
import { importFieldsOptionsSelector } from '../../selectors/multipleSelectors';
import { getConfig } from '../../common/Util';


class Importer extends Component {

  static propTypes = {
    item: PropTypes.instanceOf(Immutable.Map),
    importFields: PropTypes.array,
    predefinedValues: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string,
        value: PropTypes.string,
      }),
    ),
    defaultValues: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string,
        value: PropTypes.string,
      }),
    ),
    entity: PropTypes.oneOf(['', 'subscription', 'customer']),
    onFinish: PropTypes.func,
    dispatch: PropTypes.func.isRequired,
  }

  static defaultProps = {
    item: Immutable.Map(),
    entity: '',
    importFields: [],
    predefinedValues: [],
    defaultValues: [],
    onFinish: () => {},
  };

  state = {
    status: 'create',
    stepIndex: 0,
  }

  componentDidMount() {
    const { entity } = this.props;
    this.props.dispatch(initImporter());
    if (entity !== '') {
      this.onChange('entity', entity);
    }
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

  onFinish = () => {
    this.props.onFinish();
  }

  onImport = () => {
    const { item } = this.props;
    const entity = item.get('entity', '');
    const rows = this.getFormatedRows();
    this.setState({ status: 'progress' });
    const collection = getConfig(['systemItems', entity, 'collection'], '');
    this.props.dispatch(sendImport(collection, rows)).then(this.afterImport);
  }

  onNextStep = () => {
    const { stepIndex } = this.state;
    this.setState({ stepIndex: stepIndex + 1 });
  }

  onPrevStep = () => {
    const { stepIndex } = this.state;
    this.setState({ stepIndex: stepIndex - 1 });
  }

  getOkButtonLable = () => {
    const { stepIndex } = this.state;
    switch (stepIndex) {
      case 2:
      case '2':
        return 'Import';
      case 3:
      case '3':
        return 'Close';
      default:
        return 'Next';
    }
  }

  getOkButtonAction = () => {
    const { stepIndex } = this.state;
    switch (stepIndex) {
      case 2:
      case '2':
        return this.onImport;
      case 3:
      case '3':
        return this.onFinish;
      default:
        return this.onNextStep;
    }
  }

  getFormatedRows = (limit = -1) => {
    const { item, predefinedValues, defaultValues } = this.props;
    const fileContent = item.get('fileContent', '');
    const fileDelimiter = item.get('fileDelimiter', '');
    const map = item.get('map', Immutable.List());

    return Immutable.List().withMutations((rowsWithMutations) => {
      const lines = fileContent.split('\n');
      const linesToParse = limit === -1 ? lines.length - 1 : Math.min(limit + 1, lines.length - 1);
      if (Array.isArray(lines)) {
        // Ignore first (headers) and last (empty) lines
        for (let idx = 1; idx < linesToParse; idx++) {
          const row = Immutable.Map().withMutations((mapWithMutations) => {
            const line = lines[idx].split(fileDelimiter);
            map.forEach((fieldName, key) => {
              if (fieldName && fieldName !== '') {
                mapWithMutations.set(fieldName, line[key]);
              }
            });
            // Set predefined values
            predefinedValues.forEach((predefinedValue) => {
              mapWithMutations.set(predefinedValue.key, predefinedValue.value);
            });
            // Set predefined values
            defaultValues.forEach((defaultValue) => {
              if (!mapWithMutations.has(defaultValue.key)) {
                mapWithMutations.set(defaultValue.key, defaultValue.value);
              }
            });
          });
          rowsWithMutations.push(row);
        }
      }
    });
  }

  afterImport = (response) => {
    if ([1, 2].includes(response.status)) {
      const result = response.data;
      const allSuccess = result.every(status => status === true);
      const allFails = result.every(status => status !== true);
      if (allSuccess || (result.length > 0 && !allFails)) {
        this.setState({ status: 'finish' });
      } else {
        this.setState({ status: 'create' });
      }
      this.onChange('result', result);
      this.onNextStep();
    } else {
      this.onDelete('result');
      this.setState({ status: 'create' });
    }
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
          <StepLabel>Validate</StepLabel>
        </Step>
        <Step key={3}>
          <StepLabel>Finish</StepLabel>
        </Step>
      </Stepper>
    );
  }

  renderStepContent = () => {
    const { item, importFields: fields, entity } = this.props;
    const { stepIndex } = this.state;
    switch (stepIndex) {
      case 0: return (
        <StepUpload item={item} onChange={this.onChange} onDelete={this.onDelete} selectedEntity={entity !== ''} />
      );
      case 1: return (
        <StepMapper item={item} onChange={this.onChange} onDelete={this.onDelete} fields={fields} />
      );
      case 2: return (
        <StepValidate item={item} getFormatedRows={this.getFormatedRows} />
      );
      case 3: return (
        <StepResult item={item} />
      );
      default: return (
        <p>Not valid Step</p>
      );
    }
  }

  renderActionButtons = () => {
    const { stepIndex, status } = this.state;
    const inProgress = status === 'progress';
    const inFinish = status === 'finish';
    console.log('status: ', status);
    return (
      <ActionButtons
        cancelLabel={this.getOkButtonLable()}
        onClickCancel={this.getOkButtonAction()}
        disableCancel={inProgress}
        saveLabel="Back"
        disableSave={stepIndex === 0 || inProgress || inFinish}
        onClickSave={this.onPrevStep}
        reversed={true}
      />
    );
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
  importFields: importFieldsOptionsSelector(state, props, 'importer'),
});

export default connect(mapStateToProps)(Importer);
