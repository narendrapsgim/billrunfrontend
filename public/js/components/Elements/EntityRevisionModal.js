import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { Popover, OverlayTrigger, Tooltip, Button } from 'react-bootstrap';
import ModalWrapper from './ModalWrapper';
import StateIcon from './StateIcon';
import RevisionTimeline from './RevisionTimeline';
import EntityRevisionList from '../EntityList/EntityRevisionList';
import { getRevisions } from '../../actions/entityListActions';


class EntityRevisionModal extends Component {

  static propTypes = {
    item: PropTypes.instanceOf(Immutable.Map),
    itemName: PropTypes.string.isRequired,
    revisions: PropTypes.oneOfType([
      PropTypes.instanceOf(Immutable.List),
      null,
    ]),
    collection: PropTypes.string.isRequired,
    revisionBy: PropTypes.string.isRequired,
    size: PropTypes.number,
    dispatch: PropTypes.func.isRequired,
  };

  static defaultProps = {
    item: Immutable.Map(),
    revisions: undefined,
    size: 5,
  };

  state = {
    showList: false,
  }

  onEnter = () => {
    const { collection, item, revisionBy, revisions } = this.props;
    if (!revisions) {
      const key = item.get(revisionBy, '');
      this.props.dispatch(getRevisions(collection, revisionBy, key));
    }
  }

  showManageRevisions = () => {
    const { revisionOverlay = {} } = this.refs; // eslint-disable-line  react/no-string-refs
    revisionOverlay.hide();
    this.setState({ showList: true });
  }

  hideManageRevisions = () => {
    this.setState({ showList: false });
  }

  renderRevisionTooltip = () => {
    const { item, revisions, size } = this.props;
    if (!revisions) {
      return (
        <Popover id={`${item.getIn(['_id', '$id'], '')}-loading`} title="Revision History">
          <div>loading...</div>
        </Popover>
      );
    }
    return (
      <Popover id={`${item.getIn(['_id', '$id'], '')}-revisions`} title="Revision History" className="entity-revision-history-popover">
        <RevisionTimeline revisions={revisions} item={item} size={size} />
        <hr style={{ margin: 0, borderColor: '#3A3A3A', borderWidth: 2 }} />
        <Button bsStyle="link" style={{ color: '#fff' }} onClick={this.showManageRevisions}>Manage Revisions</Button>
      </Popover>
    );
  }

  renderVerisionList = () => {
    const { item, itemName, revisions, revisionBy } = this.props;
    const { showList } = this.state;
    return (
      <ModalWrapper title={`${item.get(revisionBy, '')} - Revision History`} show={showList} onOk={this.hideManageRevisions} >
        <EntityRevisionList
          items={revisions}
          itemName={itemName}
          onSelectItem={this.hideManageRevisions}
        />
      </ModalWrapper>
    );
  }

  renderHelpTooltip = () => {
    const { item } = this.props;
    return (
      <Tooltip id={`${item.getIn(['_id', '$id'], '')}-help`}>Click to get<br />revision history</Tooltip>
    );
  }

  render() {
    const { item } = this.props;
    const from = item.getIn(['from', 'sec'], '');
    const to = item.getIn(['to', 'sec'], '');
    return (
      <div>
        <OverlayTrigger trigger="click" rootClose placement="right" ref="revisionOverlay" overlay={this.renderRevisionTooltip()} onEnter={this.onEnter}>
          <OverlayTrigger overlay={this.renderHelpTooltip()} placement="left">
            <div className="clickable">
              <StateIcon from={from} to={to} />
            </div>
          </OverlayTrigger>
        </OverlayTrigger>
        { this.renderVerisionList() }
      </div>
    );
  }
}


const mapStateToProps = (state, props) => {
  const revisionBy = globalSetting.systemItems[props.itemName].uniqueField;
  const collection = globalSetting.systemItems[props.itemName].collection;
  const key = props.item.get(revisionBy, '');
  const revisions = state.entityList.revisions.getIn([collection, key]);
  return ({ revisions, collection, revisionBy });
};
export default connect(mapStateToProps)(EntityRevisionModal);
