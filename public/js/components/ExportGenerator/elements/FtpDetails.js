import React, { Component } from 'react';
import { connect } from 'react-redux';

class FtpDetials extends Component {
  /*static propTypes = {
   stepIndex: PropTypes.number.isRequired
   };*/

  /*  constructor(props) {
   super(props);

   }*/

  render() {
    console.log(this);
    return (
      <div>
        FtpDetails
      </div>
    )
  }
}

function mapStateToProps(state, props) {
  return {};
}

export default connect(mapStateToProps)(FtpDetials);
