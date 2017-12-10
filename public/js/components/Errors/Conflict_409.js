import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
import { Col } from 'react-bootstrap';

import { userDoLogout } from '../../actions/userActions';

class Conflict_409 extends Component {

  clickLogout = (e) => {
    e.preventDefault()
    this.props.userDoLogout();
  }

  render(){
    return (
      <Col md={12} style={{textAlign:'center', marginTop:50}}>
        <i className="fa fa-smile-o fa-fw" style={{fontSize: 70}}></i>
        <h5 style={{color: '#777'}}>You already logged in</h5>
        <br/>
        <p><Link to={'/'}>Return to home page</Link> or <a href="#" onClick={this.clickLogout}> <i className="fa fa-sign-out fa-fw"></i> Logout </a></p>
      </Col>
    );
  }

}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    userDoLogout }, dispatch);
}
export default connect(null, mapDispatchToProps)(Conflict_409);
