import React, { Component } from 'react';
import { connect } from 'react-redux';
import { saveConfig } from '../../actions';
import $ from 'jquery';
import axios from 'axios';

import Toggle from 'material-ui/Toggle';
import RaisedButton from 'material-ui/RaisedButton';

class ConfigurationPage extends Component {
  constructor(props) {
    super(props);
    this.onToggle = this.onToggle.bind(this);
    this.onSave = this.onSave.bind(this);

    this.state = {
      receive: true,
      process: false,
      calculate: true
    };
  }
  
  componentWillMount() {
    let url = `/admin/config`;
    let axiosInstance = axios.create({
      withCredentials: true,
      baseURL: globalSetting.serverUrl
    });
    axiosInstance.get(url).then(response => {
      let { calculate, process, receive } = response.data;
      this.setState({calculate, process, receive});
    });
  }
  
  onToggle(name) {
    let value = !this.refs[name].state.switched;
    this.setState({[name]: value});
  }

  onSave() {
    this.props.dispatch(saveConfig(this.state));
  }
  
  render() {
    return (
      <div>
        <h4>Configuration</h4>
        <Toggle
            label="Receive"
            ref="receive"
            onToggle={this.onToggle.bind(this, "receive")}
            toggled={this.state.receive}
        />
        <Toggle
            label="Process"
            ref="process"
            onToggle={this.onToggle.bind(this, "process")}
            toggled={this.state.process}
        />
        <Toggle
            label="Calculate"
            ref="calculate"
            onToggle={this.onToggle.bind(this, "calculate")}
            toggled={this.state.calculate}
        />
        <RaisedButton
            label="Save"
            primary={true}
            onMouseUp={this.onSave}
        />        
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return state;
}

export default connect(mapStateToProps)(ConfigurationPage);
