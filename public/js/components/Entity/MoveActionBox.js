import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import DatePicker from 'react-datepicker';
import { Form, FormGroup, Col, Tabs, Tab, Button } from 'react-bootstrap';
import { ModalWrapper, RevisionTimeline, ConfirmModal } from '../Elements';
import { getItemDateValue, getConfig, getRevisionStartIndex } from '../../common/Util';

class CloseActionBox extends Component {

  static propTypes = {
    item: PropTypes.instanceOf(Immutable.Map),
    itemName: PropTypes.string.isRequired,
    revisions: PropTypes.instanceOf(Immutable.List),
    onMoveItem: PropTypes.func,
    onCancelMoveItem: PropTypes.func,
  }

  static defaultProps = {
    item: Immutable.Map(),
    revisions: Immutable.List(),
    onMoveItem: () => {},
    onCancelMoveItem: () => {},
  }

  state = {
    startDate: getItemDateValue(this.props.item, 'from', null),
    endDate: getItemDateValue(this.props.item, 'to', null),
    activeTab: 1,
    progress: false,
    showEndConfirm: false,
    showStartConfirm: false,
  }

  onClickEndMoveOk = () => {
    this.onClickOk('to');
  }

  onClickStartMoveOk = () => {
    this.onClickOk('from');
  }

  onClickOk = (type) => {
    const { startDate, endDate } = this.state;
    const { item } = this.props;
    const itemToMove = item.withMutations(listwithMutations =>
      listwithMutations
        .set('from', startDate.toISOString())
        .set('to', endDate.toISOString())
    );
    this.onClickCloseConfirm();
    this.props.onMoveItem(itemToMove, type);
  }

  onClickCancel = () => {
    this.props.onCancelMoveItem();
  }

  onChangeDateFrom = (date) => {
    const { item } = this.props;
    if (date !== null) {
      this.setState({ startDate: date });
    } else {
      const startDate = getItemDateValue(item, 'from', null);
      this.setState({ startDate });
    }
  }

  onChangeDateTo = (date) => {
    const { item } = this.props;
    if (date !== null) {
      this.setState({ endDate: date });
    } else {
      const endDate = getItemDateValue(item, 'to', null);
      this.setState({ endDate });
    }
  }

  handleSelectTab = (key) => {
    this.setState({ activeTab: key });
  }

  toggleStartConfirm = () => {
    const { showStartConfirm } = this.state;
    this.setState({ showStartConfirm: !showStartConfirm });
  }

  toggleEndConfirm = () => {
    const { showEndConfirm } = this.state;
    this.setState({ showEndConfirm: !showEndConfirm });
  }

  onClickCloseConfirm = () => {
    this.setState({ showEndConfirm: false, showStartConfirm: false });
  }

  render() {
    const { item, revisions, itemName } = this.props;
    const {
      startDate,
      endDate,
      activeTab,
      progress,
      showEndConfirm,
      showStartConfirm,
    } = this.state;
    const start = getRevisionStartIndex(item, revisions);
    const revisionBy = getConfig(['systemItems', itemName, 'uniqueField'], '');
    const title = `${item.get(revisionBy, '')} - Move`;
    const btnStyle = { marginLeft: 5, verticalAlign: 'bottom' };
    const formStyle = { padding: '35px 50px 0 50px' };
    const disableFromSubmit = startDate.isSame(getItemDateValue(item, 'from', null), 'days') || progress;
    const disableToSubmit = endDate.isSame(getItemDateValue(item, 'to', null), 'days') || progress;
    const dateFormat = getConfig('dateFormat', 'DD/MM/YYYY');
    const startConfirmMessage = `Are you sure you want to set new start date ${startDate.format(dateFormat)} ?`;
    const endConfirmMessage = `Are you sure you want to set new end date ${endDate.format(dateFormat)} ?`;
    return (
      <ModalWrapper show={true} title={title} labelCancel="Close" onCancel={this.onClickCancel} onHide={this.onClickCancel}>

        <div className="text-center">
          <RevisionTimeline
            revisions={revisions}
            item={item}
            size={10}
            start={start}
          />
        </div>
        <br />
        <Tabs defaultActiveKey={activeTab} animation={false} id="move-entity" onSelect={this.handleSelectTab}>
          <Tab title="Move Start Date" eventKey={1}>
            <Form horizontal style={formStyle}>
              <FormGroup>
                <Col sm={12} className="text-left">
                  <div className="inline">
                    <DatePicker
                      className="form-control inline"
                      dateFormat={dateFormat}
                      selected={startDate}
                      onChange={this.onChangeDateFrom}
                      isClearable={true}
                      placeholderText="Select Start Date..."
                    />
                  <Button onClick={this.toggleStartConfirm} style={btnStyle} disabled={disableFromSubmit}>
                      OK
                    </Button>
                    <ConfirmModal onOk={this.onClickStartMoveOk} onCancel={this.onClickCloseConfirm} show={showStartConfirm} message={startConfirmMessage} labelOk="Yes" />
                  </div>
                </Col>
              </FormGroup>
            </Form>
          </Tab>
          <Tab title="Move End Date" eventKey={2}>
            <Form horizontal style={formStyle}>
              <FormGroup>
                <Col sm={12} className="text-right">
                  <div className="inline">
                    <DatePicker
                      className="form-control inline"
                      dateFormat={dateFormat}
                      selected={endDate}
                      onChange={this.onChangeDateTo}
                      isClearable={true}
                      placeholderText="Select End Date..."
                    />
                    <Button onClick={this.toggleEndConfirm} style={btnStyle} disabled={disableToSubmit}>
                      OK
                    </Button>
                    <ConfirmModal onOk={this.onClickEndMoveOk} onCancel={this.onClickCloseConfirm} show={showEndConfirm} message={endConfirmMessage} labelOk="Yes" />
                  </div>
                </Col>
              </FormGroup>
            </Form>
          </Tab>

        </Tabs>

      </ModalWrapper>
    );
  }
}

export default connect()(CloseActionBox);
