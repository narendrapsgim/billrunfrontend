import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import { FormGroup, Col } from 'react-bootstrap';
import Select from 'react-select';
import { readAsText } from 'promise-file-reader';


class StepUpload extends Component {

  static propTypes = {
    item: PropTypes.instanceOf(Immutable.Map),
    delimiterOptions: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.string,
        label: PropTypes.string
      }),
    ),
    onChange: PropTypes.func,
    onDelete: PropTypes.func,
  };

  static defaultProps = {
    item: Immutable.Map(),
    delimiterOptions: [
      { value: '	', label: 'Tab' }, // eslint-disable-line no-tabs
      { value: ' ', label: 'Space' },
      { value: ',', label: 'Comma (,)' },
    ],
    onChange: () => {},
    onDelete: () => {},
  };

  onfileReset = (e) => {
    e.target.value = null;
  }

  onfileUpload = (e) => {
    const file = e.target.files[0];
    this.props.onChange('file', file);
    readAsText(file)
      .then((fileContent) => {
        this.props.onChange('fileContent', fileContent);
      })
      .catch(() => {
        this.props.onChange('fileContent', '');
      });
  };

  onChangeDelimiter = (value) => {
    this.props.onChange('fileDelimiter', value);
  };

  render() {
    const { item, delimiterOptions } = this.props;
    const delimiter = item.get('fileDelimiter', '');

    return (
      <Col md={12} className="StepUpload">
        <FormGroup>
          <Col sm={3} style={{ marginTop: 7 }}>Delimiter</Col>
          <Col sm={9}>
            <Select
              allowCreate
              onChange={this.onChangeDelimiter}
              options={delimiterOptions}
              value={delimiter}
              placeholder="Select or add new"
              addLabelText="{label}"
            />
          </Col>
        </FormGroup>
        <FormGroup>
          <Col sm={3}>Upload CSV</Col>
          <Col sm={9}>
            <input type="file" accept=".csv" onChange={this.onfileUpload} onClick={this.onfileReset} />
          </Col>
        </FormGroup>
        <FormGroup>
          <Col sm={3}>Headers</Col>
          <Col sm={9}>
            <ul>
              {}
            </ul>
          </Col>
        </FormGroup>
      </Col>
    );
  }

}

export default StepUpload;
