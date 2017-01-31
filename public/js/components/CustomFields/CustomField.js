import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { Row, Col, FormGroup, ControlLabel, Button } from 'react-bootstrap';
import SettingsModal from './SettingsModal';
import Field from '../Field';

class CustomField extends Component {

  static propTypes = {
    field: PropTypes.instanceOf(Immutable.Map),
    entity: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    disabled: PropTypes.bool,
    last: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
  };

  static defaultProps = {
    last: false,
  };

  state = {
    showSettings: false,
  }

  onChange = (e) => {
    const { entity, index } = this.props;
    const { id, value } = e.target;
    this.props.onChange(entity, index, id, value);
  };

  onRemove = () => {
    const { entity, index } = this.props;
    this.props.onRemove(entity, index);
  };

  dragOver = () => {
    const { dragOver, index } = this.props;
    dragOver(index);
  };

  dragEnd = () => {
    const { dragEnd, index } = this.props;
    dragEnd(index);
  };

  onCloseModal = () => {
    this.setState({ showSettings: false });
  };

  renderField = () => {
    const { field, disabled } = this.props;
    return (
      <div>
        <Row>
          <Col lg={1} md={1}>
            <FormGroup>
              <ControlLabel>&nbsp;</ControlLabel>
              <div><i className="fa fa-arrows-v movable" /></div>
            </FormGroup>
          </Col>
          <Col lg={2} md={2}>
            <FormGroup>
              <ControlLabel>Field Name</ControlLabel>
              <Field id="field_name" onChange={this.onChange} value={field.get('field_name', '')} disabled={disabled} />
            </FormGroup>
          </Col>
          <Col lg={2} md={2}>
            <FormGroup>
              <ControlLabel>Title</ControlLabel>
              <Field id="title" onChange={this.onChange} value={field.get('title', '')} disabled={disabled} />
            </FormGroup>
          </Col>
          <Col lg={2} md={2}>
            <FormGroup>
              <ControlLabel>Default Value</ControlLabel>
              <Field id="default_value" onChange={this.onChange} value={field.get('default_value', '')} disabled={disabled} />
            </FormGroup>
          </Col>
          <Col lg={3} md={3}>
            <FormGroup>
              <ControlLabel>&nbsp;</ControlLabel>
              <div className="text-center">
                {!disabled && <button className="btn btn-link" onClick={() => this.setState({ showSettings: true })}> Advanced </button> }
              </div>
            </FormGroup>
          </Col>
          <Col lg={2} md={2}>
            <FormGroup>
              <ControlLabel>&nbsp;</ControlLabel>
              <div>
                {!disabled && <Button onClick={this.onRemove} bsSize="small"><i className="fa fa-trash-o danger-red" /> Remove </Button> }
              </div>
            </FormGroup>
          </Col>
        </Row>
      </div>
    );
  }

  renderOver = () => (
    <div>
      <Row>
        <Col lgOffset={5} lg={6}>
          <FormGroup>
            <ControlLabel>&nbsp;</ControlLabel>
            <span>Set field here</span>
          </FormGroup>
        </Col>
      </Row>
    </div>
  );

  render() {
    const { field, last, over, dragStart, dragEnd } = this.props;
    const { showSettings } = this.state;

    return (
      <div className="CustomField" draggable="true" onDragStart={dragStart} onDragOver={this.dragOver} onDragEnd={this.dragEnd}>
        <SettingsModal field={field} onClose={this.onCloseModal}onChange={this.onChange} show={showSettings} />
        {
          over
          ? this.renderOver()
          : this.renderField()
        }
        { !last && <hr style={{ marginTop: 10, marginBottom: 10 }} /> }
      </div>
    );
  }
}

export default connect()(CustomField);
