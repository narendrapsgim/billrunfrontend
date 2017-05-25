import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import { FormGroup, ControlLabel, Col, HelpBlock } from 'react-bootstrap';
import Select from 'react-select';
import Papa from 'papaparse';
import filesize from 'file-size';
import { getConfig } from '../../common/Util';

class StepUpload extends Component {

  static propTypes = {
    item: PropTypes.instanceOf(Immutable.Map),
    delimiterOptions: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.string,
        label: PropTypes.string,
      }),
    ),
    entityOptions: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.string,
        label: PropTypes.string,
      }),
    ),
    onChange: PropTypes.func,
    onDelete: PropTypes.func,
  }

  static defaultProps = {
    item: Immutable.Map(),
    delimiterOptions: [
      { value: '	', label: 'Tab' }, // eslint-disable-line no-tabs
      { value: ' ', label: 'Space' },
      { value: ',', label: 'Comma (,)' },
    ],
    entityOptions: [
      { value: 'customer', label: 'Customers' },
      { value: 'subscription', label: 'Subscriptions' },
    ],
    onChange: () => {},
    onDelete: () => {},
  }

  state = {
    fileError: null,
    delimiterError: null,
  }

  onParseScvComplete = (results, file) => {
    if (results.errors.length === 0) {
      this.props.onChange('fileContent', results.data);
      this.props.onChange('fileName', file.name);
    } else {
      this.setState({ fileError: 'Error in CSV file' });
      this.props.onChange('fileContent', '');
      this.props.onChange('fileName', '');
    }
  }

  onParseScvError = (error, file) => { // eslint-disable-line no-unused-vars
    this.setState({ fileError: 'Error in CSV file' });
    this.props.onChange('fileContent', '');
    this.props.onChange('fileName', '');
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
    this.props.onChange('fileContent', '');
    this.props.onChange('fileName', '');
  }

  onChangeDelimiter = (value) => {
    if (value.length) {
      this.props.onChange('fileDelimiter', value);
      this.setState({ delimiterError: null });
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

  render() {
    const { delimiterError, fileError } = this.state;
    const { item, delimiterOptions, entityOptions } = this.props;
    const delimiter = item.get('fileDelimiter', '');
    const entity = item.get('entity', '');

    const isSingleEntity = (entityOptions && entityOptions.length === 1);

    return (
      <Col md={12} className="StepUpload">
        { !isSingleEntity && (
          <FormGroup>
            <Col sm={3} componentClass={ControlLabel}>Entity</Col>
            <Col sm={9}>
              <Select
                onChange={this.onChangeEntity}
                options={entityOptions}
                value={entity}
                placeholder="Select entity to import...."
              />
            </Col>
          </FormGroup>
        )}
        <FormGroup validationState={delimiterError === null ? null : 'error'}>
          <Col sm={3} componentClass={ControlLabel}>Delimiter</Col>
          <Col sm={9}>
            <Select
              allowCreate
              onChange={this.onChangeDelimiter}
              options={delimiterOptions}
              value={delimiter}
              placeholder="Select or add new"
              addLabelText="{label}"
            />
            { delimiterError !== null && <HelpBlock>{delimiterError}.</HelpBlock>}
          </Col>
        </FormGroup>
        <FormGroup validationState={fileError === null ? null : 'error'}>
          <Col sm={3} componentClass={ControlLabel}>Upload CSV</Col>
          <Col sm={9}>
            <input type="file" accept=".csv" onChange={this.onFileUpload} onClick={this.onFileReset} />
            { fileError !== null && <HelpBlock>{fileError}.</HelpBlock>}
          </Col>
        </FormGroup>
      </Col>
    );
  }
}

export default StepUpload;
