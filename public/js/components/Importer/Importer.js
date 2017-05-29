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
import { showDanger } from '../../actions/alertsActions';
import { importFieldsOptionsSelector } from '../../selectors/multipleSelectors';
import { getConfig } from '../../common/Util';


class Importer extends Component {

  static propTypes = {
    item: PropTypes.instanceOf(Immutable.Map),
    importFields: PropTypes.array,
    predefinedValues: PropTypes.object,
    defaultValues: PropTypes.object,
    entityOptions: PropTypes.arrayOf(PropTypes.string),
    onFinish: PropTypes.func,
    dispatch: PropTypes.func.isRequired,
  }

  static defaultProps = {
    item: Immutable.Map(),
    importFields: [],
    predefinedValues: {},
    // predefinedValues={{ // example
    //   customer: [{
    //     key: 'type',
    //     value: 'account',
    //   }]
    // }}
    defaultValues: {},
    // defaultValues={{ // example
    //   customer: [{
    //     key: 'company_name',
    //     value: 'Def Com name',
    //   }]
    // }}
    onFinish: () => {},
  };

  state = {
    status: 'create',
    stepIndex: 0,
  }

  componentDidMount() {
    const { entityOptions } = this.props;
    this.props.dispatch(initImporter());
    const isSingleEntity = (entityOptions && entityOptions.length === 1);
    if (isSingleEntity) {
      this.onChange('entity', entityOptions[0]);
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
    if (rows.size > 0 && entity !== '') {
      this.setState({ status: 'progress' });
      const collection = getConfig(['systemItems', entity, 'collection'], '');
      this.props.dispatch(sendImport(collection, rows)).then(this.afterImport);
    } else {
      this.props.dispatch(showDanger('No Import data found'));
    }
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
        return 'Confirm and Import';
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
    const lines = item.get('fileContent', []);
    const entity = item.get('entity', []);
    const map = item.get('map', Immutable.List());

    return Immutable.List().withMutations((rowsWithMutations) => {
      if (Array.isArray(lines)) {
        const linesToParse = (limit === -1) ? lines.length : Math.min(limit + 1, lines.length);
        // Ignore first (headers) line
        for (let idx = 1; idx < linesToParse; idx++) {
          const row = Immutable.Map().withMutations((mapWithMutations) => {
            map.forEach((csvFieldIndex, fieldName) => {
              if (csvFieldIndex !== '') {
                const value = isNaN(csvFieldIndex) ? csvFieldIndex : lines[idx][csvFieldIndex];
                mapWithMutations.set(fieldName, value);
              }
            });
            // Set predefined values
            if (predefinedValues.hasOwnProperty(entity)) {
              predefinedValues[entity].forEach((predefinedValue) => {
                mapWithMutations.set(predefinedValue.key, predefinedValue.value);
              });
            }
            // Set predefined values
            if (defaultValues.hasOwnProperty(entity)) {
              defaultValues[entity].forEach((defaultValue) => {
                if (mapWithMutations.get(defaultValue.key, '') === '') {
                  mapWithMutations.set(defaultValue.key, defaultValue.value);
                }
              });
            }
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
    const { item, importFields: fields, entityOptions } = this.props;
    const { stepIndex } = this.state;

    switch (stepIndex) {
      case 0: return (
        <StepUpload
          item={item}
          onChange={this.onChange}
          onDelete={this.onDelete}
          entityOptions={entityOptions}
        />
      );
      case 1: return (
        <StepMapper item={item} onChange={this.onChange} onDelete={this.onDelete} fields={fields} />
      );
      case 2: return (
        <StepValidate fields={fields} getFormatedRows={this.getFormatedRows} />
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
      <div className="Importer">
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
