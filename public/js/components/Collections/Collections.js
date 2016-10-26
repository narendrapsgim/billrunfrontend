import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { getList, clearList } from '../../actions/listActions';
import { toggleDeleteConfirm } from '../../actions/guiStateActions/deleteConfirmAction';

import CollectionItemDisplay from './Elements/CollectionItemDisplay';
import CollectionItemAdd from './Elements/CollectionItemAdd';
import ConfirmDelete from '../Elements/ConfirmDelete';
// DEV ONLY
import collectionStub from './stub_collection.json';

class Collections extends Component {
  static propTypes = {
    collections: React.PropTypes.instanceOf(Immutable.List)
  }

  constructor(props) {
    super(props);

    this.buildQuery = this.buildQuery.bind(this);

    this.state = {
      page: 0,
      sort: 'days'
    };

    this.confirmDeleteModal = this.confirmDeleteModal.bind(this);
  }

  componentDidMount() {
    // this.props.getList("collections", this.buildQuery());
  }

  buildQuery() {
    return {
      api: "find",
      params: [
        { collection: "collections" }/*,
        { size: this.state.size },
        { page: this.state.page },
        { sort: this.state.sort },
        { query: this.state.filter }*/
      ]
    };
  }

  confirmDeleteModal (collection_name = '') {
    let msg = 'Please confirm ' + collection_name;
    console.log('msg ', msg );
    this.props.dispatch(toggleDeleteConfirm(msg));
  }

  render() {
    let collections = this.props.collections;

    return (
      <div className="row collections-list col-lg-12 clearfix">
        <div className="panel panel-default">
          <div className="col-md-12">
            {collections.map((entity, index) => {
              return (
                <CollectionItemDisplay item={entity} index={index} key={index} onRemoveClick={this.confirmDeleteModal}/>
              )
            })}

            <CollectionItemAdd />
          </div>
        </div>

        <ConfirmDelete  />
      </div>
    );
  }
}

Collections.contextTypes = {
  router: React.PropTypes.object.isRequired
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getList,
    toggleDeleteConfirm
  }, dispatch);
}

function mapStateToProps(state, props) {
  return {
    collections: state.list.get('collections') || Immutable.fromJS(collectionStub)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Collections);
