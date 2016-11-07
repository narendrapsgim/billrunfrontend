import React, { Component } from 'react';

import { Row, Col, Form, Panel, FormGroup, ControlLabel } from 'react-bootstrap';

const Notifications = (props) => {
  return (
    <span>{ props.data }</span>
  );
};

export default Notifications;
