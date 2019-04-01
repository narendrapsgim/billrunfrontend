import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { FormGroup, ControlLabel, Col, HelpBlock, Button } from 'react-bootstrap';
import Papa from 'papaparse';
import filesize from 'file-size';
import { sentenceCase } from 'change-case';
import Field from '@/components/Field';
import { getConfig } from '@/common/Util';

class StepUpload extends Component {

  static propTypes = {
    item: PropTypes.instanceOf(Immutable.Map),
    delimiterOptions: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.string,
        label: PropTypes.string,
      }),
    ),
    entityOptions: PropTypes.arrayOf(PropTypes.string),
    onChange: PropTypes.func,
    onDelete: PropTypes.func,
  }

  static defaultProps = {
    item: Immutable.Map(),
    delimiterOptions: [
      { value: '	', label: 'Tab' }, // eslint-disable-line no-tabs
      { value: ' ', label: 'Space' },
      { value: ',', label: 'Comma' },
    ],
    entityOptions: ['customer', 'subscription'],
    onChange: () => {},
    onDelete: () => {},
  }

  state = {
    fileError: null,
    delimiterError: null,
  }

  resetFile = () => {
    this.props.onChange('fileContent', '');
    this.props.onChange('fileName', '');
  }

  onParseScvComplete = (results, file) => {
    if (results.errors.length === 0) {
      this.props.onChange('fileContent', results.data);
      this.props.onChange('fileName', file.name);
    } else {
      this.setState({ fileError: 'Error in CSV file' });
      this.resetFile();
    }
  }

  onParseScvError = (error, file) => { // eslint-disable-line no-unused-vars
    this.setState({ fileError: 'Error in CSV file' });
    this.resetFile();
  }

  onFileUpload = (e) => {
    const { item } = this.props;
    const { files } = e.target;
    if (this.isValidFile(files[0])) {
      const delimiter = item.get('fileDelimiter', ',');
      Papa.parse(files[0], {
        skipEmptyLines: true,
        delimiter,
        header: false,
        complete: this.onParseScvComplete,
        error: this.onParseScvError,
      });
    } else {
      const maxBytesSize = getConfig('importMaxSize', 8) * 1024 * 1024;
      this.setState({ fileError: `Max file size is ${filesize(maxBytesSize).human()}` });
      e.target.value = null;
    }
  }

  onFileReset = (e) => {
    e.target.value = null;
    this.resetFile();
  }

  onChangeDelimiter = (value) => {
    if (value.length) {
      this.props.onChange('fileDelimiter', value);
      this.setState({ delimiterError: null });
      // this.resetFile(); can be called to programmatically remove file
    } else {
      this.props.onDelete('fileDelimiter');
      this.setState({ delimiterError: 'Delimiter is required' });
    }
  }

  onChangeEntity = (value) => {
    this.props.onDelete('map');
    if (value.length) {
      this.props.onChange('entity', value);
    } else {
      this.props.onDelete('entity');
    }
  }

  isValidFile = (file) => {
    const maxBytesSize = getConfig('importMaxSize', 8) * 1024 * 1024;
    return file.size <= maxBytesSize;
  };

  createEntityTypeOptions = entityOptions => entityOptions.map(entityKey => ({
    value: entityKey,
    label: sentenceCase(getConfig(['systemItems', entityKey, 'itemName'], entityKey)),
  }));

  render() {
    const { delimiterError, fileError } = this.state;
    const { item, delimiterOptions, entityOptions } = this.props;
    const delimiter = item.get('fileDelimiter', '');
    const entity = item.get('entity', '');
    const fileName = item.get('fileName', '');
    const isSingleEntity = (entityOptions && entityOptions.length === 1);
    const options = this.createEntityTypeOptions(entityOptions);
    const fileParsed = fileName !== '';

    return (
      <div className="StepUpload">
        { !isSingleEntity && (
          <FormGroup>
            <Col sm={3} componentClass={ControlLabel}>Entity</Col>
            <Col sm={9}>
              <Field
                fieldType="select"
                onChange={this.onChangeEntity}
                options={options}
                value={entity}
                placeholder="Select entity to import...."
                clearable={false}
              />
            </Col>
          </FormGroup>
        )}
        <FormGroup validationState={delimiterError === null ? null : 'error'}>
          <Col sm={3} componentClass={ControlLabel}>Delimiter</Col>
          <Col sm={9}>
            <Field
              fieldType="select"
              allowCreate={true}
              onChange={this.onChangeDelimiter}
              options={delimiterOptions}
              value={delimiter}
              placeholder="Select or add new"
              addLabelText="{label}"
              clearable={false}
              disabled={fileParsed}
            />
            { delimiterError !== null && <HelpBlock>{delimiterError}.</HelpBlock>}
            { fileParsed && <HelpBlock className="mb0">To change delimiter please remove CSV file.</HelpBlock>}
          </Col>
        </FormGroup>
        <FormGroup validationState={fileError === null ? null : 'error'}>
          <Col sm={3} componentClass={ControlLabel}>Upload CSV</Col>
          <Col sm={9}>
            <div style={{ paddingTop: 5 }} >
              {fileName !== ''
                ? (<p style={{ margin: 0 }}>
                  {fileName}
                  <Button
                    bsStyle="link"
                    title="Remove file"
                    onClick={this.onFileReset}
                    style={{ padding: '0 0 0 10px', marginBottom: 1 }}
                  >
                    <i className="fa fa-minus-circle danger-red" />
                  </Button>
                </p>)
                : <input type="file" accept=".csv" onChange={this.onFileUpload} onClick={this.onFileReset} />
              }
              {fileError !== null && <HelpBlock>{fileError}.</HelpBlock>}
            </div>
          </Col>
        </FormGroup>
      </div>
    );
  }
}

export default StepUpload;
