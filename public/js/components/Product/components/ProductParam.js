import React, { Component } from 'react';
import { Button, Row, Col, Field, FormGroup } from 'react-bootstrap';
import Chips from '../../Chips';

export default class ProductParam extends Component {
  static defaultProps = {
    addLabel: 'Add2',
    removeLabel: 'Remove',
  };

  static propTypes = {
    paramKey: React.PropTypes.string.isRequired,
    paramValues: React.PropTypes.array.isRequired,
    onChangeParamKey: React.PropTypes.func.isRequired,
    onChangeParamValues: React.PropTypes.func.isRequired,
    onRemoveParam: React.PropTypes.func.isRequired,
    addLabel: React.PropTypes.string,
    removeLabel: React.PropTypes.string,
  };

  onChangeParamValues = (values) => {
    const { paramKey } = this.props;
    const paramPath = ['params', paramKey];
    this.props.onChangeParamValues(paramPath, values);
  };

  onChangeParamKey = (newKey) => {
    const { paramKey, paramValues } = this.props;
    this.props.onChangeParamKey(paramKey, newKey, paramValues);
  };

  onRemoveParam = () => {
    const { paramKey } = this.props;
    this.props.onRemoveParam(paramKey);
  };

  render() {
    const { paramKey, paramValues, addLabel, removeLabel } = this.props;
    return (
      <Row>
        <Col lg={3} md={3}>
          <FormGroup>
            <Field onChange={this.nChangeParamKey} value={paramKey} />
          </FormGroup>
        </Col>
        <Col lg={6} md={6}>
          <FormGroup>
            <Chips onChange={this.onChangeParamValues} items={paramValues} placeholder={`${addLabel} ${paramKey}`} />
          </FormGroup>
        </Col>
        <Col lg={1} md={1} sm={1} xs={1}>
          <FormGroup style={{ margin: 0 }}>
            <div style={{ width: '100%', height: 39 }}>
              <Button onClick={this.onRemoveParam} bsSize="small" className="pull-left" ><i className="fa fa-trash-o danger-red" />&nbsp;{removeLabel}</Button>
            </div>
          </FormGroup>
        </Col>
      </Row>
    );
  }
}
