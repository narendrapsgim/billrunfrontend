import React, { Component } from 'react';
import { Button, Row, Col, FormGroup, HelpBlock, Modal, Form } from 'react-bootstrap';
import Immutable from 'immutable';
import Select from 'react-select';
import Field from '../../Field';

export default class ProductParamEdit extends Component {
  static defaultProps = {
    cancelLabel: 'Cancel',
    okLabel: 'OK',
    addLabel: 'Add',
    existingKeys: Immutable.List(),
    show: true,
  };

  static propTypes = {
    newParam: React.PropTypes.bool.isRequired,
    paramKey: React.PropTypes.string.isRequired,
    paramValues: React.PropTypes.array.isRequired,
    existingKeys: React.PropTypes.instanceOf(Immutable.List),
    onParamSave: React.PropTypes.func.isRequired,
    onParamEditClose: React.PropTypes.func.isRequired,
    cancelLabel: React.PropTypes.string,
    okLabel: React.PropTypes.string,
    addLabel: React.PropTypes.string,
    show: React.PropTypes.bool,
  };

  state = {
    paramKeyError: '',
    editedData: {
      key: this.props.paramKey,
      values: this.props.paramValues,
    },
  }

  validateParam = (value) => {
    const { paramKey, existingKeys } = this.props;
    let paramKeyError = '';
    let ret = true;
    if (value === '') {
      paramKeyError = 'Required';
      ret = false;
    } else if (value !== paramKey && existingKeys.contains(value)) {
      paramKeyError = 'Key exists';
      ret = false;
    }
    this.setState({ paramKeyError });
    return ret;
  }

  onChangeParamValues = (values) => {
    const valuesList = (values.length) ? values.split(',') : [];
    const { key } = this.state.editedData;
    this.setState({
      editedData: {
        key,
        values: valuesList,
      },
    });
  };

  onChangeParamKey = (e) => {
    const { value } = e.target;
    const { values } = this.state.editedData;
    this.setState({
      editedData: {
        key: value,
        values,
      },
    });
  };

  onEditParamSave = () => {
    const { paramKey, newParam } = this.props;
    const { key, values } = this.state.editedData;

    if (!this.validateParam(key)) {
      return;
    }
    this.props.onParamSave(key, paramKey, values, newParam);
    this.props.onParamEditClose();
  };

  render() {
    const { cancelLabel, okLabel, addLabel, show } = this.props;
    const { paramKeyError, editedData } = this.state;
    return (
      <Modal show={show}>
        <Modal.Header closeButton={false}>
          <Modal.Title>Edit Product Parameter</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form horizontal>
            <Row>
              <Col lg={3} md={3}>
                Key
              </Col>
              <Col lg={6} md={6}>
                <FormGroup validationState={paramKeyError.length > 0 ? 'error' : null} style={{ margin: 0 }}>
                  <Field onChange={this.onChangeParamKey} value={editedData.key} />
                  { paramKeyError.length > 0 ? <HelpBlock>{paramKeyError}</HelpBlock> : ''}
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col lg={3} md={3}>
                Values
              </Col>
              <Col lg={6} md={6}>
                <FormGroup style={{ margin: 0 }}>
                  <Select
                    allowCreate
                    disabled={editedData.key === ''}
                    multi={true}
                    value={editedData.values.join(',')}
                    onChange={this.onChangeParamValues}
                    placeholder={`${addLabel} ${editedData.key}`}
                  />
                </FormGroup>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button bsSize="small" style={{ minWidth: 90 }} onClick={this.props.onParamEditClose}>{cancelLabel}</Button>
          <Button bsSize="small" style={{ minWidth: 90 }} onClick={this.onEditParamSave} bsStyle="primary" >{okLabel}</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
