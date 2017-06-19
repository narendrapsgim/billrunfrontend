import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import changeCase from 'change-case';
import { Form, InputGroup, Row, Col, FormGroup, ControlLabel, Button, HelpBlock } from 'react-bootstrap';
import { SortableElement } from 'react-sortable-hoc';
import ModalWrapper from '../Elements/ModalWrapper';
import DragHandle from '../Elements/DragHandle';
import Field from '../Field';


class CustomField extends Component {

  static propTypes = {
    field: PropTypes.instanceOf(Immutable.Map),
    entity: PropTypes.string.isRequired,
    idx: PropTypes.number.isRequired,
    editable: PropTypes.bool,
    existing: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
  };

  static defaultProps = {
    field: Immutable.Map(),
    editable: true,
    existing: false,
  };

  state = {
    showAdvancedEdit: false,
  }

  onChange = (e) => {
    const { entity, idx } = this.props;
    const { id, value } = e.target;
    this.props.onChange(entity, idx, id, value);
  };

  onRemove = () => {
    const { entity, idx } = this.props;
    this.props.onRemove(entity, idx);
  };

  onCloseModal = () => {
    this.setState({ showAdvancedEdit: false });
  };

  renderAdvancedEdit = () => {
    const { field } = this.props;
    const { showAdvancedEdit } = this.state;
    const modalTitle = changeCase.titleCase(`Edit ${field.get('field_name', 'filed')} Details`);
    const checkboxStyle = { marginTop: 10, paddingLeft: 26 };
    return (
      <ModalWrapper show={showAdvancedEdit} onOk={this.onCloseModal} title={modalTitle}>
        <Form horizontal>
          <FormGroup>
            <Col sm={3} componentClass={ControlLabel}>Unique</Col>
            <Col sm={9} style={checkboxStyle}>
              <Field id="unique" onChange={this.onChange} value={field.get('unique', false)} fieldType="checkbox" />
            </Col>
          </FormGroup>

          <FormGroup>
            <Col sm={3} componentClass={ControlLabel}>Mandatory</Col>
            <Col sm={9} style={checkboxStyle}>
              <Field id="mandatory" onChange={this.onChange} value={field.get('mandatory', false)} fieldType="checkbox" />
            </Col>
          </FormGroup>

          <FormGroup>
            <Col sm={3} componentClass={ControlLabel}>Editable</Col>
            <Col sm={9} style={checkboxStyle}>
              <Field id="editable" onChange={this.onChange} value={field.get('editable', false)} fieldType="checkbox" />
            </Col>
          </FormGroup>

          <FormGroup>
            <Col sm={3} componentClass={ControlLabel}>Display</Col>
            <Col sm={9} style={checkboxStyle}>
              <Field id="display" onChange={this.onChange} value={field.get('display', false)} fieldType="checkbox" />
            </Col>
          </FormGroup>

          <FormGroup>
            <Col sm={3} componentClass={ControlLabel}>Show in list</Col>
            <Col sm={9} style={checkboxStyle}>
              <Field id="show_in_list" onChange={this.onChange} value={field.get('show_in_list', false)} fieldType="checkbox" />
            </Col>
          </FormGroup>

          <FormGroup>
            <Col sm={3} componentClass={ControlLabel}>Searchable</Col>
            <Col sm={9} style={checkboxStyle}>
              <Field id="searchable" onChange={this.onChange} value={field.get('searchable', false)} fieldType="checkbox" />
            </Col>
          </FormGroup>

          <FormGroup>
            <Col sm={3} componentClass={ControlLabel}>Multiple</Col>
            <Col sm={9} style={checkboxStyle}>
              <Field id="multiple" onChange={this.onChange} value={field.get('multiple', false)} fieldType="checkbox" />
            </Col>
          </FormGroup>

          <FormGroup>
            <Col sm={3} componentClass={ControlLabel}>Select list</Col>
            <Col sm={9}>
              <InputGroup>
                <InputGroup.Addon>
                  <Field id="select_list" onChange={this.onChange} value={field.get('select_list', false)} fieldType="checkbox" />
                </InputGroup.Addon>
                <Field id="select_options" onChange={this.onChange} value={field.get('select_options', '')} disabled={!field.get('select_list', false)} />
              </InputGroup>
              { field.get('select_list', false) && <HelpBlock style={{ marginLeft: 40 }}>Select Options <small>(comma-separated list)</small></HelpBlock>}
            </Col>
          </FormGroup>

        </Form>
      </ModalWrapper>
    );
  }

  renderField = () => {
    const { field, editable, existing } = this.props;
    return (
      <Row>
        <Col lg={1} md={1} style={{ paddingTop: 10 }}><DragHandle /></Col>
        <Col lg={2} md={2}>
          <FormGroup>
            <ControlLabel>Field Name</ControlLabel>
            <Field id="field_name" onChange={this.onChange} value={field.get('field_name', '')} disabled={!editable || existing} />
          </FormGroup>
        </Col>
        <Col lg={2} md={2}>
          <FormGroup>
            <ControlLabel>Title</ControlLabel>
            <Field id="title" onChange={this.onChange} value={field.get('title', '')} disabled={!editable} />
          </FormGroup>
        </Col>
        <Col lg={2} md={2}>
          <FormGroup>
            <ControlLabel>Default Value</ControlLabel>
            <Field id="default_value" onChange={this.onChange} value={field.get('default_value', '')} disabled={!editable} />
          </FormGroup>
        </Col>
        <Col lg={3} md={3}>
          <FormGroup>
            <ControlLabel>&nbsp;</ControlLabel>
            <div className="text-center">
              {editable && <button className="btn btn-link" onClick={() => this.setState({ showAdvancedEdit: true })}> Advanced </button> }
            </div>
          </FormGroup>
        </Col>
        <Col lg={2} md={2}>
          <FormGroup>
            <ControlLabel>&nbsp;</ControlLabel>
            <div>
              {editable && <Button onClick={this.onRemove} bsSize="small"><i className="fa fa-trash-o danger-red" /> Remove </Button> }
            </div>
          </FormGroup>
        </Col>
      </Row>
    );
  }

  render() {
    return (
      <div className="CustomField" style={{ borderTop: '1px solid #eee', borderBottom: '1px solid #eee', paddingTop: 10 }}>
        { this.renderField() }
        { this.renderAdvancedEdit() }
      </div>
    );
  }
}

export default connect()(SortableElement(CustomField));
