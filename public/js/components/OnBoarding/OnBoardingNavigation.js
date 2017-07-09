import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { MenuItem } from 'react-bootstrap';
import { toggleOnBoarding } from '../../actions/guiStateActions/pageActions';
import {
  onBoardingIsRunnigSelector,
  onBoardingIsReadySelector,
  onBoardingShowSelector,
} from '../../selectors/guiSelectors';


const OnBoardingNavigation = ({ isRunnig, isReady, isShow, eventKeyBase, dispatch }) => {
  const toggle = () => {
    dispatch(toggleOnBoarding());
  };

  if (isReady) {
    return (
      <MenuItem eventKey={eventKeyBase} onClick={toggle} active={false}>
        Start Tour
      </MenuItem>
    );
  }

  if (isRunnig) {
    return (
      <MenuItem eventKey={eventKeyBase} onClick={toggle} className="running" active={true}>
        {isShow ? (
          <span>You are in  Tour</span>
        ) : (
          <span><i className="fa fa-play fa-fw" /> Resume Tour</span>
        )}
      </MenuItem>
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
