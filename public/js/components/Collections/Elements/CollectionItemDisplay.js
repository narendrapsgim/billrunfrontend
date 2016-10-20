import React, {Component} from 'react';
import {Button} from 'react-bootstrap';

class CollectionItemDisplay extends Component {
  static propTypes = {
    index: React.PropTypes.number.isRequired,
    item: React.PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
  }

  render() {
    let item = this.props.item;
    return (
      <div className="col-md-3 collections-item-display">
        <div className="panel panel-default ">
          <div className="panel-heading">
            {item.get('name')}
          </div>

          <div className={item.get('active') ? 'panel-body' : 'panel-body dis-active'}>
            <div className={item.get('active') ? 'danger-red' : ''}>{this.props.index +1} warning email</div>
            <div className={item.get('active') ? '' : 'hide'}>Withing <span className="danger-red">{item.get('days')}</span> days</div>
            <div className={item.get('active') ? 'hide' : 'danger-red'}>Not Active</div>
            <Button className="btn btn-default pull-left" bsSize="xsmall"><i className="fa fa-pencil"/>&nbsp;Edit</Button>
            <Button className="btn btn-default pull-right" bsSize="xsmall"><i className="fa fa-trash-o danger-red"/>&nbsp;Remove</Button>
          </div>
        </div>
      </div>

    )
  }
}

export default CollectionItemDisplay;

