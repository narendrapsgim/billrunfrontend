import React, { Component } from 'react';
import { connect } from 'react-redux';
import { saveConfig } from '../../actions';
import axios from 'axios';
import Subheader from 'material-ui/Subheader';
import {List, ListItem} from 'material-ui/List';

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
      this.setState({
        calculate: Boolean(JSON.parse(calculate)),
        process: Boolean(JSON.parse(process)),
        receive: Boolean(JSON.parse(receive))
      });
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
      <List style={{maxWidth: '400px',margin: '0 auto'}}>
        <Subheader>Configuration</Subheader>
        <ListItem primaryText="Receive" rightToggle={
          <Toggle
            ref="receive"
            onToggle={this.onToggle.bind(this, "receive")}
            toggled={this.state.receive}
          />}
        />
        <ListItem primaryText="Process" rightToggle={
          <Toggle
            ref="process"
            onToggle={this.onToggle.bind(this, "process")}
            toggled={this.state.process}
          />}
        />
        <ListItem primaryText="Calculate" rightToggle={
          <Toggle
            ref="calculate"
            onToggle={this.onToggle.bind(this, "calculate")}
            toggled={this.state.calculate}
          />}
        />
      <Subheader style={{textAlign: 'center'}}><RaisedButton
          label="Save"
          primary={true}
          onMouseUp={this.onSave}
        /></Subheader>
      </List>

    </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return state;
}

export default connect(mapStateToProps)(ConfigurationPage);
