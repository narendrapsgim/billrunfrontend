import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import { FormGroup, Col, ControlLabel, Panel } from 'react-bootstrap';


class CsiMapper extends Component {

  static propTypes = {
    fileType: PropTypes.instanceOf(Immutable.Map),
    csiMap: PropTypes.instanceOf(Immutable.Map),
    disabled: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
  };

  static defaultProps = {
    fileType: Immutable.Map(),
    csiMap: Immutable.Map(),
    disabled: false,
  };

  shouldComponentUpdate(nextProps, nextState) { // eslint-disable-line no-unused-vars
    return this.props.disabled !== nextProps.disabled
      || !Immutable.is(this.props.csiMap, nextProps.csiMap);
  }

  onChangeOrigNum = (e) => {
    const { value } = e.target;
    const { fileType } = this.props;
    const mapName = fileType.get('file_type', '');
    this.props.onChange(mapName, 'orig_num', value);
  }

  onChangeBillNum = (e) => {
    const { value } = e.target;
    const { fileType } = this.props;
    const mapName = fileType.get('file_type', '');
    this.props.onChange(mapName, 'bill_num', value);
  }

  onChangeTermNum = (e) => {
    const { value } = e.target;
    const { fileType } = this.props;
    const mapName = fileType.get('file_type', '');
    this.props.onChange(mapName, 'term_num', value);
  }


  renderOptions = () => {
    const { fileType } = this.props;
    return fileType.getIn(['parser', 'custom_keys'], Immutable.List()).map(option => (
      <option key={option} value={option}>{option}</option>
    ));
  }

  render() {
    const { fileType, csiMap, disabled } = this.props;
    return (
      <Panel header={fileType.get('file_type', '')}>
        <FormGroup>
          <Col componentClass={ControlLabel} md={2}>
            Original Number
          </Col>
          <Col sm={6}>
            <select value={csiMap.get('orig_num', '')} onChange={this.onChangeOrigNum} className="form-control" disabled={disabled}>
              <option value="">Select...</option>
              { this.renderOptions() }
            </select>
          </Col>
        </FormGroup>
        <FormGroup>
          <Col componentClass={ControlLabel} md={2}>
            Bill Number
          </Col>
          <Col sm={6}>
            <select value={csiMap.get('bill_num', '')} onChange={this.onChangeBillNum} className="form-control" disabled={disabled}>
              <option value="">Select...</option>
              { this.renderOptions() }
            </select>
          </Col>
        </FormGroup>
        <FormGroup>
          <Col componentClass={ControlLabel} md={2}>
            Term Number
          </Col>
          <Col sm={6}>
            <select value={csiMap.get('term_num', '')} onChange={this.onChangeTermNum} className="form-control" disabled={disabled}>
              <option value="">Select...</option>
              { this.renderOptions() }
            </select>
          </Col>
        </FormGroup>
      </Panel>
    );
  }
}

export default CsiMapper;
