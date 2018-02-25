import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Col, Button, Panel } from 'react-bootstrap';
import Immutable from 'immutable';
import { buildRequestUrl } from '../../common/Api'
import Field from '../Field';
import { showSuccess, showDanger } from '../../actions/alertsActions';

class Receiver extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
  };

  state = {
    receiverType: 'ftp',
    showRemoveKey: false,
  };

  componentDidMount() {
    const { action } = this.props;
    this.initDefaultValues();
  }

  initDefaultValues = () => {
    const { settings } = this.props;
    let show = false;
    if (settings.get('passive', null) === null) {
      const passive = {
        target: {
          id: 'passive',
          checked: false,
        },
      };
      this.props.onSetReceiverCheckboxField(passive);
    }
    if (settings.get('delete_received', null) === null) {
      const deletReceived = {
        target: {
          id: 'delete_received',
          checked: false,
        },
      };
      this.props.onSetReceiverCheckboxField(deletReceived);
    }
    if (settings.get('key', false)) {
      show = true;
    }
    this.setState({
      receiverType: settings.get('receiver_type', 'ftp'),
      showRemoveKey: show,
    });
  }

  receiverTypes = Immutable.Map({
    ftp: 'FTP',
    ssh: 'SFTP',
  });

  onChangeReceiverType = (e) => {
    const { value } = e.target;
    this.setState({
      receiverType: value,
    });
    this.props.onSetReceiverField({ target: { value, id: 'receiver_type' } });
  }

  afterUpload = (res, fileName) => {
    if (res.desc === 'success') {
      this.props.dispatch(showSuccess(res.details.message));
      this.props.onSetReceiverField({ target: { value: res.details.path, id: 'key' } });
      this.props.onSetReceiverField({ target: { value: fileName, id: 'key_label' } });
      this.props.OnChangeUploadingFile();
      this.setState({ showRemoveKey: true });
    } else {
      this.props.dispatch(showDanger(res.details.message));
    }
  }

  onChangeFileSelect = (e) => {
    const { files } = e.target;
    const { fileType } = this.props;
    const currentFile = files[0];
    if (currentFile.size >= 1048576) {
      this.props.dispatch(showDanger('Please choose file smaller than 1MB'));
      return;
    }
    const formData = new FormData();
    formData.append('file', currentFile, currentFile.name);
    formData.append('category', 'key');
    formData.append('file_type', fileType);
    const xhr = new XMLHttpRequest();
    const query = { api: 'uploadedfile' };
    const uploadFileApiUrl = buildRequestUrl(query);
    this.props.OnChangeUploadingFile();
    xhr.open('POST', uploadFileApiUrl, true);
    xhr.withCredentials = true;
    xhr.addEventListener('load', () => {
      const res = JSON.parse(xhr.responseText);
      this.afterUpload(res, currentFile.name);
    });
    xhr.send(formData);
  }

  onClickFileSelect = (e) => {
    e.target.value = null;
  };

  onCancelKeyAuth = () => {
    this.props.onCancelKeyAuth();
    this.props.dispatch(showSuccess('Key was removed successfuly'));
    this.setState({ showRemoveKey: false });
  }

  renderReceiverType = (name, type) => {
    const { receiverType } = this.state;
    return (
      <Col sm={3} key={type}>
        <Field
          fieldType="radio"
          onChange={this.onChangeReceiverType}
          name="receiver_type"
          value={type}
          label={name}
          checked={receiverType === type}
        />
      </Col>
    );
  }

  renderReceiverTypes = () => (
    this.receiverTypes.map((name, type) => this.renderReceiverType(name, type)).toArray()
  );

  renderPanelHeader = (keyLabel) => (
    <div style={{ fontSize: 12, fontWeight: 'bold' }}>
      {keyLabel}
      <div className="pull-right">
        <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={this.onCancelKeyAuth}><span aria-hidden="true">&times;</span></button>
      </div>
    </div>
  );
  render() {
    const { settings,
            onSetReceiverField,
            onSetReceiverCheckboxField,
            keyValue,
            keyLabel} = this.props;
    const { receiverType, showRemoveKey } = this.state;

    const period_options = [{min: 1, label: "1 Minute"},
                            {min: 15, label: "15 Minutes"},
                            {min: 30, label: "30 Minutes"},
                            {min: 60, label: "1 Hour"},
                            {min: 360, label: "6 Hours"},
                            {min: 720, label: "12 Hours"},
                            {min: 1440, label: "24 Hours"}].map((opt, key) => (
                              <option value={opt.min} key={key}>{opt.label}</option>
                            ));

    return (
      <div className="ReceiverSettings">
        <form className="form-horizontal">
          <div className="form-group">
            <label htmlFor="name" className="col-xs-2 control-label">Receiver Type</label>
            <div className="col-xs-9">
              {this.renderReceiverTypes()}
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="name" className="col-xs-2 control-label">Name</label>
            <div className="col-xs-4">
              <input className="form-control" id="name" onChange={onSetReceiverField} value={settings.get('name', '')} />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="host" className="col-xs-2 control-label">Host</label>
            <div className="col-xs-4">
              <input className="form-control" id="host" onChange={onSetReceiverField} value={settings.get('host', '')} />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="user" className="col-xs-2 control-label">User</label>
            <div className="col-xs-4">
              <input className="form-control" id="user" onChange={onSetReceiverField} value={settings.get('user', '')} />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="password" className="col-xs-2 control-label">Password</label>
            <div className="col-xs-4">
              <input type="password" className="form-control" id="password" onChange={onSetReceiverField} value={settings.get('password', '')} />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="remote_directory" className="col-xs-2 control-label">Directory</label>
            <div className="col-xs-4">
              <input className="form-control" id="remote_directory" onChange={onSetReceiverField} value={settings.get('remote_directory', '')} />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="filename_regex" className="col-xs-2 control-label">Regex</label>
            <div className="col-xs-4">
              <input className="form-control" id="filename_regex" onChange={onSetReceiverField} value={settings.get('filename_regex', '')} />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="period" className="col-xs-2 control-label">Period</label>
            <div className="col-xs-4">
              <select className="form-control" id="period" onChange={onSetReceiverField} value={settings.get('period', '')}>
                { period_options }
              </select>
            </div>
          </div>
          {receiverType !== 'ftp' &&
          <div className="form-group">
            <label htmlFor="uploadFile" className="col-xs-2 control-label">Key</label>
            <div className="col-xs-2">
              <input name="file" type="file" id="file" onClick={this.onClickFileSelect} onChange={this.onChangeFileSelect} />
            </div>
            <div className="col-xs-2">
              <form>
                <div>
                  {showRemoveKey && (<Panel header={this.renderPanelHeader(keyLabel)} />)}
                </div>
              </form>
            </div>
          </div>}
          <div className="form-group">
            <label htmlFor="delete_received" className="col-xs-2 control-label">Delete received files from remote</label>
            <div className="col-xs-4">
              <input type="checkbox" id="delete_received" style={{ marginTop: 12 }}
                     onChange={onSetReceiverCheckboxField}
                     checked={settings.get('delete_received', false)}
                     value="1" />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="passive" className="col-xs-2 control-label">Passive mode</label>
            <div className="col-xs-4">
              <input
                type="checkbox"
                id="passive"
                style={{ marginTop: 12 }}
                onChange={onSetReceiverCheckboxField}
                checked={settings.get('passive', false)}
                value="1"
                disabled={receiverType !== 'ftp'}
              />
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default connect()(Receiver);
