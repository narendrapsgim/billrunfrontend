import React, { Component, PropTypes } from 'react';
import { withRouter } from 'react-router';
import Immutable from 'immutable';
import moment from 'moment';
import { Form, FormGroup, Button } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import { RevisionTimeline, ModalWrapper } from '../Elements';
import RevisionList from '../RevisionList';

class EntityRevisionDetails extends Component {

  static propTypes = {
    revisions: PropTypes.instanceOf(Immutable.List),
    item: PropTypes.instanceOf(Immutable.Map),
    mode: PropTypes.string,
    onChangeFrom: PropTypes.func,
    itemName: PropTypes.string.isRequired,
    revisionItemsInTimeLine: PropTypes.number,
    router: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
  };

  static defaultProps = {
    revisions: Immutable.List(),
    item: Immutable.Map(),
    mode: 'view',
    onChangeFrom: () => {},
    revisionItemsInTimeLine: 3,
  };

  state = {
    showList: false,
  }

  componentWillReceiveProps(nextProps) {
    const { item } = nextProps;
    const { item: oldItem } = this.props;
    if (item.getIn(['_id', '$id'], '') !== oldItem.getIn(['_id', '$id'], '')) {
      this.hideManageRevisions();
    }
  }

  showManageRevisions = () => {
    this.setState({ showList: true });
  }

  hideManageRevisions = () => {
    this.setState({ showList: false });
  }

  onDeleteItem = (removedItem) => {
    const { item, revisions, itemName } = this.props;
    if (item.getIn(['_id', '$id'], '') === removedItem.getIn(['_id', '$id'], '')) {
      const idx = revisions.findIndex(revision => revision.getIn(['_id', '$id'], false) === item.getIn(['_id', '$id'], false));
      if (idx === 0 && revisions.size > 1) {
        const prevItemId = revisions.getIn([1, '_id', '$id'], '');
        const itemType = globalSetting.systemItems[itemName].itemType;
        const itemsType = globalSetting.systemItems[itemName].itemsType;
        this.props.router.push(`${itemsType}/${itemType}/${prevItemId}`);
      }
    }
  }

  renderVerisionList = () => {
    const { itemName, revisions, item } = this.props;
    const { showList } = this.state;
    const revisionBy = globalSetting.systemItems[itemName].uniqueField;
    return (
      <ModalWrapper title={`${item.get(revisionBy, '')} - Revision History`} show={showList} onOk={this.hideManageRevisions} >
        <RevisionList
          items={revisions}
          itemName={itemName}
          onSelectItem={this.hideManageRevisions}
          onDeleteItem={this.onDeleteItem}
        />
      </ModalWrapper>
    );
  }

  getStartIndex = () => {
    const { item, revisions } = this.props;
    const index = revisions.findIndex(revision => revision.getIn(['_id', '$id'], '') === item.getIn(['_id', '$id'], ''));
    if (index <= 0) {
      return 0;
    }
    if (index + 1 === revisions.size) {
      return ((index - 2) >= 0) ? index - 2 : 0;
    }
    return index - 1;
  }

  onChangeFrom = (value) => {
    if (value) {
      this.props.onChangeFrom(['from'], value.toISOString());
    }
  }

  getFromDateValue = (item) => {
    if (item.get('from', false) && typeof item.get('from', false) === 'string') {
      return moment(item.get('from', moment()));
    }
    return moment.unix(item.getIn(['from', 'sec'], moment().unix()));
  }

  renderDateFromfields = () => {
    const { item, mode } = this.props;
    const from = this.getFromDateValue(item);
    if (mode === 'view' || mode === 'update') {
      return (
        <p style={{ lineHeight: '35px' }}>{ from.format(globalSetting.dateFormat)}</p>
      );
    }
    return (
      <DatePicker
        className="form-control"
        dateFormat={globalSetting.dateFormat}
        selected={from}
        onChange={this.onChangeFrom}
        isClearable={false}
        placeholderText="Select Date..."
        minDate={moment()}
      />
    );
  }

  renderRevisionsBlock = () => {
    const { item, revisions, revisionItemsInTimeLine, mode } = this.props;
    if (mode === 'create') {
      return null;
    }
    const start = this.getStartIndex();
    return (
      <div className="inline pull-right">
        <div className="inline mr10">
          <RevisionTimeline
            revisions={revisions}
            item={item}
            size={revisionItemsInTimeLine}
            start={start}
          />
        </div>
        <div className="inline">
          <Button bsStyle="link" className="pull-right" style={{ padding: '0 10px 15px 10px' }} onClick={this.showManageRevisions}>
            Manage Revisions
          </Button>
        </div>
      </div>
    );
  }

  renderDateViewBlock = () => {
    const { item } = this.props;
    const from = moment.unix(item.getIn(['from', 'sec'], moment().unix()));
    const to = moment.unix(item.getIn(['to', 'sec'], moment().unix()));
    return (
      <div className="inline" style={{ width: 165, padding: 0, margin: '9px 20px 0 20px' }}>
        <p style={{ lineHeight: '35px' }}>{ from.format(globalSetting.dateFormat)} - { to.format(globalSetting.dateFormat)}</p>
      </div>
    );
  }

  renderDateSelectBlock = () => (
    <div className="inline" style={{ width: 155, padding: 0, margin: '9px 25px 0 25px' }}>
      <Form horizontal style={{ marginBottom: 0 }}>
        <FormGroup style={{ marginBottom: 0 }}>
          <div className="inline" style={{ verticalAlign: 'top', marginTop: 10, marginRight: 15 }}>
            <label>From</label>
          </div>
          <div className="inline" style={{ padding: 0, width: 120 }}>
            { this.renderDateFromfields() }
          </div>
        </FormGroup>
      </Form>
    </div>
  )

  renderTitle = () => {
    const { mode } = this.props;
    if (mode === 'create') {
      return (
        <div className="inline" style={{ verticalAlign: 'top', marginTop: 18, width: 110 }}>
          &nbsp;
        </div>
      );
    }
    return (
      <div className="inline" style={{ verticalAlign: 'top', marginTop: 18, width: 110 }}>
        <label>Revisions History</label>
      </div>
    );
  }

  renderEditMessage = () => {
    const { mode, item } = this.props;
    if (mode === 'view' && moment.unix(item.getIn(['to', 'sec'], moment().unix())).isAfter(moment())) {
      return (
        <small className="danger-red"> You cannot edit the current revision because future revision exists.</small>
      );
    }
    return null;
  }

  render() {
    const { mode } = this.props;
    return (
      <div className="entity-revision-edit">
        <div>
          { this.renderTitle() }
          { mode === 'view'
            ? this.renderDateViewBlock()
            : this.renderDateSelectBlock()
          }
          { this.renderRevisionsBlock() }
          { this.renderVerisionList() }
        </div>
        { this.renderEditMessage() }
      </div>
    );
  }

}

export default withRouter(EntityRevisionDetails);
