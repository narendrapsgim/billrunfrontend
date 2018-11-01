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
    this.props.onChange('plays', [index, 'name'], value);
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
      enabled: true,
      default: false,
    });
    this.props.onChange('plays', data.size, newPlay);
  }

  renderPlay = (play, index) => (<tr key={index}>
    <td>
      <Field
        onChange={this.onChangePlayName(index)}
        value={play.get('name', '')}
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
