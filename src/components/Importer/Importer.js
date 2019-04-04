import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { Form } from 'react-bootstrap';
import StepUpload from './StepUpload';
import StepMapper from './StepMapper';
import StepValidate from './StepValidate';
import StepResult from './StepResult';
import { ActionButtons, Stepper } from '@/components/Elements';
import { itemSelector } from '@/selectors/entitySelector';
import {
  initImporter,
  deleteImporter,
  updateImporterValue,
  deleteImporterValue,
  sendImport,
} from '@/actions/importerActions';
import { showDanger } from '@/actions/alertsActions';
import { importFieldsOptionsSelector } from '@/selectors/multipleSelectors';
import { getConfig } from '@/common/Util';


class Importer extends Component {

  static propTypes = {
    item: PropTypes.instanceOf(Immutable.Map),
    importFields: PropTypes.array,
    ignoredHeaders: PropTypes.array,
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
    ignoredHeaders: [
      'import_error_message',
      'import_error_row',
    ], // csv comuns that will not shown as option
    onFinish: () => {},
  };

  static importerSteps = [
    {title: 'Upload File'},
    {title: 'Field Map'},
    {title: 'Validate'},
    {title: 'Finish'},
  ];

  state = {
    status: 'create',
    stepIndex: 0,
    mapperPrefix: '__csvindex__',
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
    const { item, predefinedValues, defaultValues, importFields } = this.props;
    const { mapperPrefix } = this.state;
    const lines = item.get('fileContent', []);
    const linker = item.get('linker', null);
    const entity = item.get('entity', []);
    const map = item.get('map', Immutable.List());

    return Immutable.List().withMutations((rowsWithMutations) => {
      if (Array.isArray(lines)) {
        const linesToParse = (limit === -1) ? lines.length : Math.min(limit + 1, lines.length);
        // Ignore first (headers) line
        for (let idx = 1; idx < linesToParse; idx++) {
          const row = Immutable.Map().withMutations((mapWithMutations) => {
            map.forEach((mapperValue, fieldName) => {
              let columnValue = mapperValue;
              if (mapperValue.startsWith(mapperPrefix)) {
                const csvIndex = mapperValue.substring(mapperPrefix.length);
                columnValue = lines[idx][csvIndex];
              }
              const curField = importFields.find(field => field.value === fieldName);
              const fieldType = curField ? curField.type : 'string';
              if (fieldType === 'ranges') {
                columnValue = Immutable.List().withMutations((rangewithMutations) => {
                  const ranges = columnValue.split(',');
                  ranges.forEach((range) => {
                    const rangeValue = range.split('-');
                    rangewithMutations.push(Immutable.Map({
                      from: rangeValue[0],
                      to: rangeValue[1],
                    }));
                  });
                });
              }
              mapWithMutations.set(fieldName, columnValue);
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
            // Set linker for entities with parent<->child relationship
            if (linker !== null && linker.get('field', '') !== '' && linker.get('value', '') !== '') {
              const csvIndex = linker.get('value', '').substring(mapperPrefix.length);
              mapWithMutations.set('__LINKER__', Immutable.Map({
                field: linker.get('field', ''),
                value: lines[idx][csvIndex],
              }));
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
      <Stepper activeStep={stepIndex} steps={Importer.importerSteps} />
    );
  }

  renderStepContent = () => {
    const { item, importFields: fields, entityOptions, ignoredHeaders, defaultValues } = this.props;
    const { stepIndex, mapperPrefix } = this.state;

    const entity = item.get('entity', '');
    const defaultFieldsValues = defaultValues[entity] || [];

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
        <StepMapper
          item={item}
          onChange={this.onChange}
          onDelete={this.onDelete}
          fields={fields}
          defaultFieldsValues={defaultFieldsValues}
          ignoredHeaders={ignoredHeaders}
          mapperPrefix={mapperPrefix}
        />
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
        {this.renderStepper()}
        <hr style={{ margin: '20px -20px 0 -20px' }} />
        <Form horizontal className="mb0">
          {this.renderStepContent()}
        </Form>
        <div className="clearfix" />
        <hr className="mt0" />
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
