import React, { PropTypes } from 'react';
import { Tab, Panel } from 'react-bootstrap';
import TabsWrapper from '../Elements/TabsWrapper';
import EventSettings from './EventSettings';


const Events = ({ location }) => (
  <div>
    <TabsWrapper id="EventsTab" location={location}>

      <Tab title="Events" eventKey={1}>
        <Panel style={{ borderTop: 'none' }} />
      </Tab>

      <Tab title="Settings" eventKey={2}>
        <Panel style={{ borderTop: 'none' }}>
          <EventSettings />
        </Panel>
      </Tab>

    </TabsWrapper>
  </div>
);

Events.propTypes = {
  location: PropTypes.object.isRequired,
};

export default Events;
