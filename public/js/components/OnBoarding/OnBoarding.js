import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Col, Row, Button } from 'react-bootstrap';
import Joyride from 'react-joyride';
import { Link } from 'react-router';
import ModalWrapper from '../Elements/ModalWrapper';
import {
  showOnBoarding,
  setOnBoardingStep,
  setOnBoardingState,
  onBoardingStates,
} from '../../actions/guiStateActions/pageActions';
import Invoice from './Invoice';
import {
  onBoardingShowSelector,
  onBoardingStepSelector,
  onBoardingIsRunnigSelector,
  onBoardingIsFinishedSelector,
} from '../../selectors/guiSelectors';


class OnBoarding extends Component {

  static propTypes = {
    show: PropTypes.bool,
    isRunnig: PropTypes.bool,
    isFinished: PropTypes.bool,
    step: PropTypes.number,
    router: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  static defaultProps = {
    show: false,
    step: 0,
    isRunnig: false,
    isFinished: false,
  };

  state = {
    // Ugly workaround https://github.com/gilbarbara/react-joyride/issues/223
    // Joyride set stepIndex only in componentWillReceiveProps if it was changed!
    // startIndex var need to trigget change in value from 0 to real step.
    startIndex: 0,
    showInvoce: true,
  }

  componentDidMount() {
    const { step } = this.props;
    if (step !== 0) {
      this.props.dispatch(setOnBoardingStep(0));
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.show) {
      this.setState({ startIndex: 0 });
    }
  }

  getSteps = () => ([
    {
      title: 'Account details',
      text: <p><Link to={{ pathname: '/settings', query: { tab: 1 } }} onClick={this.onCloseHelp}>Account name, Account Setting number & address....</Link></p>,
      selector: '.table-info',
      type: 'hover',
    }, {
      title: 'Plan',
      text: 'Plan name & rate from invoice summary row. If it\'s not possible to highlight them two, switch between "Qty" and "Rate"',
      selector: '.step-plan',
      type: 'hover',
    }, {
      title: 'Service',
      text: 'Service name & rate from invoice summary row',
      selector: '.step-service',
      type: 'hover',
    },
  ]);

  callback = (e) => {
    const { step } = this.props;
    console.log(e);
    if (e.action === 'close') {
      this.setState({ startIndex: step });
      // this.props.dispatch(showOnBoarding(false));
    } else if (e.action === 'start') {
      if (step !== 0) {
        this.setState({ startIndex: step, showInvoce: true });
      } else {
        this.setState({ showInvoce: true });
      }
    } else if (e.action === 'next' && e.type === 'step:before') {
      this.props.dispatch(setOnBoardingStep(e.index));
    } else if (e.action === 'back' && e.type === 'step:after') {
      this.props.dispatch(setOnBoardingStep(e.index - 1));
    }

    if (e.type === 'error:target_not_found') {
      const skiptedIndex = (e.action === 'next') ? e.index + 1 : e.index - 1;
      this.setState({ showInvoce: true });
      this.setState({ startIndex: skiptedIndex });
      this.props.dispatch(setOnBoardingStep(skiptedIndex));
    }

    if (!['close'].includes(e.action) && e.type === 'finished') {
      this.props.dispatch(setOnBoardingState(onBoardingStates.FINISHED));
    }
  }

  startTour = () => {
    const { isFinished } = this.props;
    if (isFinished) {
      this.props.dispatch(setOnBoardingStep(0));
    }
    this.props.dispatch(setOnBoardingState(onBoardingStates.RUNNING));
  }

  stopTour = () => {
    this.props.dispatch(setOnBoardingState(onBoardingStates.FINISHED));
    this.props.dispatch(showOnBoarding(false));
  }

  closeTour = () => {
    this.props.dispatch(setOnBoardingState(onBoardingStates.READY));
    this.onCloseHelp();
  }

  onCloseHelp = () => {
    this.setState({ startIndex: 0, showInvoce: false });
    this.props.dispatch(showOnBoarding(false));
  }

  renderIsReadyContent = () => (
    <div>
      <br /><br />
      <p>Start Your Tour Description</p>
      <br /><br />
      <Row>
        <Col smPush={1} sm={10}>
          <Button onClick={this.startTour} bsStyle="success" block>
            Start Tour
          </Button>
        </Col>
      </Row>
      <br /><br />
    </div>
  );

  renderIsFinishedContent = () => (
    <div>
      <br /><br />
      <p>Thank you</p>
      <br /><br />
      <Row>
        <Col sm={6}>
          <Button onClick={this.startTour} block>
            Start Tour Again
          </Button>
        </Col>
        <Col sm={6}>
          <Button onClick={this.stopTour} bsStyle="success" block>
            Start Using Billrun !
          </Button>
        </Col>
      </Row>
      <br /><br />
    </div>
  )

  render() {
    const { show, isRunnig, isFinished } = this.props;
    const { startIndex, showInvoce } = this.state;
    if (!show) {
      return null;
    }
    if (!isRunnig) {
      return (
        <ModalWrapper
          show={true}
          title="Welcome To BillRun Cloud"
          labelOk="Do it leter"
          onOk={!isFinished ? this.closeTour : null}
          labelCancel="Close"
          onCancel={!isFinished ? this.stopTour : null}
          onHide={this.closeTour}
        >
          <div className="text-center">
            {isFinished
              ? this.renderIsFinishedContent()
              : this.renderIsReadyContent()
            }
          </div>
        </ModalWrapper>
      );
    }
    const autoStart = true;
    const tourSteps = this.getSteps();
    return (
      <div className="OnBoarding" style={{ position: 'absolute', zIndex: 1029, paddingLeft: 260 }}>
        <div style={{ display: showInvoce ? 'block' : 'none' }}>
          <Invoice />
        </div>
        <Joyride
          disableOverlay={true}
          showOverlay={true}
          steps={tourSteps}
          stepIndex={startIndex}
          run={isRunnig}
          showStepsProgress={true}
          autoStart={autoStart}
          debug={false}
          callback={this.callback}
          type="continuous"
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  show: onBoardingShowSelector(state),
  isRunnig: onBoardingIsRunnigSelector(state),
  isFinished: onBoardingIsFinishedSelector(state),
  step: onBoardingStepSelector(state),
});

export default withRouter(connect(mapStateToProps)(OnBoarding));
