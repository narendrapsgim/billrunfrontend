import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Panel } from 'react-bootstrap';
import Immutable from 'immutable';
import CollectionItemDisplay from './Elements/CollectionItemDisplay';
import CollectionItemAdd from './Elements/CollectionItemAdd';
import CollectionSettings from './Elements/CollectionSettings';
import { removeCollectionStep, getCollection, saveCollection } from '../../actions/collectionsActions';


class Collections extends Component {

  static defaultProps = {
    collections: Immutable.List(),
  };

  static propTypes = {
    collections: PropTypes.instanceOf(Immutable.List),
    dispatch: PropTypes.func.isRequired,
    router: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
  }

  state = {
    edit: false,
  }

  componentDidMount() {
    this.props.dispatch(getCollection('steps'));
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !Immutable.is(this.props.collections, nextProps.collections)
            || this.state.edit !== nextState.edit;
  }

  onRemove = (id) => {
    const { collections } = this.props;
    const index = collections.findIndex(item => item.get('id') === id);
    if (index > -1) {
      this.props.dispatch(removeCollectionStep(index));
      this.props.dispatch(saveCollection('steps'));
    }
  }

  onClickNew = () => {
    this.props.router.push('/collection');
  }

  onClickEdit = (id) => {
    this.props.router.push(`/collection/${id}`);
  }

  sortCollections = (collectionA, collectionB) => collectionA.get('do_after_days') > collectionB.get('do_after_days')

  renderCollection = item => (
    <CollectionItemDisplay item={item} key={item.get('id')} onRemove={this.onRemove} onEdit={this.onClickEdit} />
  )

  render() {
    const { collections } = this.props;
    return (
      <div className="row collections-list col-lg-12 clearfix">
        <Panel header={<span>Settings</span>}>
          <CollectionSettings />
        </Panel>
        <Panel header={<span>Steps</span>}>
          { collections.sort(this.sortCollections).map(this.renderCollection) }
          <CollectionItemAdd onClickNew={this.onClickNew} addLabel="Add collection step" />
        </Panel>
      </div>
    );
  }
}


const mapStateToProps = state => ({
  collections: state.settings.getIn(['collection', 'steps']),
});
export default withRouter(connect(mapStateToProps)(Collections));
