import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import { Form } from 'react-bootstrap';
import CollectionDetails from './Elements/CollectionDetails';
import CollectionTypeMail from './Elements/CollectionTypeMail';


class CollectionSetup extends Component {

  static propTypes = {
    item: PropTypes.instanceOf(Immutable.Map),
    onChange: PropTypes.func.isRequired,
  };

  static defaultProps = {
    item: Immutable.Map(),
  };

  onChangeContent = (path, value) => {
    this.props.onChange(['content', ...path], value);
  }

  renderStepByType = (item) => {
    switch (item.get('type', '')) {
      case 'mail':
        return (<CollectionTypeMail content={item.get('content')} onChange={this.onChangeContent} />);
      default:
        return (<p />);
    }
  }

  render() {
    const { item } = this.props;
    return (
      <div className="row">
        <div className="col-lg-12">
          <Form horizontal>
            <CollectionDetails item={item} onChange={this.props.onChange} />
            <hr />
            {this.renderStepByType(item)}
          </Form>
        </div>
      </div>
    );
  }
}

export default CollectionSetup;
