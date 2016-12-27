import React from 'react';

const LogoImg = require(`img/${globalSetting.billrunLogo}`);// eslint-disable-line  import/no-dynamic-require

const Footer = () => (
  <div id="footer">
    <div>
      <p className="muted credit">
        <span style={{ verticalAlign: 'bottom', marginRight: 5 }}><small>Powered by</small></span>
        <a href="http://bill.run/" target="_blank" rel="noreferrer noopener powered-by">
          <img src={LogoImg} style={{ height: 20 }} alt="Logo" />
        </a>
      </p>
    </div>
  </div>
);

export default Footer;
