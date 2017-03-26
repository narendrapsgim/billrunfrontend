import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import { FormGroup, Col, ControlLabel, Panel } from 'react-bootstrap';


class CsiMapper extends Component {

  static propTypes = {
    fileType: PropTypes.string,
    usageType: PropTypes.string,
    csiMap: PropTypes.instanceOf(Immutable.Map),
    options: PropTypes.instanceOf(Immutable.List),
    disabled: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
  };

  static defaultProps = {
    fileType: '',
    usageType: '',
    csiMap: Immutable.Map(),
    options: Immutable.List(),
    disabled: false,
  };

  shouldComponentUpdate(nextProps, nextState) { // eslint-disable-line no-unused-vars
    return this.props.disabled !== nextProps.disabled
      || !Immutable.is(this.props.csiMap, nextProps.csiMap);
  }

  onChangeOrigNum = (e) => {
    const { value } = e.target;
    const { fileType, usageType } = this.props;
    this.props.onChange(fileType, usageType, 'orig_num', value);
  }

  onChangeTermNum = (e) => {
    const { value } = e.target;
    const { fileType, usageType } = this.props;
    this.props.onChange(fileType, usageType, 'term_num', value);
  }


  renderOptions = () => {
    const { options } = this.props;
    return options.map(option => (
      <option key={option} value={option}>{option}</option>
    ));
  }

  render() {
    const { fileType, usageType, csiMap, disabled } = this.props;
    return (
      <Panel header={`${fileType} - ${usageType}`}>
        <FormGroup>
          <Col componentClass={ControlLabel} md={2}>
            Origin Number
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
