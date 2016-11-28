import React, { Component, PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import Immutable from 'immutable';
import ConfirmModal from '../../ConfirmModal';


export default class CollectionItemDisplay extends Component {

  static propTypes = {
    item: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    onRemove: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
  };

  state = {
    showConfirm: false,
  }

  shouldComponentUpdate(nextProps) {
    return !Immutable.is(this.props.item, nextProps.item);
  }

  onClickEdit = () => {
    const { item } = this.props;
    this.props.onEdit(item.get('id'));
  }

  onRemoveAsk = () => {
    this.setState({ showConfirm: true });
  }

  onRemoveOk = () => {
    const { item } = this.props;
    this.props.onRemove(item.get('id'));
    this.setState({ showConfirm: false });
  }

  onRemoveCancel = () => {
    this.setState({ showConfirm: false });
  }

  getCollectionTypeIcon = (type) => {
    switch (type) {
      case 'mail': return <i className="fa fa-envelope-o" />;
      case 'sms': return <i className="fa fa-commenting-o" />;
      default: return null;
    }
  }

  render() {
    const { showConfirm } = this.state;
    const { item } = this.props;
    const confirmMessage = `Are you sure you want to remove ${item.get('name')} ?`;
    const typeIcon = this.getCollectionTypeIcon(item.get('type'));

    return (
      <div className="col-md-3 collections-item-display">
        <div className="panel panel-default ">
          <div className="panel-heading">
            {typeIcon}&nbsp;{item.get('name')}
          </div>
          <div className={item.get('active') ? 'panel-body' : 'panel-body dis-active'}>
            { (item.get('active'))
              ? <div>Within <span className="danger-red">{item.get('do_after_days')}</span> days</div>
              : <div className="danger-red">Not Active</div>
            }
            <Button className="btn btn-default pull-left" bsSize="xsmall" onClick={this.onClickEdit}><i className="fa fa-pencil" />&nbsp;Edit</Button>
            <Button className="btn btn-default pull-right" bsSize="xsmall" onClick={this.onRemoveAsk}><i className="fa fa-trash-o danger-red" />&nbsp;Remove</Button>
            <ConfirmModal onOk={this.onRemoveOk} onCancel={this.onRemoveCancel} show={showConfirm} message={confirmMessage} labelOk="Yes" />
          </div>
        </div>
      </div>
    );
  }
}
