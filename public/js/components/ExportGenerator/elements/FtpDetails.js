import React, { Component } from 'react';
import { connect } from 'react-redux';

class FtpDetials extends Component {
  render() {
    return (
      <div className="FtpDetails">
        <h4>Coming soon. . .</h4>
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return {};
}

export default connect(mapStateToProps)(FtpDetials);
