import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import moment from 'moment';
import { Button } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import { ConfirmModal } from '../Elements';
import { getItemDateValue, getConfig, isItemClosed } from '../../common/Util';
import { closeEntity } from '../../actions/entityActions';
import { showSuccess } from '../../actions/alertsActions';
import { getRevisions } from '../../actions/entityListActions';


class CloseActionBox extends Component {

  static propTypes = {
    item: PropTypes.instanceOf(Immutable.Map),
    revisions: PropTypes.instanceOf(Immutable.List),
    itemName: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  static defaultProps = {
    item: Immutable.Map(),
    revisions: Immutable.List(),
  };

  constructor(props) {
    super(props);
    const isItemWillClose = props.item && isItemClosed(props.item, props.revisions);
    this.state = {
      showConfirmRemove: false,
      showConfirmClose: false,
      itemToRemove: null,
      closeDate: isItemWillClose ? getItemDateValue(props.item, 'to', null) : null,
    };
  }

  onClickCloseConfirm = () => {
    this.setState({
      showConfirmClose: false,
      showCloseDetails: false,
      closeDate: null,
    });
  }

  onClickCloseOk = () => {
    const { closeDate } = this.state;
    const { itemName, item } = this.props;
    const collection = getConfig(['systemItems', itemName, 'collection'], '');
    if (item) {
      const itemToClose = item.set('to', closeDate.toISOString());
      this.props.dispatch(closeEntity(collection, itemToClose)).then(this.afterClose);
    }
  }

  afterClose = (response) => {
    const { closeDate } = this.state;
    const { itemName, item } = this.props;
    if (response.status) {
      this.props.dispatch(showSuccess(`Close date was set to ${closeDate.format(globalSetting.dateFormat)}`));
      const collection = getConfig(['systemItems', itemName, 'collection'], '');
      const uniqueField = getConfig(['systemItems', itemName, 'uniqueField'], '');
      const key = item.get(uniqueField, '');
      this.props.dispatch(getRevisions(collection, uniqueField, key)); // refetch revision list because item was (changed in / added to) list
      this.onClickCloseConfirm();
    }
  }

  toggleCloseAction = () => {
    const { showCloseDetails } = this.state;
    this.setState({ showCloseDetails: !showCloseDetails });
  }

  toggleCloseConfirm = () => {
    const { showConfirmClose } = this.state;
    this.setState({ showConfirmClose: !showConfirmClose });
  }

  onChangeFrom = (date) => {
    this.setState({ closeDate: date });
  }

  isFutureRevisionexist = () => {
    const { revisions } = this.props;
    return revisions.findIndex(item => getItemDateValue(item, 'from', null).isAfter(moment())) !== -1;
  }

  renderDateFromfields = () => {
    const { item } = this.props;
    const { closeDate } = this.state;
    const tommorow = moment().add(1, 'days');
    const btnStyle = { marginLeft: 5, verticalAlign: 'bottom' };
    const itemToDate = getItemDateValue(item, 'to', null);
    const disableSubmit = closeDate === null
      || (itemToDate && closeDate && itemToDate.isSame(closeDate));
    return (
      <div className="inline">
        <DatePicker
          className="form-control inline"
          dateFormat={globalSetting.dateFormat}
          selected={closeDate}
          onChange={this.onChangeFrom}
          isClearable={true}
          placeholderText="Select Date..."
          minDate={tommorow}
        />
        <Button onClick={this.toggleCloseConfirm} style={btnStyle} disabled={disableSubmit}>
          OK
        </Button>
      </div>
    );
  }

  render() {
    const { item } = this.props;
    const { showCloseDetails, showConfirmClose } = this.state;
    const closeConfirmMessage = 'Are you sure you want to close revision ?';
    if (item && !this.isFutureRevisionexist()) {
      return (
        <div>
          <Button bsStyle="link" onClick={this.toggleCloseAction} style={{ verticalAlign: 'bottom', lineHeight: '24px' }}>
            Close <i className="fa fa-angle-right" />
          </Button>
          { showCloseDetails && this.renderDateFromfields() }
          <ConfirmModal onOk={this.onClickCloseOk} onCancel={this.onClickCloseConfirm} show={showConfirmClose} message={closeConfirmMessage} labelOk="Yes" />
        </div>
      );
    }
    return null;
  }
}

export default connect()(CloseActionBox);
