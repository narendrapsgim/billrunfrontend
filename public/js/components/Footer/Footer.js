import React, { PropTypes } from 'react';

const Footer = (props) => (
  <div id="footer">
    <div>
      <p className="muted credit">{props.content}</p>
    </div>
  </div>
);

Footer.defaultProps = {
  content: 'Copyright © 2016 - BillRun - Enterprise Billing System',
};

Footer.propTypes = {
  content: PropTypes.string,
};

export default Footer;
