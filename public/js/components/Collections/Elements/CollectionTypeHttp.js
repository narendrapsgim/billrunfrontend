import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import { FormGroup, Col, ControlLabel, HelpBlock } from 'react-bootstrap';
import Field from '../../Field';


class CollectionTypeHttp extends Component {

  static propTypes = {
    content: PropTypes.instanceOf(Immutable.Map),
    methodOptions: PropTypes.instanceOf(Immutable.Map),
    decoderOptions: PropTypes.instanceOf(Immutable.Map),
    errors: PropTypes.instanceOf(Immutable.Map),
    onChange: PropTypes.func.isRequired,
  };

  static defaultProps = {
    content: Immutable.Map(),
    errors: Immutable.Map(),
    methodOptions: Immutable.List([
      { value: 'get', label: 'GET' },
      { value: 'post', label: 'POST' },
    ]),
    decoderOptions: Immutable.List([
      { value: 'json', label: 'JSON' },
      { value: 'xml', label: 'XML' },
    ]),
  };

  shouldComponentUpdate(nextProps, nextState) { // eslint-disable-line no-unused-vars
    const { content } = this.props;
    return !Immutable.is(content, nextProps.content);
  }

  onChangeMethod = (value) => {
    this.props.onChange(['method'], value);
  }

  onChangeDcoder = (value) => {
    this.props.onChange(['decoder'], value);
  }

  onChangeUrl = (e) => {
    const { value } = e.target;
    this.props.onChange(['url'], value);
  }

  render() {
    const { content, methodOptions, decoderOptions, errors } = this.props;
    return (
      <div>
        <FormGroup validationState={errors.has('url') ? 'error' : null}>
          <Col componentClass={ControlLabel} sm={3} lg={2}>
            URL<span className="danger-red"> *</span>
          </Col>
          <Col sm={8} lg={9}>
            <Field onChange={this.onChangeUrl} value={content.get('url', '')} />
            { errors.has('url') && <HelpBlock>{errors.get('url', '')}</HelpBlock> }
          </Col>
        </FormGroup>
        <FormGroup>
          <Col componentClass={ControlLabel} sm={3} lg={2}>
            HTTP Method<span className="danger-red"> *</span>
          </Col>
          <Col sm={4}>
            <Field
              fieldType="select"
              options={methodOptions.toArray()}
              onChange={this.onChangeMethod}
              value={content.get('method', '')}
              clearable={false}
            />
          </Col>
        </FormGroup>
        <FormGroup validationState={errors.has('decoder') ? 'error' : null}>
          <Col componentClass={ControlLabel} sm={3} lg={2}>
            Decoder<span className="danger-red"> *</span>
          </Col>
          <Col sm={4}>
            <Field
              fieldType="select"
              options={decoderOptions.toArray()}
              onChange={this.onChangeDcoder}
              value={content.get('decoder', '')}
              clearable={false}
            />
            { errors.has('decoder') && <HelpBlock>{errors.get('decoder', '')}</HelpBlock> }
          </Col>
        </FormGroup>
      </div>
    );
  }
}

export default CollectionTypeHttp;
