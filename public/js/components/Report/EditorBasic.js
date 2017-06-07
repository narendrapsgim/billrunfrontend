import React, { PropTypes, Component } from 'react';
import Immutable from 'immutable';
import { ControlLabel, FormGroup, Col } from 'react-bootstrap';
import changeCase from 'change-case';
import Select from 'react-select';
import Field from '../Field';
import {
  getConfig,
  formatSelectOptions,
} from '../../common/Util';

class EditorBasic extends Component {

  static propTypes = {
    title: PropTypes.string,
    entity: PropTypes.string,
    mode: PropTypes.string,
    onChangeKey: PropTypes.func,
    onChangeEntity: PropTypes.func,
  }

  static defaultProps = {
    title: '',
    entity: '',
    mode: 'update',
    onChangeKey: () => {},
    onChangeEntity: () => {},
  }

  shouldComponentUpdate(nextProps) {
    const { title, entity, mode } = this.props;
    return (
      title !== nextProps.title
      || entity !== nextProps.entity
      || mode !== nextProps.mode
    );
  }

  onChangeTitle = (e) => {
    const { value } = e.target;
    this.props.onChangeKey(value);
  };

  onChangeEntity = (e) => {
    this.props.onChangeEntity(e);
  };

  getEntityOptions = () => getConfig(['reports', 'entities'], Immutable.List())
    .map(option => Immutable.Map({
      value: option,
      label: changeCase.titleCase(getConfig(['systemItems', option, 'itemName'], option)),
    }))
    .map(formatSelectOptions)
    .toArray();

  render() {
    const { title, entity, mode } = this.props;
    const disabled = mode === 'view';
    const entityOptions = this.getEntityOptions();
    return (
      <div>
        <Col sm={12}>
          <FormGroup>
            <Col componentClass={ControlLabel} sm={3}>
              Name
            </Col>
            <Col sm={7}>
              <Field
                onChange={this.onChangeTitle}
                value={title}
                disabled={disabled}
              />
            </Col>
          </FormGroup>
        </Col>
        <Col sm={12}>
          <FormGroup>
            <Col componentClass={ControlLabel} sm={3}>
              Entity
            </Col>
            <Col sm={7}>
              <Select
                options={entityOptions}
                value={entity}
                onChange={this.onChangeEntity}
                disabled={disabled}
              />
            </Col>
          </FormGroup>
        </Col>
      </div>
    );
  }

}

export default EditorBasic;
