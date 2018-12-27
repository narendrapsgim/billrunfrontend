import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { Tab, Panel } from 'react-bootstrap';
import TabsWrapper from '../Elements/TabsWrapper';
import EventSettings from './EventSettingsContainer';
import EventsList from './EventsListContainer';
import { getEvents } from '../../actions/eventActions';


class Events extends Component {

  static propTypes = {
    location: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  static defaultProps = {
  };

  componentWillMount() {
    this.props.dispatch(getEvents());
  }

  render() {
    const { location } = this.props;
    return (
      <div>
        <TabsWrapper id="EventsTab" location={location}>

          <Tab title="Balance Events" eventKey={1}>
            <Panel style={{ borderTop: 'none' }}>
              <EventsList eventType="balance" />
            </Panel>
          </Tab>

          <Tab title="Fraud Events" eventKey={2}>
            <Panel style={{ borderTop: 'none' }}>
              <EventsList eventType="fraud" />
            </Panel>
          </Tab>

          <Tab title="Settings" eventKey={3}>
            <Panel style={{ borderTop: 'none' }}>
              <EventSettings />
            </Panel>
          </Tab>

        </TabsWrapper>
      </div>
    );
  }
}

export default connect(null)(Events);
