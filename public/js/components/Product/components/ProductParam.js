import React, { Component } from 'react';
import { Button, Row, Col, FormGroup } from 'react-bootstrap';
import Immutable from 'immutable';
import ProductParamEdit from './ProductParamEdit';

export default class ProductParam extends Component {
  static defaultProps = {
    removeLabel: 'Remove',
    editLabel: 'Edit',
    existingKeys: Immutable.List(),
  };

  static propTypes = {
    paramKey: React.PropTypes.string.isRequired,
    paramValues: React.PropTypes.array.isRequired,
    existingKeys: React.PropTypes.instanceOf(Immutable.List),
    onProductParamSave: React.PropTypes.func.isRequired,
    onRemoveParam: React.PropTypes.func.isRequired,
    removeLabel: React.PropTypes.string,
    editLabel: React.PropTypes.string,
  };

  state = {
    edit: false,
  }

  onRemoveParam = () => {
    const { paramKey } = this.props;
    this.props.onRemoveParam(paramKey);
  };

  onEditParam = () => {
    this.setState({ edit: true });
  };

  onParamSave = (key, values) => {
    const { paramKey } = this.props;
    this.props.onProductParamSave(key, paramKey, values, false);
  }

  onParamEditClose = () => {
    this.setState({ edit: false });
  }

  render() {
    const { paramKey, paramValues, existingKeys, removeLabel, editLabel } = this.props;
    const { edit } = this.state;
    return (
      <Row>
        <Col lg={3} md={3}>
          {paramKey}
        </Col>
        <Col lg={6} md={6}>
          {paramValues.join(', ')}
        </Col>
        <Col lg={1} md={1} sm={1} xs={1}>
          <FormGroup style={{ margin: 0 }}>
            <div style={{ width: '100%', height: 39 }}>
              <Button onClick={this.onEditParam} bsSize="small" className="pull-left" ><i className="fa fa-pencil-square-o" />&nbsp;{editLabel}</Button>
            </div>
          </FormGroup>
        </Col>
        <Col lg={1} md={1} sm={1} xs={1}>
          <FormGroup style={{ margin: 0 }}>
            <div style={{ width: '100%', height: 39 }}>
              <Button onClick={this.onRemoveParam} bsSize="small" className="pull-left" ><i className="fa fa-trash-o danger-red" />&nbsp;{removeLabel}</Button>
            </div>
          </FormGroup>
        </Col>

        {edit ?
          <ProductParamEdit
            newParam={false}
            onParamSave={this.onParamSave}
            onParamEditClose={this.onParamEditClose}
            paramKey={paramKey}
            paramValues={paramValues}
            existingKeys={existingKeys}
          />
        : null}
      </Row>
    );
  }
}
