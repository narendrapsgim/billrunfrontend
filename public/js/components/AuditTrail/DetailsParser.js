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

  isCompare = () => {
    const { item } = this.props;
    return item.get('new', null) && item.get('old', null);
  }

  renderDiff = () => {
    const { showDiff } = this.state;
    const { item } = this.props;
    const dataNew = item.get('new', null);
    const dataOld = item.get('old', null);
    const itemNew = Immutable.Map.isMap(dataNew) ? dataNew.delete('_id').toJS() : '';
    const itemOld = Immutable.Map.isMap(dataOld) ? dataOld.delete('_id').toJS() : '';
    return (
      <DiffModal show={showDiff} onClose={this.closeDiff} inputNew={itemNew} inputOld={itemOld} />
    );
  }

  getActionLabel = (action) => {
    switch (action) {
      case 'closeandnew':
        return 'New revision';
      case 'update':
        return 'Updated';
      case 'delete':
        return 'Deleted';
      case 'create':
        return 'Created';
      default:
        return '';
    }
  }

  renderMessage = () => {
    const { item } = this.props;
    return (
      <p>
        { this.getActionLabel(item.get('type', '')) }
        &nbsp;
        <Button bsStyle="link" onClick={this.openDiff} style={{ verticalAlign: 'bottom' }}>
          <i className="fa fa-compress" />
          &nbsp;
          {this.isCompare() ? 'Compare' : 'Details'}
          { this.renderDiff() }
        </Button>
      </p>
    );
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
