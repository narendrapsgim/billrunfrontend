import React, { Component } from 'react';
import { Button } from 'react-bootstrap';

class CollectionItemAdd extends Component {
  constructor(props) {
    super(props);
    this.onClickNew = this.onClickNew.bind(this);
  }

  onClickNew() {
    this.context.router.push({
      pathname: 'collection',
      query: {
        action: 'new'
      }
    });
  }

  render() {
    return (
      <div className="col-md-3 collections-item-display add-new">
        <div className="panel panel-default ">
            <Button className="btn btn-primary btn-link" bsSize="xsmall" onClick={this.onClickNew}>
              <i className="fa fa-plus"/>&nbsp;Add Collection
            </Button>
        </div>
      </div>
    )
  }
}

CollectionItemAdd.contextTypes = {
  router: React.PropTypes.object.isRequired
};


export default CollectionItemAdd;

