import React from 'react';
import { getConfig } from '@/common/Util'

const LogoImg = `${process.env.PUBLIC_URL}/assets/img/${process.env.REACT_APP_BILLRUNCLOUD_LOGO}`;
const serverApiVersion = getConfig(['env', 'serverApiVersion'],'');

const About = () => (
  <div style={{ marginTop: 20, textAlign: 'left' }}>
    <img alt="BillRun Cloud" title="BillRun Cloud" src={LogoImg} style={{ height: 25, marginBottom: 20 }} />
    {serverApiVersion !== '' && (
      <h5>version <strong>{serverApiVersion}</strong></h5>
    )}
  </div>
);

export default About;
