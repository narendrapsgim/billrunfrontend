import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { PageHeader, Col, Row, Button, ButtonGroup } from 'react-bootstrap';
import Joyride from 'react-joyride';
import { Link } from 'react-router';
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
  onBoardingIsReadySelector,
} from '../../selectors/guiSelectors';


class OnBoarding extends Component {

  static propTypes = {
    show: PropTypes.bool,
    isRunnig: PropTypes.bool,
    isFinished: PropTypes.bool,
    isReady: PropTypes.bool,
    step: PropTypes.number,
    dispatch: PropTypes.func.isRequired,
  };

  static defaultProps = {
    show: false,
    step: 0,
    isRunnig: false,
    isFinished: false,
    isReady: true,
  };

  state = {
    startIndex: 0,
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

  onCloseHelp = () => {
    this.setState({ startIndex: 0 });
    this.props.dispatch(showOnBoarding(false));
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

  callback = (tourState) => {
    const { step } = this.props;
    // console.log('tourState: ', tourState);
    if (step !== 0 && tourState.action === 'start') {
      this.setState({ startIndex: step });
    }
    if (tourState.type === 'finished') {
      this.setState({ finished: true });
      this.props.dispatch(setOnBoardingState(onBoardingStates.FINISHED));
    }
    if (tourState.type === 'step:before' && ['next', 'back'].includes(tourState.action)) {
      this.props.dispatch(setOnBoardingStep(tourState.index));
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
    this.props.dispatch(setOnBoardingState(onBoardingStates.READY));
  }

  closeTour = () => {
    this.props.dispatch(setOnBoardingState(onBoardingStates.READY));
    this.onCloseHelp();
  }

  render() {
    const { show, isRunnig, isReady, isFinished } = this.props;
    const { startIndex } = this.state;
    if (!show) {
      return null;
    }
    const autoStart = false;
    const tourSteps = this.getSteps();
    return (
      <div id="page-wrapper" className="page-wrapper">
        <Row>
          <Col lg={12}><PageHeader>We will take you to a tour...</PageHeader></Col>
        </Row>
        <div>
          <ButtonGroup>
            <Button onClick={this.startTour} disabled={isRunnig} style={{ minWidth: 90 }}>
              {isFinished ? 'Start Again' : 'Start'}
            </Button>
            <Button onClick={this.stopTour} disabled={isReady} style={{ minWidth: 90 }}>
              Stop
            </Button>
            <Button onClick={this.closeTour} style={{ minWidth: 90 }}>
              Exit
            </Button>
          </ButtonGroup>
        </div>
        <Invoice />
        <Joyride
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
  isReady: onBoardingIsReadySelector(state),
  step: onBoardingStepSelector(state),
});

export default connect(mapStateToProps)(OnBoarding);
