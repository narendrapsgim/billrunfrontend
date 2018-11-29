import React, { Component } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { Form, Button, Table } from 'react-bootstrap';
import Field from '../Field';
import { Actions, ConfirmModal } from '../Elements';
import { saveSettings } from '../../actions/settingsActions';

class Plays extends Component {

  static propTypes = {
    dispatch: React.PropTypes.func.isRequired,
    data: React.PropTypes.instanceOf(Immutable.List),
    onChange: React.PropTypes.func.isRequired,
  };

  static defaultProps = {
    data: Immutable.List(),
  };

  state = {
    indexToRemove: null,
    indexToDisable: null,
  }

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
    this.setState({ indexToDisable: index });
  }

  onClickRemove = index => () => {
    this.setState({ indexToRemove: index });
  }

  onClickRemoveOk = () => {
    const { data } = this.props;
    const { indexToRemove } = this.state;
    this.setState({ indexToRemove: null });
    this.props.onChange('plays', [], data.delete(indexToRemove));
    this.props.dispatch(saveSettings(['plays']))
      .then((response) => {
        if (!response || !response.status) {
          this.props.onChange('plays', [], data);
        }
      });
  }

  onClickRemoveCancel = () => {
    this.setState({ indexToRemove: null });
  }

  onClickDisableOk = () => {
    const { indexToDisable } = this.state;
    this.setState({ indexToDisable: null });
    this.props.onChange('plays', [indexToDisable, 'enabled'], false);
    this.props.dispatch(saveSettings(['plays']))
      .then((response) => {
        if (!response || !response.status) {
          this.props.onChange('plays', [indexToDisable, 'enabled'], true);
        }
      });
  }

  onClickDisableCancel = () => {
    this.setState({ indexToDisable: null });
  }

  parseShowEnable = play => !play.get('enabled', true);
  parseShowDisable = play => !this.parseShowEnable(play);

  getListEnabledActions = index => [
    { type: 'enable', showIcon: true, helpText: 'Enable', onClick: this.onClickEnable(index), show: this.parseShowEnable },
    { type: 'disable', showIcon: true, helpText: 'Disable', onClick: this.onClickDisable(index), show: this.parseShowDisable },
  ];

  getListRemoveActions = index => [
    { type: 'remove', showIcon: true, helpText: 'Remove', onClick: this.onClickRemove(index) },
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
        actions={this.getListEnabledActions(index)}
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
    <td>
      <Actions
        actions={this.getListRemoveActions(index)}
        data={play}
      />
    </td>
  </tr>);

  render() {
    const { data } = this.props;
    const { indexToRemove, indexToDisable } = this.state;
    const removeConfirmMessage = `Are you sure you want to remove Play "${data.getIn([indexToRemove, 'name'], '')}"?`;
    const disableConfirmMessage = `Are you sure you want to disable Play "${data.getIn([indexToDisable, 'name'], '')}"?`;

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
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              { data.map(this.renderPlay) }
            </tbody>
          </Table>

          <ConfirmModal onOk={this.onClickRemoveOk} onCancel={this.onClickRemoveCancel} show={indexToRemove !== null} message={removeConfirmMessage} labelOk="Yes" />
          <ConfirmModal onOk={this.onClickDisableOk} onCancel={this.onClickDisableCancel} show={indexToDisable !== null} message={disableConfirmMessage} labelOk="Yes" />

          <Button bsSize="xsmall" className="btn-primary" onClick={this.onAddPlay}>
            <i className="fa fa-plus" />&nbsp;Add New Play
          </Button>
        </Form>
      </div>
    );
  }
}
export default connect()(Plays);
