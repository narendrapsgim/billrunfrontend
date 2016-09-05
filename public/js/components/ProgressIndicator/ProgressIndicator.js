import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ProgressBar } from 'react-bootstrap';


class ProgressIndicator extends Component {

  constructor(props) {
    super(props);
    this.progressIndicatorInterval = null;
    this.interval = 10;
    this.state = { now: 0 }
  }

  componentWillUnmount() {
    clearInterval(this.progressIndicatorInterval);
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.progressIndicator === 0 ){
      clearInterval(this.progressIndicatorInterval);
      this.setState({ now: 0 });
    } else if(typeof this.progressIndicatorInterval === "undefined" || this.progressIndicatorInterval === null ) {
      this.progressIndicatorInterval = setInterval(this.updateProgress, this.interval);
    }
  }

  updateProgress = () => {
    const { infinity = false, step = 10 } = this.props;
    const { now } = this.state;

    let newNow = now + step;

    if(newNow > 100){
      if(infinity){
        newNow = 0 - step;
      } else {
        newNow = 100;
        clearInterval(this.progressIndicatorInterval);
      }
    }
    this.setState({ now: newNow });
  }

  render() {
    const { now } = this.state
    const { progressIndicator } = this.props;

    if(progressIndicator){
      return (
        <div style={{ position: 'fixed', top: 0, width: '100%', zIndex: 1001}}>
        { now > -1 ?
          <ProgressBar active now={now} style={{ height: 5, marginBottom: 0, backgroundColor: 'transparent', borderRadius: 0}}  />
          : null }
          </div>
        );
    }
    return null;
  }
}

function mapStateToProps(state) {
  return { progressIndicator: state.progressIndicator }
}
export default connect(mapStateToProps)(ProgressIndicator);
