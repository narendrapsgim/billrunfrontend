import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { Popover, OverlayTrigger, Tooltip, Button } from 'react-bootstrap';
import { ModalWrapper, StateIcon, RevisionTimeline } from '../Elements';
import RevisionList from '../RevisionList';
import { getConfig, getItemId } from '../../common/Util';
import { getRevisions } from '../../actions/entityListActions';


class StateDetails extends Component {

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
    allowManageRevisions: PropTypes.bool,
    onActionEdit: PropTypes.func,
    onActionClone: PropTypes.func,
    dispatch: PropTypes.func.isRequired,
  };

  static defaultProps = {
    item: Immutable.Map(),
    revisions: undefined,
    size: 5,
    allowManageRevisions: true,
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

  onCloseItem = () => {
    const { collection, item, revisionBy } = this.props;
    const key = item.get(revisionBy, '');
    this.props.dispatch(getRevisions(collection, revisionBy, key));
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
    const { item, revisions, size, revisionBy, allowManageRevisions } = this.props;
    const title = `${item.get(revisionBy, '')} - Revision History`;
    if (!revisions) {
      return (
        <Popover id={`${getItemId(item, '')}-loading`} title={title} className="entity-revision-history-popover">
          <div style={{ padding: 15 }}><i className="fa fa-spinner fa-pulse" />&nbsp;&nbsp;&nbsp;loading...</div>
          <hr />
          <div style={{ padding: '8px 12px 7px' }}>&nbsp;</div>
        </Popover>
      );
    }
    return (
      <Popover id={`${getItemId(item, '')}-revisions`} title={title} className="entity-revision-history-popover">
        <RevisionTimeline revisions={revisions} item={item} size={size} />
        <hr style={{ margin: 0, borderColor: '#3A3A3A', borderWidth: 2 }} />
        {allowManageRevisions && (<Button bsStyle="link" style={{ color: '#fff' }} onClick={this.showManageRevisions}>Manage Revisions</Button>)}
      </Popover>
    );
  }

  renderVerisionList = () => {
    const { item, itemName, revisions, revisionBy } = this.props;
    const { showList } = this.state;
    const title = `${item.get(revisionBy, '')} - Revision History`;
    return (
      <ModalWrapper title={title} show={showList} onCancel={this.hideManageRevisions} onHide={this.hideManageRevisions} labelCancel="Close">
        <RevisionList
          items={revisions}
          itemName={itemName}
          onSelectItem={this.hideManageRevisions}
          onActionEdit={this.props.onActionEdit}
          onActionClone={this.props.onActionClone}
          onCloseItem={this.onCloseItem}
        />
      </ModalWrapper>
    );
  }

  renderHelpTooltip = () => {
    const { item } = this.props;
    return (
      <Tooltip id={`${getItemId(item, '')}-help`}>Click to get<br />revision history</Tooltip>
    );
  }

  render() {
    const { item } = this.props;
    return (
      <div>
        <OverlayTrigger trigger="click" rootClose placement="right" ref="revisionOverlay" overlay={this.renderRevisionTooltip()} onEnter={this.onEnter}>
          <OverlayTrigger overlay={this.renderHelpTooltip()} placement="left">
            <div className="clickable">
              <StateIcon status={item.getIn(['revision_info', 'status'], '')} />
            </div>
          </OverlayTrigger>
        </OverlayTrigger>
        { this.renderVerisionList() }
      </div>
    );
  }
}


const mapStateToProps = (state, props) => {
  const revisionBy = getConfig(['systemItems', props.itemName, 'uniqueField'], '');
  const collection = getConfig(['systemItems', props.itemName, 'collection'], '');
  const key = props.item.get(revisionBy, '');
  const revisions = state.entityList.revisions.getIn([collection, key]);
  return ({ revisions, collection, revisionBy });
};
export default connect(mapStateToProps)(StateDetails);
