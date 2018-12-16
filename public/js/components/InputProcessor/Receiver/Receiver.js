import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { Form } from 'react-bootstrap';
import { CreateButton } from '../../Elements';
import Connection from './Connection';
import { addReceiver } from '../../../actions/inputProcessorActions';

class Receiver extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    settings: PropTypes.instanceOf(Immutable.Map),
    onSetReceiverField: PropTypes.func.isRequired,
    onSetReceiverCheckboxField: PropTypes.func.isRequired,
    onCancelKeyAuth: PropTypes.func.isRequired,
    OnChangeUploadingFile: PropTypes.func.isRequired,
  }

  static defaultProps = {
    settings: Immutable.Map(),
  };

  onSetReceiverField = (e, index) => {
    const { id, value } = e.target;
    const fieldName = id.split('-')[0];
    this.props.onSetReceiverField(fieldName, value, index);
  }

  onSetReceiverCheckboxField = (e, index) => {
    const { id, checked } = e.target;
    const fieldName = id.split('-')[0];
    this.props.onSetReceiverCheckboxField(fieldName, checked, index);
  }

  onAddReceiver = () => {
    this.props.dispatch(addReceiver());
  }

  renderReceivers = () => {
    const { settings, fileType } = this.props;
    const receivers = settings.get('receiver', Immutable.List());
    return receivers.map((receiver, key) => (
      <Connection
        key={`receiver_${key}`}
        receiver={receiver}
        index={key}
        settings={settings}
        onSetReceiverField={this.onSetReceiverField}
        onSetReceiverCheckboxField={this.onSetReceiverCheckboxField}
        onCancelKeyAuth={this.props.onCancelKeyAuth}
        fileType={fileType}
        OnChangeUploadingFile={this.props.OnChangeUploadingFile}
      />
    )).toArray();
  }

  render() {
    return (
      <Form horizontal className="Receiver">
        { this.renderReceivers() }
        <CreateButton
          onClick={this.onAddReceiver}
          label="Add Receiver"
        />
      </Form>
    );
  }
}

export default connect()(Receiver);
