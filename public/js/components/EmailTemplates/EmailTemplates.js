import React, { PropTypes } from 'react';
import { Tab, Panel } from 'react-bootstrap';
import TabsWrapper from '../Elements/TabsWrapper';
import InvoiceReady from './InvoiceReady';

const EmailTemplates = ({ location }) => (
  <div>
    <TabsWrapper id="EmailTemplatesTab" location={location}>

      <Tab title="Invoice ready" eventKey={1}>
        <Panel style={{ borderTop: 'none' }}>
          <InvoiceReady />
        </Panel>
      </Tab>

    </TabsWrapper>
  </div>
);

EmailTemplates.propTypes = {
  location: PropTypes.object.isRequired,
};

export default EmailTemplates;
