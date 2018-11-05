import React, { Component } from 'react';
import Immutable from 'immutable';
import { Form, Button, Table } from 'react-bootstrap';
import Field from '../Field';
import { Actions } from '../Elements';

export default class Plays extends Component {

  static propTypes = {
    data: React.PropTypes.instanceOf(Immutable.List),
    onChange: React.PropTypes.func.isRequired,
  };

  static defaultProps = {
    data: Immutable.List(),
  };

  onChangePlayName = index => (e) => {
    const { value } = e.target;
    this.props.onChange('plays', [index, 'name'], value.toUpperCase().replace(globalSetting.keyUppercaseCleanRegex, ''));
  }

  onChangePlayLabel = index => (e) => {
    const { value } = e.target;
    this.props.onChange('plays', [index, 'label'], value);
  }

  onChangePlayDefault = index => () => {
    const { data } = this.props;
    data.forEach((play, i) => {
      if (play.get('default', true)) {
        this.props.onChange('plays', [i, 'default'], false);
      }
    });
    this.props.onChange('plays', [index, 'default'], true);
  }

  onAddPlay = () => {
    const { data } = this.props;
    const newPlay = Immutable.Map({
      name: '',
      label: '',
      enabled: true,
      default: false,
      can_edit_name: true,
    });
    this.props.onChange('plays', data.size, newPlay);
  }

  onClickEnable = index => () => {
    this.props.onChange('plays', [index, 'enabled'], true);
  }

  onClickDisable = index => () => {
    this.props.onChange('plays', [index, 'enabled'], false);
  }

  parseShowEnable = play => !play.get('enabled', true);
  parseShowDisable = play => !this.parseShowEnable(play);

  getListActions = index => [
    { type: 'enable', showIcon: true, helpText: 'Enable', onClick: this.onClickEnable(index), show: this.parseShowEnable },
    { type: 'disable', showIcon: true, helpText: 'Disable', onClick: this.onClickDisable(index), show: this.parseShowDisable },
  ];

  getDefaultIndex = () => {
    const { data } = this.props;
    let ret = 0;
    data.forEach((play, i) => {
      if (play.get('default', true)) {
        ret = i;
      }
    });
    return ret;
  }

  renderPlay = (play, index) => (<tr key={index}>
    <td>
      { play.get('can_edit_name', false)
        ? (<Field
          onChange={this.onChangePlayName(index)}
          value={play.get('name', '')}
        />)
        : play.get('name', '')
    }
    </td>
    <td>
      <Field
        onChange={this.onChangePlayLabel(index)}
        value={play.get('label', '')}
      />
    </td>
    <td>
      <Actions
        actions={this.getListActions(index)}
        data={play}
      />
    </td>
    <td>
      <Field
        fieldType="radio"
        name="default-play"
        onChange={this.onChangePlayDefault(index)}
        checked={this.getDefaultIndex() === index}
      />
    </td>
  </tr>);

  render() {
    const { data } = this.props;

    return (
      <div className="Plays">
        <Form horizontal>
          <Table className="table table-hover table-bordered">
            <thead>
              <tr>
                <th>Name</th>
                <th>Label</th>
                <th>Enabled</th>
                <th>Default</th>
              </tr>
            </thead>
            <tbody>
              { data.map(this.renderPlay) }
            </tbody>
          </Table>

          <Button bsSize="xsmall" className="btn-primary" onClick={this.onAddPlay}>
            <i className="fa fa-plus" />&nbsp;Add New Play
          </Button>
        </Form>
      </div>
    );
  }
}
