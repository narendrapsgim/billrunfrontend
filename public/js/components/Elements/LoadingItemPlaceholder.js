import React from 'react';
import { Button } from 'react-bootstrap';


const LoadingItemPlaceholder = props => (
  <div>
    <p>{props.loadingLabel}</p>
    { props.onClick !== 'undefined' && <Button onClick={props.onClick} bsStyle="default">{props.buttonLabel}</Button> }
  </div>
);

LoadingItemPlaceholder.defaultProps = {
  buttonLabel: 'Back',
  loadingLabel: 'Loading...',
};

LoadingItemPlaceholder.propTypes = {
  onClick: React.PropTypes.func,
  buttonLabel: React.PropTypes.string,
  loadingLabel: React.PropTypes.string,
};

export default LoadingItemPlaceholder;
