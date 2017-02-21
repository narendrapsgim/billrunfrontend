import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import moment from 'moment';
import { Form, FormGroup, Button } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import RevisionTimeline from './RevisionTimeline';
import ModalWrapper from './ModalWrapper';
import EntityRevisionList from '../EntityList/EntityRevisionList';

class EntityRevisionEdit extends Component {

  static propTypes = {
    revisions: PropTypes.instanceOf(Immutable.List),
    item: PropTypes.instanceOf(Immutable.Map),
    mode: PropTypes.string,
    onChangeFrom: PropTypes.func,
    itemType: PropTypes.string.isRequired,
    itemsType: PropTypes.string.isRequired,
    revisionBy: PropTypes.string.isRequired,
    revisionItemsInTimeLine: PropTypes.number,
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

  renderVerisionList = () => {
    const { itemType, itemsType, revisions, revisionBy, item } = this.props;
    const { showList } = this.state;
    return (
      <ModalWrapper title={`${item.get(revisionBy, '')} - Revision History`} show={showList} onOk={this.hideManageRevisions} >
        <EntityRevisionList items={revisions} itemType={itemType} itemsType={itemsType} />
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
      return index - 2;
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
    if (mode === 'view') {
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

  render() {
    const { item, revisions, revisionItemsInTimeLine } = this.props;
    const start = this.getStartIndex();

    return (
      <div className="entity-revision-edit">
        <div className="inline" style={{ verticalAlign: 'top', marginTop: 18, width: 110 }}>
          <label>Revisions History</label>
        </div>
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
        { this.renderVerisionList() }
      </div>
    );
  }

}

export default EntityRevisionEdit;
