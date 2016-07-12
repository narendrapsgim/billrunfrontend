import React, { Component } from 'react';
import { connect } from 'react-redux';

class Dashboard extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { stuff } = this.props;
    return (
      <div className="Dashboard">
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return {stuff: state};
}

export default connect(mapStateToProps)(Dashboard);
