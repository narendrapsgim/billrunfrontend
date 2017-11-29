import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Col, Button } from 'react-bootstrap';
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
    currentFile: null,
  };

  componentDidMount() {
    const { action } = this.props;
    this.initDefaultValues();
  }

  initDefaultValues = () => {
    const { settings } = this.props;
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

    this.setState({
      receiverType: settings.get('receiver_type', 'ftp'),
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

  onUploadKey = (e) => {
    e.preventDefault();
    const { currentFile } = this.state;
    const { fileType } = this.props;
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
    xhr.open('POST', uploadFileApiUrl, true);
    xhr.withCredentials = true;
    xhr.addEventListener('load', () => {
      const res = JSON.parse(xhr.responseText);
      this.afterUpload(res);
    });

    xhr.send(formData);
  }

  afterUpload = (res) => {
    if (res.desc === 'success') {
      this.props.dispatch(showSuccess(res.details.message));
      this.props.onSetReceiverField({ target: { value: res.details.path, id: 'key' } });
    } else {
      this.props.dispatch(showDanger(res.details.message));
    }
  }

  onChangeFileSelect = (e) => {
    const { files } = e.target;
    this.setState({ currentFile: files[0] });
  }

  onClickFileSelect = (e) => {
    e.target.value = null;
  };

  onCancelKeyAuth = () => {
    this.props.onCancelKeyAuth();
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

  render() {
    const { settings,
            onSetReceiverField,
            onSetReceiverCheckboxField } = this.props;
    const { receiverType } = this.state;

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
              <input className="form-control" id="password" onChange={onSetReceiverField} value={settings.get('password', '')} />
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
            <div className="col-xs-3">
              <input name="file" type="file" id="file" onClick={this.onClickFileSelect} onChange={this.onChangeFileSelect} />
              <input type="submit" name="submitBtn" id="key" value="Upload" onClick={this.onUploadKey} />
            </div>
            <div>
              <Button bsSize="xsmall" className="btn-danger" style={{ marginRight: 200 }} onClick={this.onCancelKeyAuth}>Cancel Key Auth</Button>
            </div>
          </div>}
          <div className="form-group">
            <label htmlFor="delete_received" className="col-xs-2 control-label">Delete on retrieve</label>
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
