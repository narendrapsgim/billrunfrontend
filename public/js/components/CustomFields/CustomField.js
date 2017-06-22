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

  onOpenModal = () => {
    this.setState({ showAdvancedEdit: true });
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

  render() {
    const { field, editable, existing } = this.props;
    return (
      <FormGroup className="CustomField form-inner-edit-row">
        <Col sm={1} className="text-center">
          <DragHandle />
        </Col>
        <Col sm={3}>
          <Field id="field_name" onChange={this.onChange} value={field.get('field_name', '')} disabled={!editable || existing} />
        </Col>
        <Col sm={2}>
          <Field id="title" onChange={this.onChange} value={field.get('title', '')} disabled={!editable} />
        </Col>
        <Col sm={2}>
          <Field id="default_value" onChange={this.onChange} value={field.get('default_value', '')} disabled={!editable} />
        </Col>
        {editable && (
          <Col sm={4} className="actions">
            <Button onClick={this.onOpenModal} bsSize="small"><i className="fa fa-pencil active-blue" /> Advanced </Button>
            <Button onClick={this.onRemove} bsSize="small"><i className="fa fa-trash-o danger-red" /> Remove </Button>
          </Col>
        )}
        { this.renderAdvancedEdit() }
      </FormGroup>
    );
  }

}

export default connect()(SortableElement(CustomField));
