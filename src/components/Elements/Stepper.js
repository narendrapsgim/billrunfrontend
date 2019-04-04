import React from 'react';
import PropTypes from 'prop-types';
import ReactStepper from 'react-stepper-horizontal';

/**
 * Important !
 * In fint size chnaged from 24, remember to update style fule that fiz bug
 * src/styles/scss/overrides/react-stepper-horizontal.scss
 * https://github.com/mu29/react-stepper/issues/21
 */

const Stepper = ({steps, activeIndex}) => (
  <div className='stepper-container'>
    <ReactStepper
      titleTop={5}
      lineMarginOffset={10}
      circleTop={0}
      size={24}
      titleFontSize={12}
      circleFontSize={12}
      activeStep={activeIndex}
      steps={steps}
    />
  </div>
);

Stepper.defaultProps = {
  activeStep: 0,
  steps: [],
};

Stepper.propTypes = {
  activeIndex: PropTypes.number,
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
    })
  ),
};

export default Stepper;
