import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { getList, clearList } from '../../actions/listActions';
import CollectionItemDisplay from './Elements/CollectionItemDisplay';
import CollectionItemAdd from './Elements/CollectionItemAdd';
// DEV ONLY
import collectionStub from './stub_collection.json';

class Collections extends Component {
  constructor(props) {
    super(props);

    this.buildQuery = this.buildQuery.bind(this);

    this.state = {
      page: 0,
      sort: 'days'
    };

    // console.log(collectionStub);
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

  render() {
    // let { settings } = this.props;

    let collections = this.props.collections;

    return (
      <div className="row collections-list col-lg-12 clearfix">
          <div className="panel panel-default">
            <div className="col-md-12">
              {collections.map((entity, index) =>  {
                return (
                  <CollectionItemDisplay item={entity} index={index} key={index} />
                )
              })}

              <CollectionItemAdd />
            </div>
          </div>
      </div>

    );
  }
}

Collections.contextTypes = {
  router: React.PropTypes.object.isRequired
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getList
  }, dispatch);
}

function mapStateToProps(state, props) {
  return {
    collections: state.list.get('collections') || Immutable.fromJS(collectionStub)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Collections);

