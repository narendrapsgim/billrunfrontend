import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { NavDropdown, MenuItem } from 'react-bootstrap';
import {
  toggleOnBoarding,
  stopOnBoarding,
  showOnBoarding,
  showConfirmModal,
} from '../../actions/guiStateActions/pageActions';
import {
  onBoardingIsRunnigSelector,
  onBoardingIsReadySelector,
  onBoardingShowSelector,
} from '../../selectors/guiSelectors';


const OnBoardingNavigation = ({ isRunnig, isReady, isShow, eventKeyBase, dispatch }) => {
  const stop = () => {
    dispatch(stopOnBoarding());
    dispatch(showOnBoarding(false));
  };

  const askStop = () => {
    const confirm = {
      message: 'Are you sure you want to end the tour ?',
      onOk: stop,
      labelOk: 'End tour',
      labelCancel: 'Continue tour',
      type: 'delete',
    };
    dispatch(showConfirmModal(confirm));
  };

  const toggle = () => {
    dispatch(toggleOnBoarding());
  };

  if (isReady) {
    return (
      <MenuItem key="tour-start" eventKey={eventKeyBase} onClick={toggle} active={false}>
        Start Tour
      </MenuItem>
    );
  }

  if (isRunnig) {
    return (
      <NavDropdown
        id="tour-nav"
        eventKey={eventKeyBase}
        className="running active"
        title={
          <span>
            {isShow ? (
              <i className="fa fa-play-circle fa-fw" />
            ) : (
              <i className="fa fa-pause-circle fa-fw" />
            )}
            Tour
          </span>
        }
      >
        <MenuItem key="tour-stop" eventKey={parseFloat(`${eventKeyBase}.1`)} onClick={askStop}>
          <i className="fa fa-stop fa-fw" /> Stop Tour
        </MenuItem>
        <MenuItem key="tour-start" eventKey={parseFloat(`${eventKeyBase}.2`)} onClick={toggle}>
          {isShow ? (
            <span><i className="fa fa-pause fa-fw" /> Pause Tour</span>
          ) : (
            <span><i className="fa fa-play fa-fw" /> Resume Tour</span>
          )}
        </MenuItem>
      </NavDropdown>
    );
  }

  return (null);
};


OnBoardingNavigation.propTypes = {
  eventKeyBase: PropTypes.number,
  isShow: PropTypes.bool,
  isRunnig: PropTypes.bool,
  isReady: PropTypes.bool,
  dispatch: PropTypes.func.isRequired,
};

OnBoardingNavigation.defaultProps = {
  eventKeyBase: 1,
  isShow: false,
  isRunnig: false,
  isReady: false,
};

const mapStateToProps = state => ({
  isRunnig: onBoardingIsRunnigSelector(state),
  isReady: onBoardingIsReadySelector(state),
  isShow: onBoardingShowSelector(state),
});

export default connect(mapStateToProps)(OnBoardingNavigation);
