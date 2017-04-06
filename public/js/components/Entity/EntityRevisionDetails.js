import React, { Component, PropTypes } from 'react';
import { withRouter } from 'react-router';
import Immutable from 'immutable';
import moment from 'moment';
import { Form, FormGroup, Button, ControlLabel, Label } from 'react-bootstrap';
import { RevisionTimeline, ModalWrapper } from '../Elements';
import RevisionList from '../RevisionList';
import Field from '../Field';
import { getItemDateValue, getConfig, getItemId } from '../../common/Util';


class EntityRevisionDetails extends Component {

  static propTypes = {
    revisions: PropTypes.instanceOf(Immutable.List),
    item: PropTypes.instanceOf(Immutable.Map),
    minFrom: PropTypes.instanceOf(moment),
    mode: PropTypes.string,
    onChangeFrom: PropTypes.func,
    backToList: PropTypes.func,
    reLoadItem: PropTypes.func,
    clearRevisions: PropTypes.func,
    onActionEdit: PropTypes.func,
    onActionClone: PropTypes.func,
    itemName: PropTypes.string.isRequired,
    revisionItemsInTimeLine: PropTypes.number,
    router: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
  };

  static defaultProps = {
    revisionItemsInTimeLine: 3,
    revisions: Immutable.List(),
    item: Immutable.Map(),
    mode: 'view',
    minFrom: moment().add(1, 'days'), // default minFrom is tommorow
    onChangeFrom: () => {},
    backToList: () => {},
    reLoadItem: () => {},
    clearRevisions: () => {},
  };

  state = {
    showList: false,
  }

  componentWillReceiveProps(nextProps) {
    const { item } = nextProps;
    const { item: oldItem } = this.props;
    if (getItemId(item) !== getItemId(oldItem)) {
      this.hideManageRevisions();
    }
  }

  showManageRevisions = () => {
    this.setState({ showList: true });
  }

  hideManageRevisions = () => {
    this.setState({ showList: false });
  }

  onDeleteItem = (removedItemId) => {
    const { item, revisions, itemName } = this.props;
    // if screen was with deleted item, go to prev revision or list
    if (getItemId(item) === removedItemId) {
      if (revisions.size > 1) {
        const itemType = getConfig(['systemItems', itemName, 'itemType'], '');
        const itemsType = getConfig(['systemItems', itemName, 'itemsType'], '');
        const idx = revisions.findIndex(revision => getItemId(revision) === getItemId(item));
        const prevItem = (idx !== -1)
          ? revisions.get(idx + 1, revisions.get(idx - 1, ''))
          : revisions.get(0, '');
        if (!this.props.onActionEdit) {
          this.props.router.push(`${itemsType}/${itemType}/${getItemId(prevItem)}`);
        } else {
          this.props.onActionEdit(prevItem);
        }
      } else { // only one revision
        this.props.backToList(true);
      }
    } else {
      // refresh current item because it may effect by deleted revision
      // i.e active_with_future turn be editable
      this.props.reLoadItem();
    }
  }

  onCloseItem = () => {
    this.props.clearRevisions();
    this.props.reLoadItem();
  }

  renderVerisionList = () => {
    const { itemName, revisions, item } = this.props;
    const { showList } = this.state;
    const revisionBy = getConfig(['systemItems', itemName, 'uniqueField'], '');
    const title = `${item.get(revisionBy, '')} - Revision History`;
    return (
      <ModalWrapper title={title} show={showList} onCancel={this.hideManageRevisions} onHide={this.hideManageRevisions} labelCancel="Close">
        <RevisionList
          items={revisions}
          itemName={itemName}
          onSelectItem={this.hideManageRevisions}
          onDeleteItem={this.onDeleteItem}
          onCloseItem={this.onCloseItem}
          onActionEdit={this.props.onActionEdit}
          onActionClone={this.props.onActionClone}
        />
      </ModalWrapper>
    );
  }

