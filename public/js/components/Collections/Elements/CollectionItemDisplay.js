import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import Immutable from 'immutable';
import { showConfirmModal } from '../../../actions/guiStateActions/pageActions';


class CollectionItemDisplay extends Component {

  static propTypes = {
    item: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    onRemove: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  shouldComponentUpdate(nextProps, nextState) { // eslint-disable-line no-unused-vars
    const { item } = this.props;
    return !Immutable.is(item, nextProps.item);
  }

  onClickEdit = () => {
    const { item } = this.props;
    this.props.onEdit(item.get('id'));
  }

  onRemoveOk = () => {
    const { item } = this.props;
    this.props.onRemove(item.get('id'));
  }

  onRemoveAsk = () => {
    const { item } = this.props;
    const confirm = {
      message: `Are you sure you want to delete "${item.get('name')}" step?`,
      onOk: this.onRemoveOk,
      type: 'delete',
      labelOk: 'Delete',
    };
    this.props.dispatch(showConfirmModal(confirm));
  }

  getCollectionTypeIcon = (type) => {
    switch (type) {
      case 'mail': return <i className="fa fa-envelope-o" />;
      case 'sms': return <i className="fa fa-commenting-o" />;
      default: return null;
    }
  }

  render() {
    const { item } = this.props;
    const typeIcon = this.getCollectionTypeIcon(item.get('type'));
    return (
      <div className="col-md-3 collections-item-display">
        <div className="panel panel-default ">
          <div className="panel-heading">
            <div className="one-line" title={item.get('name')}>{typeIcon}&nbsp;{item.get('name')}</div>
          </div>
          <div className={item.get('active') ? 'panel-body' : 'panel-body dis-active'}>
            { (item.get('active'))
              ? <div>Within <span className="danger-red">{item.get('do_after_days')}</span> days</div>
              : <div className="danger-red">Not Active</div>
            }
            <Button className="btn btn-default pull-left" bsSize="xsmall" onClick={this.onClickEdit}><i className="fa fa-pencil" />&nbsp;Edit</Button>
            <Button className="btn btn-default pull-right" bsSize="xsmall" onClick={this.onRemoveAsk}><i className="fa fa-trash-o danger-red" />&nbsp;Remove</Button>
          </div>
        </div>
      </div>
    );
  }
}

export default connect()(CollectionItemDisplay);
