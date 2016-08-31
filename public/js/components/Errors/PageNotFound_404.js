import React from 'react';
import { Link } from 'react-router';
import { Col } from 'react-bootstrap/lib';


const PageNotFound_404 = (props) => {
  return (
    <Col md={12} style={{textAlign:'center', marginTop:50}}>
      <i className="fa fa-frown-o fa-fw" style={{fontSize: 70}}></i>
      <h3 style={{color: '#777'}}>404</h3>
      <h5 style={{color: '#777'}}>The page you are looking for cannot be found</h5>
      <br/>
      <p><Link to={'/'}>Return to home page</Link></p>
    </Col>
  );
};

export default PageNotFound_404;
