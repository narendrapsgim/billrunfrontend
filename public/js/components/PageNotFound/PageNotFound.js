import React from 'react';

const PageNotFound = (props) => {
  return (
    <div style={{textAlign:'center'}}>
      <br/>
      <i className="fa fa-frown-o fa-fw" style={{fontSize: 70}}></i>
      <br/>
      <h3><small>404</small></h3>
      <br/>
      <h5><small>The page you are looking for cannot be found</small></h5>
    </div>
  );
}

export default PageNotFound;
