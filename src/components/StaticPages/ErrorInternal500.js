import React from 'react';
import { Col, Button } from 'react-bootstrap';

const ErrorInternal500 = () => (
  <Col md={12} style={{ textAlign: 'center', marginTop: 50 }}>
    <i className="fa fa-heartbeat fa-fw" style={{ fontSize: 70 }} />
    <h3 style={{ color: '#777' }}>500</h3>
    <h5 style={{ color: 'red' }}>Something went wrong.</h5>
    <br />
    <p>
      <Button bsStyle="link" onClick={() => window.location.reload()}>
        Reload page
      </Button>
      or
      <Button bsStyle="link" onClick={() => window.location = '/'}>
        Return to home page
      </Button>
    </p>
  </Col>
);

export default ErrorInternal500;
