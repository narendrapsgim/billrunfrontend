import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import { FormGroup, Col, ControlLabel, InputGroup, HelpBlock } from 'react-bootstrap';
import Field from '../../Field';


class CollectionDetails extends Component {

  static propTypes = {
    item: PropTypes.instanceOf(Immutable.Map),
    onChange: PropTypes.func.isRequired,
  };

  static defaultProps = {
    item: Immutable.Map(),
  };

  onChangeDays = (e) => {
    const { value } = e.target;
    this.props.onChange(['do_after_days'], value);
  }
  onChangeName = (e) => {
    const { value } = e.target;
    this.props.onChange(['name'], value);
  }
  onChangeActive = (e) => {
    const { value } = e.target;
    this.props.onChange(['active'], value === 'yes');
  }

  render() {
    const { item } = this.props;
    return (
      <div>
        <FormGroup>
          <Col componentClass={ControlLabel} sm={3} lg={2}>Title<span className="danger-red"> *</span></Col>
          <Col sm={8} lg={9}>
            <Field onChange={this.onChangeName} value={item.get('name', '')} />
          </Col>
        </FormGroup>

        <FormGroup>
          <Col componentClass={ControlLabel} sm={3} lg={2}>Trigger after<span className="danger-red"> *</span></Col>
          <Col sm={4}>
            <InputGroup>
              <Field onChange={this.onChangeDays} value={item.get('do_after_days', '')} fieldType="number" min="1" style={{ minWidth: 50 }} />
              <InputGroup.Addon>Days</InputGroup.Addon>
            </InputGroup>
            <HelpBlock className="mb0">Days since entering debt collection process</HelpBlock>
          </Col>
        </FormGroup>

        <FormGroup>
          <Col componentClass={ControlLabel} sm={3} lg={2}>Status</Col>
          <Col sm={4}>
            <span>
              <span style={{ display: 'inline-block', marginRight: 20 }}>
                <Field fieldType="radio" onChange={this.onChangeActive} name="step-active-status" value="yes" label="Active" checked={item.get('active', true)} />
              </span>
              <span style={{ display: 'inline-block' }}>
                <Field fieldType="radio" onChange={this.onChangeActive} name="step-active-status" value="no" label="Not Active" checked={!item.get('active', true)} />
              </span>
            </span>
          </Col>
        </FormGroup>
      </div>
    );
  }
}

export default CollectionDetails;
