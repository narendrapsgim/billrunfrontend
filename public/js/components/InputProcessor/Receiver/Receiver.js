import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import changeCase from 'change-case';
import { Form, Tabs, Tab, Button } from 'react-bootstrap';
import Connection from './Connection';
import { ConfirmModal } from '../../../components/Elements';
import { addRateCategory, removeRateCategory } from '../../../actions/inputProcessorActions';

class Receiver extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    settings: PropTypes.instanceOf(Immutable.Map),
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

  renderReceivers = () => {
    const { settings, fileType, keyValue, keyLabel } = this.props;
    const receivers = settings.get('receiver', Immutable.Map());
    console.log('receivers', receivers);
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
                    usaget={String(key)}
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
      </Form>
    );
  }
}

export default connect()(Receiver);
