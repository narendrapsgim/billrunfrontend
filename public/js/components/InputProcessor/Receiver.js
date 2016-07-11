import React, { Component } from 'react';

export default class Receiver extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { settings,
            onSetReceiverField,
            onSetReceiverCheckboxField } = this.props;

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
        <h4>FTP</h4>
        <form className="form-horizontal">
          <div className="form-group">
            <label for="name" className="col-md-2 control-label">Name</label>
            <div className="col-md-4">
              <input className="form-control" id="name" onChange={onSetReceiverField} value={settings.get('name')}/>
            </div>
          </div>
          <div className="form-group">
            <label for="host" className="col-md-2 control-label">Host</label>
            <div className="col-md-4">
              <input className="form-control" id="host" onChange={onSetReceiverField} value={settings.get('host')}/>
            </div>
          </div>
          <div className="form-group">
            <label for="user" className="col-md-2 control-label">User</label>
            <div className="col-md-4">
              <input className="form-control" id="user" onChange={onSetReceiverField} value={settings.get('user')}/>
            </div>
          </div>          
          <div className="form-group">
            <label for="password" className="col-md-2 control-label">Password</label>
            <div className="col-md-4">
              <input className="form-control" id="password" onChange={onSetReceiverField} value={settings.get('password')}/>
            </div>
          </div>
          <div className="form-group">
            <label for="remote_direcotry" className="col-md-2 control-label">Direcotry</label>
            <div className="col-md-4">
              <input className="form-control" id="remote_direcotry" onChange={onSetReceiverField} value={settings.get('remote_direcotry')}/>
            </div>
          </div>                    
          <div className="form-group">
            <label for="filename_regex" className="col-md-2 control-label">Regex</label>
            <div className="col-md-4">
              <input className="form-control" id="filename_regex" onChange={onSetReceiverField} value={settings.get('filename_regex')}/>
            </div>
          </div>                    
          <div className="form-group">
            <label for="period" className="col-md-2 control-label">Period</label>
            <div className="col-md-4">
              <select className="form-control" id="period" onChange={onSetReceiverField} value={settings.get('period')}>
                { period_options }
              </select>
            </div>
          </div>                    
          <div className="form-group">
            <label for="delete_received" className="col-md-2 control-label">Delete on retrieve</label>
            <div className="col-md-4">
              <input type="checkbox" id="delete_received" onChange={onSetReceiverCheckboxField} defaultChecked={settings.get('delete_received')} value="1" />
            </div>
          </div>
          <div className="form-group">
            <label for="passive" className="col-md-2 control-label">Passive</label>
            <div className="col-md-4">
              <input type="checkbox" id="passive" onChange={onSetReceiverCheckboxField} defaultChecked={settings.get('passive')} value="1" />
            </div>
          </div>
        </form>
      </div>
    );
  }
}
