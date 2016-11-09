import React from 'react';
import { Button } from 'react-bootstrap';


const LoadingItemPlaceholder = props => (
  <div>
    <p>Loading...</p>
    <Button onClick={props.onClick} bsStyle="default">{props.buttonLabel}</Button>
  </div>
);

LoadingItemPlaceholder.defaultProps = {
  buttonLabel: 'Back',
};

LoadingItemPlaceholder.propTypes = {
  onClick: React.PropTypes.func.isRequired,
  buttonLabel: React.PropTypes.string,
};

export default LoadingItemPlaceholder;
