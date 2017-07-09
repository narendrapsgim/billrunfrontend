import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Col, Row, Button } from 'react-bootstrap';
import Joyride from 'react-joyride';
import ModalWrapper from '../Elements/ModalWrapper';
import {
  showOnBoarding,
  setOnBoardingStep,
  setOnBoardingState,
  onBoardingStates,
  showConfirmModal,
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
    autoStart: false,
    run: false,
    steps: [],
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
      title: '1. Account details',
      text: <p>Account name, Account Setting number & address....<br /><Link to={{ pathname: '/plans/plan', query: {} }} onClick={this.onCloseHelp}>Click to set Name</Link></p>,
      selector: '.table-info',
      type: 'click',
      isFixed: true,
    }, {
      title: '2. Plan',
      text: 'Plan name & rate from invoice summary row. If it\'s not possible to highlight them two, switch between "Qty" and "Rate"',
      selector: '.step-plan',
      type: 'click',
      isFixed: true,
    }, {
      title: 'Service',
      text: 'Service name & rate from invoice summary row',
      selector: '.step-service',
      type: 'click',
      isFixed: true,
    },
  ]);

  callback = (e) => {
    const { step } = this.props;
    // console.log(e);

    if (!['close'].includes(e.action) && e.type === 'finished') {
      this.props.dispatch(setOnBoardingState(onBoardingStates.FINISHED));
    } else if (e.type === 'error:target_not_found') {
      const skiptedIndex = (e.action === 'next') ? e.index + 1 : e.index - 1;
      this.setState({ startIndex: skiptedIndex });
      this.props.dispatch(setOnBoardingStep(skiptedIndex));
    } else if (e.action === 'close' && e.type === 'finished') {
      // return;
      // this.joyride.reset(true);
      this.setState({ startIndex: 0 });
      // this.props.dispatch(showOnBoarding(false));
    } else if (e.action === 'start') {
      if (step !== 0) {
        this.setState({ startIndex: step });
      }
    } else if (e.action === 'next' && e.type === 'step:before') {
      this.props.dispatch(setOnBoardingStep(e.index));
    } else if (e.action === 'back' && e.type === 'step:after') {
      this.props.dispatch(setOnBoardingStep(e.index - 1));
    }
  }

  startTour = () => {
    const { isFinished } = this.props;
    if (isFinished) {
      this.props.dispatch(setOnBoardingStep(0));
    }
    this.props.dispatch(setOnBoardingState(onBoardingStates.RUNNING));
    this.startTourSteps();
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
    this.setState({ startIndex: 0 });
    this.props.dispatch(showOnBoarding(false));
  }

  askStop = () => {
    const confirm = {
      message: 'Are you sure you want to end the tour ?',
      onOk: this.stopTour,
      labelOk: 'End tour',
      labelCancel: 'Continue tour',
      type: 'delete',
    };
    this.props.dispatch(showConfirmModal(confirm));
  };

  startTourSteps = () => {
    // console.log('starting !');
    this.setState({ run: true });
    // this.joyride.reset(true);
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
    const { startIndex, autoStart, steps, run } = this.state;
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
          labelCancel="Skip Tour"
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
    return (
      <div className="OnBoarding">

        <ModalWrapper
          title="Example Invoice"
          show={true}
          modalSize="large"
          onHide={this.onCloseHelp}
          labelCancel="End Tour"
          onCancel={this.askStop}
          labelOk="Pause Tour"
          onOk={this.onCloseHelp}
        >
          <span>
            <Invoice />
            <Joyride
              type="continuous"
              ref={(j) => { this.joyride = j; }}
              showStepsProgress={false}
              scrollToFirstStep={true}
              disableOverlay={true}
              showOverlay={true}
              debug={false}
              stepIndex={startIndex}
              steps={this.getSteps()}
              run={run}
              autoStart={autoStart}
              callback={this.callback}
            />
          </span>
        </ModalWrapper>
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

export default connect(mapStateToProps)(OnBoarding);
