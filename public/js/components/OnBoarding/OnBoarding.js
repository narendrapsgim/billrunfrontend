import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Col, Row, Button } from 'react-bootstrap';
import Joyride from 'react-joyride';
import ModalWrapper from '../Elements/ModalWrapper';
import {
  setOnBoardingStep,
  cancelOnBoarding,
  pendingOnBoarding,
  pauseOnBoarding,
  finishOnBoarding,
  runOnBoarding,
  showConfirmModal,
} from '../../actions/guiStateActions/pageActions';
import {
  onBoardingStepSelector,
  onBoardingIsRunnigSelector,
  onBoardingIsFinishedSelector,
  onBoardingIsStartingSelector,
  onBoardingIsPausedSelector,
} from '../../selectors/guiSelectors';


class OnBoarding extends Component {

  static propTypes = {
    isRunnig: PropTypes.bool,
    isFinished: PropTypes.bool,
    isStarting: PropTypes.bool,
    isPaused: PropTypes.bool,
    step: PropTypes.number,
    mobalTitle: PropTypes.element,
    dispatch: PropTypes.func.isRequired,
  };

  static defaultProps = {
    step: 0,
    isRunnig: false,
    isFinished: false,
    isStarting: false,
    isPaused: false,
    mobalTitle: (
      <span>
        Welcome to BillRun
        <i className="fa fa-registered" style={{ fontSize: 12, verticalAlign: 'text-top' }} />
        &nbsp;Cloud!
      </span>
    ),
  };

  state = {
    // Ugly workaround https://github.com/gilbarbara/react-joyride/issues/223
    // Joyride set stepIndex only in componentWillReceiveProps if it was changed!
    // startIndex var need to trigget change in value from 0 to real step.
    startIndex: 0,
    autoStart: true,
    run: false,
  }

  componentWillReceiveProps(nextProps, nextState) {
    const { isPaused, isRunnig } = this.props;
    const { autoStart } = this.state;
    if ((isPaused && !nextProps.isPaused) || (!isRunnig && nextProps.isRunnig)) {
      if (autoStart || nextState.autoStart) {
        setTimeout(this.switchToRun, 500); // fix first step position - let invoce HTML to load before first step start
      } else {
        this.switchToRun();
      }
    }
    if (!nextProps.isRunnig) {
      this.setState({ startIndex: 0 });
    }
  }

  onCancel = () => {
    this.props.dispatch(cancelOnBoarding());
  }

  onPause = () => {
    this.props.dispatch(pauseOnBoarding());
  }

  onFinish = () => {
    this.onStepChanged(0);
    this.props.dispatch(finishOnBoarding());
  }

  onPending = () => {
    this.onStepChanged(0);
    this.props.dispatch(pendingOnBoarding());
    this.setState({ autoStart: true });
  }

  onStart = () => {
    this.props.dispatch(runOnBoarding());
  }

  onRestart = () => {
    this.onStepChanged(0);
    this.onStart();
    this.setState({ autoStart: true });
  }

  onStepChanged = (newStep) => {
    this.props.dispatch(setOnBoardingStep(newStep));
  }

  switchToRun = () => {
    this.setState({ run: true });
  }

  askCancel = () => {
    const confirm = {
      message: 'Are you sure you want to skip the tour ?',
      onOk: this.onCancel,
      labelOk: 'Skip tour',
      type: 'delete',
    };
    this.props.dispatch(showConfirmModal(confirm));
  };

  getSteps = () => ([{
    title: '1. Account details',
    text: <p>Account name, Account Setting number & address....<br /><Link to={{ pathname: '/plans/plan', query: {} }} onClick={this.onPause}>Click to set Name</Link></p>,
    selector: '.table-info',

    type: 'click',
  }, {
    title: '2. Plan',
    text: 'Plan name & rate from invoice summary row. If it\'s not possible to highlight them two, switch between "Qty" and "Rate"',
    selector: '.step-plan',
    type: 'click',
    style: {
      beacon: {
        offsetY: -25,
      },
    },
  }, {
    title: 'Service',
    text: 'Service name & rate from invoice summary row',
    selector: '.step-service',
    type: 'click',
  }, {
    title: 'Total',
    text: 'Total account',
    selector: '.grand-total',
    type: 'click',
  }]);