  getStartIndex = () => {
    const { item, revisions } = this.props;
    const index = revisions.findIndex(revision => getItemId(revision) === getItemId(item));
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
      this.props.onChangeFrom(['from'], value.format('YYYY-MM-DD'));
    }
  }

  filterLegalFromDate = (date) => {
    const { item, mode } = this.props;
    if (['clone', 'create'].includes(mode)) {
      return true;
    }
    const originDate = getItemDateValue(item, 'originalValue').isSame(date, 'day');
    return originDate || this.filterLegalFromDateByMin(date);
  }

  filterLegalFromDateByMin = (date) => {
    const { minFrom } = this.props;
    return date.isSameOrAfter(minFrom, 'day');
  }

  renderRevisionsBlock = () => {
    const { item, revisions, revisionItemsInTimeLine, mode } = this.props;
    if (['clone', 'create'].includes(mode)) {
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
    const from = getItemDateValue(item, 'originalValue').format(getConfig('dateFormat', 'DD/MM/YYYY'));
    const to = getItemDateValue(item, 'to').format(getConfig('dateFormat', 'DD/MM/YYYY'));
    return (
      <div className="inline" style={{ width: 190, padding: 0, margin: '9px 10px 0 10px' }}>
        <p style={{ lineHeight: '32px' }}>{`${from} - ${to}`}</p>
      </div>
    );
  }

  renderDateSelectBlock = () => {
    const { item, mode } = this.props;
    const editable = (['closeandnew', 'clone', 'create'].includes(mode));
    const from = getItemDateValue(item, 'from');
    const originFrom = getItemDateValue(item, 'originalValue');
    const tommorow = moment().add(1, 'day');
    const selectedValue = from.isSame(originFrom, 'day') ? tommorow : from;
    const highlightDates = (mode === 'create') ? [moment()] : [originFrom, moment()];
    const inputProps = {
      fieldType: 'date',
      dateFormat: getConfig('dateFormat', 'DD/MM/YYYY'),
      isClearable: false,
      placeholder: 'Select Date...',
      filterDate: this.filterLegalFromDateByMin,
      highlightDates,
    };
    if (['closeandnew'].includes(mode)) {
      return (
        <div className="inline" style={{ width: 220, padding: 0, margin: '7px 7px 0' }}>
          <Field
            fieldType="toggeledInput"
            value={selectedValue}
            onChange={this.onChangeFrom}
            label="Change From"
            editable={editable}
            inputProps={inputProps}
            disabledDisplayValue={originFrom}
            disabledValue={originFrom}
            compare={(a, b) => a.isSame(b, 'day')}
          />
        </div>
      );
    }
    // update / create / clone
    return (
      <div className="inline" style={{ width: 220, padding: 0, margin: 7 }}>
        <Form horizontal style={{ marginBottom: 0 }}>
          <FormGroup style={{ marginBottom: 0 }}>
            <div className="inline" style={{ verticalAlign: 'top', marginRight: 15 }}>
              <ControlLabel>From</ControlLabel>
            </div>
            <div className="inline" style={{ padding: 0, width: 200 }}>
              <Field
                fieldType="date"
                value={from}
                onChange={this.onChangeFrom}
                editable={editable}
                dateFormat={getConfig('dateFormat', 'DD/MM/YYYY')}
                isClearable={false}
                placeholder="Select Date..."
                filterDate={this.filterLegalFromDate}
                highlightDates={highlightDates}
              />
            </div>
          </FormGroup>
        </Form>
      </div>
    );
  }

  renderTitle = () => {
    const { mode } = this.props;
    const title = (['clone', 'create'].includes(mode)) ? ' ' : 'Revisions History';
    return (
      <div className="inline" style={{ verticalAlign: 'top', marginTop: 16, width: 110 }}>
        <p><small>{title}</small></p>
      </div>
    );
  }

  renderMessage = () => {
    const { mode, item } = this.props;
    if (mode === 'view' && ['active_with_future'].includes(item.getIn(['revision_info', 'status'], ''))) {
      return (
        <Label bsStyle="warning">You cannot edit the current revision because a future revision exists.</Label>
      );
    }
    return null;
  }

  render() {
    const { mode, item } = this.props;
    const earlyExpiration = item.getIn(['revision_info', 'early_expiration'], false);
    return (
      <div className="entity-revision-edit">
        <div>
          { this.renderTitle() }
          { (mode === 'view' || earlyExpiration)
            ? this.renderDateViewBlock()
            : this.renderDateSelectBlock()
          }
          { this.renderRevisionsBlock() }
          { this.renderVerisionList() }
        </div>
        { this.renderMessage() }
      </div>
    );
  }

}

export default withRouter(EntityRevisionDetails);
