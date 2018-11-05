import React, { Component } from 'react';
import Immutable from 'immutable';
import { Form, Button, Table } from 'react-bootstrap';
import Field from '../Field';

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

  onChangePlayEnabled = index => (e) => {
    const { value } = e.target;
    this.props.onChange('plays', [index, 'enabled'], value);
  }

  onChangePlayDefault = index => (e) => {
    const { data } = this.props;
    const { value } = e.target;
    data.forEach((play, i) => {
      if (play.get('default', true)) {
        this.props.onChange('plays', [i, 'default'], false);
      }
    });
    this.props.onChange('plays', [index, 'default'], value);
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
      <Field
        fieldType="checkbox"
        onChange={this.onChangePlayEnabled(index)}
        value={play.get('enabled', true)}
      />
    </td>
    <td>
      <Field
        fieldType="checkbox"
        onChange={this.onChangePlayDefault(index)}
        value={play.get('default', true)}
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
