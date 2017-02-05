import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import { Form, FormGroup, ControlLabel, HelpBlock, Col } from 'react-bootstrap';
import { PlanDescription } from '../../FieldDescriptions';
import Help from '../Help';
import Field from '../Field';


export default class PrepaidPlanDetails extends Component {


  static propTypes = {
    item: PropTypes.instanceOf(Immutable.Map).isRequired,
    mode: PropTypes.string.isRequired,
    onChangePlanField: PropTypes.func.isRequired,
    errorMessages: PropTypes.object,
  }

  static defaultProps = {
    errorMessages: {
      name: {
        allowedCharacters: 'Key contains illegal characters, key should contain only alphabets, numbers and underscore(A-Z, 0-9, _)',
      },
    },
  };

  state = {
    errors: {
      name: '',
    },
  }

  shouldComponentUpdate(nextProps, nextState) { // eslint-disable-line no-unused-vars
    return !Immutable.is(this.props.item, nextProps.item) || this.props.mode !== nextProps.mode;
  }

  onChangeName = (e) => {
    const { errorMessages: { name: { allowedCharacters } } } = this.props;
    const { errors } = this.state;
    const value = e.target.value.toUpperCase();
    const newError = (!globalSetting.keyUppercaseRegex.test(value)) ? allowedCharacters : '';
    this.setState({ errors: Object.assign({}, errors, { name: newError }) });
    this.props.onChangePlanField(['name'], value);
  }

  onChangeDescription = (e) => {
    const { value } = e.target;
    this.props.onChangePlanField(['description'], value);
  }

  onChangeCode = (e) => {
    const { value } = e.target;
    this.props.onChangePlanField(['code'], value);
  }

  render() {
    const { errors } = this.state;
    const { item, mode } = this.props;

    return (
      <div className="PrepaidPlanDetails">
        <Form horizontal>

          <FormGroup>
            <Col componentClass={ControlLabel} sm={3} lg={2}>
              Title
              <Help contents={PlanDescription.description} />
            </Col>
            <Col sm={8} lg={9}>
              <Field value={item.get('description', '')} onChange={this.onChangeDescription} />
            </Col>
          </FormGroup>

          {mode === 'new' &&
            <FormGroup validationState={errors.name.length > 0 ? 'error' : null} >
              <Col componentClass={ControlLabel} sm={3} lg={2}>
                Key
                <Help contents={PlanDescription.name} />
              </Col>
              <Col sm={8} lg={9}>
                <Field value={item.get('name', '')} onChange={this.onChangeName} />
                { errors.name.length > 0 && <HelpBlock>{errors.name}</HelpBlock> }
              </Col>
            </FormGroup>
          }

          <FormGroup>
            <Col componentClass={ControlLabel} sm={3} lg={2}>
              External Code
              <Help contents={PlanDescription.code} />
            </Col>
            <Col sm={8} lg={9}>
              <Field onChange={this.onChangeCode} value={item.get('code', '')} />
            </Col>
          </FormGroup>

        </Form>
      </div>
    );
  }
}
