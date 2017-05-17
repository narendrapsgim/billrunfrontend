import React, { Component, PropTypes } from 'react';
import { FormGroup, Col, InputGroup } from 'react-bootstrap';
import Select from 'react-select';
import Field from '../Field';

class StepUpload extends Component {

  state = {
    delimiter: ',',
    delimiterType: 'separator',
    headers: [],
  }

  onfileUpload = (e) => {
    const { delimiter } = this.state;
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = ((evt) => {
      if (evt.target.readyState === FileReader.DONE) {
        /* Only need first line */
        const lines = evt.target.result.split('\n');
        const header = lines[0];
        const headers = header
          .split(delimiter)
          .map(field => field.replace(/[^a-zA-Z_\d]/g, '_').toLowerCase());
        this.setState({ headers });
      }
    });
    const blob = file.slice(0, file.size - 1);
    reader.readAsText(blob);
  }

  onChangeDelimiterType = (e) => {
    const { value: delimiterType } = e.target;
    this.setState({ delimiterType });
  }

  onChangeDelimiter = (delimiter) => {
    this.setState({ delimiter });
  }

  render() {
    const { delimiter, delimiterType } = this.state;

    const delimiterOptions = [
      { value: '	', label: 'Tab' }, // eslint-disable-line no-tabs
      { value: ' ', label: 'Space' },
    ];

    return (
      <Col md={12} className="StepUpload">
        <FormGroup>
          <Col sm={3}>Delimiter</Col>
          <Col sm={8}>
            <InputGroup>
              <InputGroup.Addon className="delimiter_type">
                <Field
                  className="delimiter_type"
                  fieldType="radio"
                  onChange={this.onChangeDelimiterType}
                  name="delimiter_type"
                  value="separator"
                  label="By delimiter"
                  checked={delimiterType === 'separator'}
                />
              </InputGroup.Addon>
              <Select
                id="separator"
                className="delimiter-select"
                allowCreate
                onChange={this.onChangeDelimiter}
                options={delimiterOptions}
                value={delimiter}
                placeholder="Select or type..."
                addLabelText="{label}"
              />
            </InputGroup>
            <Field
              fieldType="radio"
              onChange={this.onChangeDelimiterType}
              name="delimiter_type"
              value="fixed"
              label="Fixed"
              checked={delimiterType === 'fixed'}
            />
          </Col>
        </FormGroup>
        <FormGroup>
          <Col sm={3}>Upload CSV</Col>
          <Col sm={8}>
            <input type="file" onChange={this.onfileUpload} />
          </Col>
        </FormGroup>
      </Col>
    );
  }
}


export default StepUpload;
