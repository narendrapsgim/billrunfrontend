import React from 'react';
import { Link } from 'react-router';
import { Col } from 'react-bootstrap';

const ErrorInternal500 = () => (
  <Col md={12} style={{ textAlign: 'center', marginTop: 50 }}>
    <i className="fa fa-heartbeat fa-fw" style={{ fontSize: 70 }} />
    <h3 style={{ color: '#777' }}>500</h3>
    <h5 style={{ color: 'red' }}>Something went wrong.</h5>
    <br />
    <p><Link to="/">Return to home page</Link></p>
  </Col>
);

export default ErrorInternal500;