  joyrideEventHandler = (e) => {
    const { step } = this.props;
    if (!['close'].includes(e.action) && e.type === 'finished') {
      this.onFinish();
    } else if (e.type === 'error:target_not_found') {
      const skiptedIndex = (e.action === 'next') ? e.index + 1 : e.index - 1;
      this.setState({ startIndex: skiptedIndex });
      this.onStepChanged(skiptedIndex);
    } else if (e.action === 'close' && e.type === 'finished') {
      const lastStep = Math.max(e.steps.length - 2, 0);
      this.setState({ startIndex: lastStep, run: true, autoStart: false });
    } else if (e.action === 'start') {
      if (step !== 0) {
        this.setState({ startIndex: step });
      }
    } else if (e.action === 'next' && e.type === 'step:before') {
      this.onStepChanged(e.index);
    } else if (e.action === 'back' && e.type === 'step:after') {
      this.onStepChanged(e.index - 1);
    }
  }

  renderIsReadyContent = () => (
    <Row>
      <Col smPush={1} sm={10}>
        <p>In this short tutorial we will walk you through the main features of BillRun
           by examining a sample BillRun invoice and guiding you how to
           do it yourself with just a few clicks.
        </p>
        <p>Ready?</p>
      </Col>
      <Col smPush={1} sm={10}>
        <Button onClick={this.onStart} bsStyle="success" block>
          Let&apos;s start the tour!
        </Button>
      </Col>
    </Row>
  );

  renderIsFinishedContent = () => (
    <Row>
      <Col smPush={1} sm={10}>
        <p>We&apos;re done!</p>
        <p>Thank you for taking the tour!</p>
      </Col>
      <Col smPush={1} sm={10} className="mt10 mb10">
        <Col sm={6}>
          <Button onClick={this.onRestart} block>
            Start Tour Again
          </Button>
        </Col>
        <Col sm={6}>
          <Button onClick={this.onPending} bsStyle="success" block>
            Start Using Billrun!
          </Button>
        </Col>
      </Col>
    </Row>
  )

  render() {
    const { isRunnig, isFinished, isStarting, mobalTitle } = this.props;
    const { startIndex, autoStart, run } = this.state;
    if (isStarting) {
      return (
        <ModalWrapper
          show={true}
          title={mobalTitle}
          labelOk="Maybe later"
          onOk={this.onPending}
          styleCancel="danger"
          onHide={this.onPending}
        >
          <div className="text-center">
            { this.renderIsReadyContent() }
          </div>
        </ModalWrapper>
      );
    }

    if (isRunnig) {
      return (
        <Joyride
          type="continuous"
          showStepsProgress={false}
          scrollToFirstStep={true}
          scrollToSteps={true}
          disableOverlay={true}
          showOverlay={true}
          debug={false}
          stepIndex={startIndex}
          steps={this.getSteps()}
          run={run}
          autoStart={autoStart}
          callback={this.joyrideEventHandler}
        />
      );
    }

    if (isFinished) {
      return (
        <ModalWrapper show={true} title={mobalTitle} onHide={this.onCancel}>
          <div className="text-center">
            { this.renderIsFinishedContent()}
          </div>
        </ModalWrapper>
      );
    }

    return (null);
  }

}

const mapStateToProps = state => ({
  isRunnig: onBoardingIsRunnigSelector(state),
  isFinished: onBoardingIsFinishedSelector(state),
  isStarting: onBoardingIsStartingSelector(state),
  isPaused: onBoardingIsPausedSelector(state),
  step: onBoardingStepSelector(state),
});

export default connect(mapStateToProps)(OnBoarding);
