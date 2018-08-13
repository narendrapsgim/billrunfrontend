import React, { PropTypes } from 'react';
import { Tab, Panel } from 'react-bootstrap';
import TabsWrapper from '../Elements/TabsWrapper';
import CollectionSettings from './CollectionSettings';
import CollectionsList from './CollectionsList';


const Collections = ({ location }) => (
  <div>
    <TabsWrapper id="CollectionsTab" location={location}>

      <Tab title="Steps" eventKey={1}>
        <Panel style={{ borderTop: 'none' }}>
          <CollectionsList />
        </Panel>
      </Tab>

      <Tab title="Settings" eventKey={2}>
        <Panel style={{ borderTop: 'none' }}>
          <CollectionSettings />
        </Panel>
      </Tab>

    </TabsWrapper>
  </div>
);

Collections.propTypes = {
  location: PropTypes.object.isRequired,
};

export default Collections;
