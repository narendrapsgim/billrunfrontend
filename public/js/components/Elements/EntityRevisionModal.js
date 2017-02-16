import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import moment from 'moment';
import classNames from 'classnames';
import { Popover, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { apiBillRun } from '../../common/Api';
import { getEntityRevisionsQuery } from '../../common/ApiQueries';


class EntityRevisionModal extends Component {

  static propTypes = {
    item: PropTypes.instanceOf(Immutable.Map),
    collection: PropTypes.string.isRequired,
    revisionBy: PropTypes.string.isRequired,
    size: PropTypes.number,
  };

  static defaultProps = {
    item: Immutable.Map(),
    size: 5,
  };

  state = {
    loaded: false,
    progress: false,
    revisions: [],
    more: false,
  }

  onEnter = () => {
    const { loaded } = this.state;
    if (!loaded) {
      this.setState({ loaded: true, progress: true });
      const query = this.buildQuery();
      apiBillRun(query)
        .then(this.onFetchSuccess)
        .catch(this.onFetchFaild);
    }
  }

  onFetchSuccess = (response) => {
    if (response.data
      && response.data[0]
      && response.data[0].data
      && response.data[0].data.details
      && Array.isArray(response.data[0].data.details)
    ) {
      const more = response.data[0].data.next_page;
      const revisions = response.data[0].data.details
        .reverse()
        .map(revision => ({
          from: revision.from.sec,
          to: revision.to.sec,
        }));
      this.setState({ revisions, more, progress: false });
    }
    this.setState({ progress: false });
  }

  onFetchFaild = (error) => {
    this.setState({ progress: false });
    console.log('error when fetching revisions: ', error);
  }

  buildQuery = () => {
    const { collection, item, revisionBy, size } = this.props;
    const key = item.get(revisionBy, 'no name');
    return getEntityRevisionsQuery(collection, revisionBy, key, size);
  }

  popoverLoading = () => {
    const { item } = this.props;
    return (
      <Popover id={`${item.getIn(['_id', '$id'], '')}-loading`} title="Revision History">
        <div>loading...</div>
      </Popover>
    );
  }

  renderStateIcon = (from, to) => {
    const stateClass = classNames('cycle', 'clickable', {
      expired: to.isBefore(moment()),
      future: from.isAfter(moment()),
      active: !to.isBefore(moment()) && !from.isAfter(moment()),
    });
    return (<div className={stateClass} />);
  }

  popoverItems = () => {
    const { item } = this.props;
    const { revisions, more } = this.state;
    return (
      <Popover id={`${item.getIn(['_id', '$id'], '')}-revisions`} title="Revision History" className="entity-revision-history-popover">
        <ul className="revision-history-list">
          { more && <li key={`${item.getIn(['_id', '$id'], '')}-more`} className="more"><div>&nbsp;</div></li>}
          { revisions.map((revision) => {
            const from = moment.unix(revision.from);
            const to = moment.unix(revision.to);
            const state = this.renderStateIcon(from, to);
            return (
              <li key={`${item.getIn(['_id', '$id'], '')}-${revision.from}`}>
                <div>
                  {state}
                  {moment.unix(revision.from).format(globalSetting.dateFormat)}
                </div>
              </li>
            );
          })
          }
        </ul>
      </Popover>
    );
  }

  render() {
    const { item } = this.props;
    const { progress, loaded } = this.state;
    const popover = (!loaded || progress) ? this.popoverLoading() : this.popoverItems();
    const to = moment.unix(item.getIn(['to', 'sec'], 0));
    const from = moment.unix(item.getIn(['from', 'sec'], 0));
    const editTooltip = (
      <Tooltip id={`${item.getIn(['_id', '$id'], '')}-help`}>Click to get<br />revision history</Tooltip>
    );
    return (
      <OverlayTrigger trigger="click" rootClose placement="right" overlay={popover} onEnter={this.onEnter}>
        <OverlayTrigger overlay={editTooltip} placement="left">
          { this.renderStateIcon(from, to) }
        </OverlayTrigger>
      </OverlayTrigger>
    );
  }
}

export default EntityRevisionModal;
