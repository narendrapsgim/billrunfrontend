import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';

import LoginForm from '../LoginForm';

class LoginPage extends Component {

  componentWillMount() {
    if(this.props.auth === true){
      this.props.router.push('/');
    }
  }
  // componentWillReceiveProps(nextProps) {
  //   console.log("componentWillReceiveProps props: ", this.props.auth);
  //   console.log("componentWillReceiveProps nextProps: ", nextProps.auth);
  //   if(this.props.auth !== true && nextProps.auth === true ){
  //
  //   }
  // }

  render() {
    return ( <LoginForm /> );
  }
}

LoginPage.propTypes = {
  router: React.PropTypes.shape({
    push: React.PropTypes.func.isRequired
  }).isRequired
};

function mapStateToProps(state) {
  return {
    auth: state.user.get('auth')
  }
}
export default withRouter(connect(mapStateToProps)(LoginPage));
