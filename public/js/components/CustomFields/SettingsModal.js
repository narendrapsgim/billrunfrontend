import React from 'react';
import { connect } from 'react-redux';

import { Row, Col, FormGroup, ControlLabel, Button, Modal } from 'react-bootstrap';
import Field from '../Field';

class SettingsModal extends React.Component {
  render() {
    const { onChange, onClose, show, field } = this.props;

    return (
      <Modal show={ show } onHide={ onClose }>
        <Modal.Header>
          <Modal.Title>Advanced settings</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col lg={2} md={2}>
              <ControlLabel>Unique</ControlLabel>
              <FormGroup>
                <Field
                    id="unique"
                    onChange={ onChange }
                    value={ field.get('unique', false) }
                    fieldType="checkbox"
                />
              </FormGroup>
            </Col>
            <Col lg={2} md={2}>
              <FormGroup>
                <ControlLabel>Mandatory</ControlLabel>
                <Field
                    id="mandatory"
                    onChange={ onChange }
                    value={ field.get('mandatory', false) }
                    fieldType="checkbox"
                />
              </FormGroup>
            </Col>
            <Col lg={2} md={2}>
              <FormGroup>
                <ControlLabel>Editable</ControlLabel>
                <Field
                    id="editable"
                    onChange={ onChange }
                    value={ field.get('editable', false) }
                    fieldType="checkbox"
                />
              </FormGroup>
            </Col>        
            <Col lg={2} md={2}>
              <ControlLabel>Display</ControlLabel>
              <FormGroup>
                <Field
                    id="display"
                    onChange={ onChange }
                    value={ field.get('display', false) }
                    fieldType="checkbox"
                />
              </FormGroup>
            </Col>
            <Col lg={2} md={2}>
              <ControlLabel>Show in list</ControlLabel>
              <FormGroup>
                <Field
                    id="show_in_list"
                    onChange={ onChange }
                    value={ field.get('show_in_list', false) }
                    fieldType="checkbox"
                />
              </FormGroup>
            </Col>
            <Col lg={2} md={2}>
              <ControlLabel>Select list</ControlLabel>
              <FormGroup>
                <Field
                    id="select_list"
                    onChange={ onChange }
                    value={ field.get('select_list', false) }
                    fieldType="checkbox"
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col>
              <ControlLabel>Select Options <small>(comma-separated list)</small></ControlLabel>
              <FormGroup>
                <Field
                    id="select_options"
                    onChange={ onChange }
                    disabled={ !field.get('select_list', false) }
                    value={ field.get('select_options', '') }
                />
              </FormGroup>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={ onClose }>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default connect()(SettingsModal);
