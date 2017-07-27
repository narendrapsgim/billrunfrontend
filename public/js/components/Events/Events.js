import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Tabs, Tab, Panel } from 'react-bootstrap';
import EventSettings from './EventSettings';
import { tabSelector } from '../../selectors/entitySelector';


class Events extends Component {

  static defaultProps = {
    activeTab: 1,
  };

  static propTypes = {
    activeTab: PropTypes.number,
    location: PropTypes.shape({
      pathname: PropTypes.string,
      query: PropTypes.object,
    }).isRequired,
    router: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  handleSelectTab = (tab) => {
    const { pathname, query } = this.props.location;
    this.props.router.push({
      pathname,
      query: Object.assign({}, query, { tab }),
    });
  }

  render() {
    const { activeTab } = this.props;

    return (
      <div>
        <Tabs defaultActiveKey={activeTab} animation={false} id="EventsTab" onSelect={this.handleSelectTab}>

          <Tab title="Events" eventKey={1}>
            <Panel style={{ borderTop: 'none' }} />
          </Tab>

          <Tab title="Settings" eventKey={2}>
            <Panel style={{ borderTop: 'none' }}>
              <EventSettings />
            </Panel>
          </Tab>

        </Tabs>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  activeTab: tabSelector(state, props, 'settings'),
});
export default withRouter(connect(mapStateToProps)(Events));
