import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import LoginForm from '../LoginForm';


class LoginPage extends Component {

  static defaultProps = {
    auth: false,
  }

  static propTypes = {
    auth: React.PropTypes.bool,
    router: React.PropTypes.shape({
      push: React.PropTypes.func.isRequired,
    }).isRequired,
  }

  componentWillMount() {
    if (this.props.auth === true) {
      this.props.router.push('/');
    }
  }

  render() {
    return (
      <LoginForm />
    );
  }

}


const mapStateToProps = state => ({
  auth: state.user.get('auth'),
});

export default withRouter(connect(mapStateToProps)(LoginPage));
