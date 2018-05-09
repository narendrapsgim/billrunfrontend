import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { Form, Tabs, Button } from 'react-bootstrap';
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

  getAddReceiverButton = () => (
    <Button
      bsSize="xsmall"
      className="btn-primary"
      onClick={this.onAddReceiver()}
    >
      <i className="fa fa-plus" />&nbsp;Add Receiver
    </Button>
  );

  onAddReceiver = () => () => {
    this.props.dispatch(addReceiver());
  }

  renderReceivers = () => {
    const { settings, fileType, keyValue, keyLabel } = this.props;
    const receivers = settings.get('receiver', Immutable.Map());
    return (
      <div>
        {receivers.map((receiver, key) => (
          <div key={key} style={{ minWidth: 150 }}>
            <div className="form-group" style={{ marginTop: 20 }}>
              <div className="col-lg-10">
                <div className="col-lg-11">
                  <Connection
                    receiver={receiver}
                    index={key}
                    settings={settings}
                    onSetReceiverField={this.onSetReceiverField}
                    onSetReceiverCheckboxField={this.onSetReceiverCheckboxField}
                    onCancelKeyAuth={this.props.onCancelKeyAuth}
                    fileType={fileType}
                    OnChangeUploadingFile={this.props.OnChangeUploadingFile}
                    keyValue={keyValue}
                    keyLabel={keyLabel}
                  />
                </div>
              </div>
            </div>
            { key < receivers.size - 1 ? <div className="separator" /> : null }
          </div>
        )).toArray()}
      </div>
    );
  }

  render() {
    return (
      <Form horizontal className="Receiver">
        <Tabs id="receiver">
          { this.renderReceivers() }
        </Tabs>
        { this.getAddReceiverButton() }
      </Form>
    );
  }
}

export default connect()(Receiver);
