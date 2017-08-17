import React from 'react';
import { Label } from 'react-bootstrap';
import { getConfig } from '../../common/Util';

const LogoImg = require(`img/${globalSetting.billrunCloudLogo}`);// eslint-disable-line  import/no-dynamic-require

const About = () => (
  <div style={{ marginTop: 20, textAlign: 'left' }}>
    <img alt="BillRun Cloud" title="BillRun Cloud" src={LogoImg} style={{ height: 25, marginBottom: 20 }} />
    <h5>version <Label>{getConfig('serverApiVersion', '5')}</Label></h5>
  </div>
);

export default About;
