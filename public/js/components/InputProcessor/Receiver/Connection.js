import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { Col, Row, Panel, Button } from 'react-bootstrap';
import Field from '../../Field';
import { buildRequestUrl } from '../../../common/Api';
import { showSuccess, showDanger } from '../../../actions/alertsActions';
import { addReceiver, removeReceiver } from '../../../actions/inputProcessorActions';

class Connection extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
    receiver: PropTypes.instanceOf(Immutable.Map).isRequired,
    settings: PropTypes.instanceOf(Immutable.Map),
    onSetReceiverField: PropTypes.func.isRequired,
    onSetReceiverCheckboxField: PropTypes.func.isRequired,
    OnChangeUploadingFile: PropTypes.func.isRequired,
    onCancelKeyAuth: PropTypes.func.isRequired,
  }

  static defaultProps = {
    settings: Immutable.Map(),
  };

  state = {
    showRemoveKey: false,
    openReceivers: [0],
  };

  componentDidMount() {
    const { receivers } = this.props;
    receivers.forEach((receiver, key) => this.initDefaultValues(receiver, key));
  }

  initDefaultValues = (receiver, key) => {
    let show = false;
    if (receiver.get('receiver_type', null) === null) {
      const receiverType = { target: { value: 'ftp', id: `receiver_type-${key}` } };
      this.props.onSetReceiverField(receiverType, key);
    }
    if (receiver.get('passive', null) === null) {
      const passive = { target: { checked: false, id: `passive-${key}` } };
      this.props.onSetReceiverCheckboxField(passive, key);
    }
    if (receiver.get('delete_received', null) === null) {
      const deleteReceived = { target: { checked: false, id: `delete_received-${key}` } };
      this.props.onSetReceiverCheckboxField(deleteReceived, key);
    }
    if (receiver.get('key', false)) {
      show = true;
    }

    this.setState({
      showRemoveKey: show,
    });
  }

  onRemoveReceiver = (receiver, index) => () => {
    this.props.dispatch(removeReceiver(receiver, index));
  }

  openReceiver = priority => () => {
    const { openReceivers } = this.state;
    openReceivers.push(priority);
    this.setState({ openReceivers });
  }

  closeReceiver = priority => () => {
    const { openReceivers } = this.state;
    openReceivers.splice(openReceivers.indexOf(priority), 1);
    this.setState({ openReceivers });
  }

  onAddReceiver = (receiver, index) => () => {
    this.openReceiver(receiver.size)();
    this.props.dispatch(addReceiver(receiver, index));
  }

  afterUpload = (res, fileName) => {
    const { index } = this.props;

    if (res.desc === 'success') {
      this.props.dispatch(showSuccess(res.details.message));
      this.props.onSetReceiverField({ target: { value: res.details.path, id: `key-${index}` } }, index);
      this.props.onSetReceiverField({ target: { value: fileName, id: `key_label-${index}` } }, index);
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

  onChangeReceiverType = (e) => {
    const { value } = e.target;
    const { index } = this.props;

    this.props.onSetReceiverField({ target: { value, id: `receiver_type-${index}` } }, index);
  }

  renderReceiverType = (name, type) => {
    const { receivers } = this.props;
    const { index } = this.props;

    return (
      <Col sm={3} key={type}>
        <Field
          fieldType="radio"
          onChange={this.onChangeReceiverType}
          name={`receiver_type-${index}`}
          value={type}
          label={name}
          checked={receivers.getIn([index, 'receiver_type'], '') === type}
        />
      </Col>
    );
  }

  renderReceiverTypes = () => (
    this.receiverTypes.map((name, type) => this.renderReceiverType(name, type)).toArray()
  );

  receiverTypes = Immutable.Map({
    ftp: 'FTP',
    ssh: 'SFTP',
  });

  renderPanelHeader = keyLabel => (
    <div style={{ fontSize: 12, fontWeight: 'bold' }}>
      {keyLabel}
      <div className="pull-right">
        <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={this.onCancelKeyAuth}><span aria-hidden="true">&times;</span></button>
      </div>
    </div>
  );

  onChangeReceiverField = (e) => {
    const { index } = this.props;
    this.props.onSetReceiverField(e, index);
  }

  onSetReceiverCheckboxField = (e) => {
    const { index } = this.props;
    this.props.onSetReceiverCheckboxField(e, index);
  }

  getReceiver = (receiver, index) => {
    const { keyLabel } = this.props;
    const { showRemoveKey } = this.state;

    const periodOptions = [{ min: 1, label: '1 Minute' },
                            { min: 15, label: '15 Minutes' },
                            { min: 30, label: '30 Minutes' },
                            { min: 60, label: '1 Hour' },
                            { min: 360, label: '6 Hours' },
                            { min: 720, label: '12 Hours' },
                            { min: 1440, label: '24 Hours' }].map((opt, key) => (
                              <option value={opt.min} key={key}>{opt.label}</option>
                            ));

    return (
      <div>
        <div className="form-group">
          <label htmlFor="name" className="col-xs-2 control-label">Receiver Type</label>
          <div className="col-xs-9">
            {this.renderReceiverTypes()}
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="name" className="col-xs-2 control-label">Name</label>
          <div className="col-xs-4">
            <input className="form-control" id={`name-${index}`} onChange={this.onChangeReceiverField} value={receiver.get('name', '')} />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="host" className="col-xs-2 control-label">Host</label>
          <div className="col-xs-4">
            <input className="form-control" id={`host-${index}`} onChange={this.onChangeReceiverField} value={receiver.get('host', '')} />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="user" className="col-xs-2 control-label">User</label>
          <div className="col-xs-4">
            <input className="form-control" id={`user-${index}`} onChange={this.onChangeReceiverField} value={receiver.get('user', '')} />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="password" className="col-xs-2 control-label">Password</label>
          <div className="col-xs-4">
            <input type="password" className="form-control" id={`password-${index}`} onChange={this.onChangeReceiverField} value={receiver.get('password', '')} />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="remote_directory" className="col-xs-2 control-label">Directory</label>
          <div className="col-xs-4">
            <input className="fgetReceiverorm-control" id={`remote_directory-${index}`} onChange={this.onChangeReceiverField} value={receiver.get('remote_directory', '')} />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="filename_regex" className="col-xs-2 control-label">Regex</label>
          <div className="col-xs-4">
            <input className="form-control" id={`filename_regex-${index}`} onChange={this.onChangeReceiverField} value={receiver.get('filename_regex', '')} />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="period" className="col-xs-2 control-label">Period</label>
          <div className="col-xs-4">
            <select className="form-control" id={`period-${index}`} onChange={this.onChangeReceiverField} value={receiver.get('period', '')}>
              { periodOptions }
            </select>
          </div>
        </div>
        {receiver.get('receiver_type', '') !== 'ftp' &&
        <div className="form-group">
          <label htmlFor="uploadFile" className="col-xs-2 control-label">Key</label>
          <div className="col-xs-2">
            <input name="file" type="file" onClick={this.onClickFileSelect} onChange={this.onChangeFileSelect} />
          </div>
          <div className="col-xs-2">
            <div>
              {showRemoveKey && (<Panel header={this.renderPanelHeader(keyLabel)} />)}
            </div>
          </div>
        </div>}
        <div className="form-group">
          <label htmlFor="delete_received" className="col-xs-2 control-label">Delete received files from remote</label>
          <div className="col-xs-4">
            <input
              type="checkbox"
              id={`delete_received-${index}`}
              style={{ marginTop: 12 }}
              onChange={this.onSetReceiverCheckboxField}
              checked={receiver.get('delete_received', false)}
              value="1"
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="passive" className="col-xs-2 control-label">Passive mode</label>
          <div className="col-xs-4">
            <input
              type="checkbox"
              id={`passive-${index}`}
              style={{ marginTop: 12 }}
              onChange={this.onSetReceiverCheckboxField}
              checked={receiver.get('passive', false)}
              value="1"
              disabled={receiver.get('receiver_type', '') !== 'ftp'}
            />
          </div>
        </div>
      </div>
    );
  }

  getAddReceiverButton = (receiver, index) => (
    <Button
      bsSize="xsmall"
      className="btn-primary"
      onClick={this.onAddReceiver(receiver, index)}
    >
      <i className="fa fa-plus" />&nbsp;Add Receiver
    </Button>
  );

  getRemoveReceiverButton = (receiver, index) => (
    <Button
      bsStyle="link"
      bsSize="xsmall"
      onClick={this.onRemoveReceiver(receiver, index)}
    >
      <i className="fa fa-fw fa-trash-o danger-red" />
    </Button>
  );

  render() {
    const { receiver, index } = this.props;
    const { openReceivers } = this.state;
    const noRemoveStyle = { paddingLeft: 45 };
    const showRemove = index > 0;
    const actionsStyle = showRemove ? {} : noRemoveStyle;

    return (
      <div>
        <div key={`receiver-${index}`}>
          <Row>
            <Col sm={10}>{`Receiver ${index + 1}`}</Col>
            <Col sm={2} style={actionsStyle}>
              {
                showRemove && this.getRemoveReceiverButton(receiver, index)
              }
              {
                openReceivers.includes(index)
                ? (<Button onClick={this.closeReceiver(index)} bsStyle="link">
                  <i className="fa fa-fw fa-minus" />
                </Button>)
                : (<Button onClick={this.openReceiver(index)} bsStyle="link">
                  <i className="fa fa-fw fa-plus" />
                </Button>)
              }
            </Col>
          </Row>
          <Panel collapsible expanded={this.state.openReceivers.includes(index)}>
            { this.getReceiver(receiver, index) }
          </Panel>
        </div>
        { this.getAddReceiverButton(receiver, index) }
      </div>);
  }
}

const mapStateToProps = (state, props) => ({
  receivers: props.settings.get('receiver'),
});

export default connect(mapStateToProps)(Connection);
