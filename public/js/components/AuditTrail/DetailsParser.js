import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import { Button } from 'react-bootstrap';
import DiffModal from '../Elements/DiffModal';


class DetailsParser extends Component {

  static defaultProps = {
    item: Immutable.Map(),
  };

  static propTypes = {
    item: PropTypes.instanceOf(Immutable.Map),
  };

  state = {
    showDiff: false,
  }

  shouldComponentUpdate(nextProps, nextState) {
    const diffChanged = this.state.showDiff !== nextState.showDiff;
    const itemChanged = !Immutable.is(this.props.item, nextProps.item);
    return diffChanged || itemChanged;
  }

  openDiff = () => {
    this.setState({ showDiff: true });
  }

  closeDiff = () => {
    this.setState({ showDiff: false });
  }

  isCreateAction = () => {
    const { item } = this.props;
    const dataNew = item.get('new', Immutable.Map());
    const dataOld = item.get('old', Immutable.Map());
    return dataNew && !dataOld && !dataNew.isEmpty();
  }

  isDeletedAction = () => {
    const { item } = this.props;
    const dataNew = item.get('new', Immutable.Map());
    const dataOld = item.get('old', Immutable.Map());
    return !dataNew && dataOld && !dataOld.isEmpty();
  }

  isUpdateAction = () => {
    const { item } = this.props;
    const dataNew = item.get('new', Immutable.Map());
    const dataOld = item.get('old', Immutable.Map());
    return dataNew && dataOld && !dataNew.isEmpty() && !dataOld.isEmpty();
  }

  renderDiff = () => {
    const { showDiff } = this.state;
    const { item } = this.props;
    const dataNew = item.get('new', Immutable.Map());
    const dataOld = item.get('old', Immutable.Map());
    const itemNew = dataNew.delete('_id').toJS();
    const itemOld = dataOld.delete('_id').toJS();
    return (
      <DiffModal show={showDiff} onClose={this.closeDiff} inputNew={itemNew} inputOld={itemOld} />
    );
  }

  renderMessage = () => {
    const { item } = this.props;
    if (this.isCreateAction()) {
      return (<span>Created</span>);
    } else if (this.isDeletedAction()) {
      return (<span>Deleted</span>);
    } else if (this.isUpdateAction()) {
      return (
        <p>
          { item.get('type', '') === 'closeandnew' ? 'New revision' : 'Updated' }
          &nbsp;
          <Button bsStyle="link" onClick={this.openDiff} style={{ verticalAlign: 'bottom' }}>
            <i className="fa fa-compress" />
            &nbsp;Compare
            { this.renderDiff() }
          </Button>
        </p>
      );
    }
    return '';
  }

  renderDetails = () => {
    const { item } = this.props;
    const details = item.get('details', '');
    if (details && details.length > 0) {
      return (<p>{details}</p>);
    }
    return '';
  }

  render() {
    return (
      <div>
        { this.renderDetails() }
        { this.renderMessage() }
      </div>
    );
  }
}

export default DetailsParser;
