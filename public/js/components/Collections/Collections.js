import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Immutable from 'immutable';
import CollectionItemDisplay from './Elements/CollectionItemDisplay';
import CollectionItemAdd from './Elements/CollectionItemAdd';
import { getSettings, saveSettings } from '../../actions/settingsActions';
import { removeCollection } from '../../actions/collectionsActions';


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

  componentDidMount() {
    this.props.dispatch(getSettings('collection'));
  }

  shouldComponentUpdate(nextProps) {
    return !Immutable.is(this.props.collections, nextProps.collections);
  }

  onRemove = (id) => {
    const { collections } = this.props;
    const index = collections.findIndex(item => item.get('id') === id);
    if (index > -1) {
      this.props.dispatch(removeCollection(index));
      this.props.dispatch(saveSettings('collection'));
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
        <div className="panel panel-default">
          <div className="col-md-12">
            { collections.sort(this.sortCollections).map(this.renderCollection) }
            <CollectionItemAdd onClickNew={this.onClickNew} />
          </div>
        </div>
      </div>
    );
  }
}


const mapStateToProps = state => ({
  collections: state.settings.get('collection'),
});
export default withRouter(connect(mapStateToProps)(Collections));
