import React from 'react';
import { PageHeader } from 'react-bootstrap';

const LogoImg = require(`img/${globalSetting.billrunCloudLogo}`);// eslint-disable-line  import/no-dynamic-require
const supportMail = globalSetting.mail_support;

const Welcome = () => (
  <div style={{ marginTop: '10%', textAlign: 'center' }}>
    <PageHeader>
      Welcome to <img alt="BillRun Cloud" title="BillRun Cloud" src={LogoImg} style={{ height: 50, marginBottom: 20 }} />
    </PageHeader>
    <p>For any support topics please contact<br /><a href={`mailto:${supportMail}`}>{supportMail}</a></p>
  </div>
);

export default Welcome;
