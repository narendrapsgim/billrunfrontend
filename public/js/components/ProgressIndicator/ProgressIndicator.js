import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// import { ProgressBar } from 'react-bootstrap';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';


class ProgressIndicator extends Component {

  render() {
    const { progressIndicator } = this.props;
		const enterTimeout = 500;
		const exitTimeout = 1000;
    const indecator = (progressIndicator) ? <div key={new Date()} className="system-progress-indecator"></div> : null;

    return (
      <div className="progress-indicator-container" style={{ position: 'fixed', top: 0, width: '100%', zIndex: 5001}}>
        <ReactCSSTransitionGroup transitionName="progressindicator" transitionEnterTimeout={enterTimeout} transitionLeaveTimeout={exitTimeout}>
          { indecator }
        </ReactCSSTransitionGroup>
      </div>
    );
    // return (
    //   <div style={{ position: 'fixed', top: 0, width: '100%', zIndex: 1001}}>
    //     <ProgressBar active now={100} style={{ height: 5, marginBottom: 0, backgroundColor: 'transparent', borderRadius: 0}}  />
    //   </div>
    // );
  }

}

function mapStateToProps(state) {
  return { progressIndicator: state.progressIndicator > 0 }
}
export default connect(mapStateToProps)(ProgressIndicator);
