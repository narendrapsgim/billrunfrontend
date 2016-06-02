import React, { Component } from 'react';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import * as actions from '../../actions'


export default class Auth extends Component {
  constructor(props) {
    super(props);
    this.handleOpenLogin = this.handleOpenLogin.bind(this);

    this.state = {
      message: this.getMessage(props.auth, props.pagePermission, props.userRoles)
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      message: this.getMessage(nextProps.auth, nextProps.pagePermission, nextProps.userRoles)
    });
  }

  handleOpenLogin(){
    this.props.openLoginPopup();
  }

  getMessage(auth = false, pagePermission = [], userRoles = []){
    let message = '';

    let permissionDenied = _.intersection(pagePermission, userRoles).length == 0;
    let authorized = (auth == true);

    if(!authorized){
      message = [
        <h3 key="0">Please login.</h3>,
        <br key="1"/>,
        <RaisedButton key="2" label="Login" onClick={this.handleOpenLogin} />,
      ];
    } else if(authorized && permissionDenied){
      message = <h3 style={{color:'red'}}>You don't have permission to access this page</h3>;
    } else {
      message = <h3>"Authorization Error"</h3>;
    }
    return message;
  }

  render() {
    return (
      <div style={{textAlign:'center'}}>
    		{this.state.message}
       </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    auth: state.users.auth,
    userRoles: state.users.roles,
  };
}

export default connect(mapStateToProps, actions)(Auth);
