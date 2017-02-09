import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import Immutable from 'immutable';
import { Col, Row, Panel } from 'react-bootstrap';
/* COMPONENTS */
import Pager from '../Pager';
import Filter from '../Filter';
import List from '../List';
/* ACTIONS */
import { getList, clearList } from '../../actions/listActions';


class InvoicesList extends Component {

  static propTypes = {
    items: PropTypes.instanceOf(Immutable.List),
    collection: PropTypes.string,
    baseFilter: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
  }

  static defaultProps = {
    items: Immutable.List(),
    baseFilter: {},
    collection: 'bill',
  }

  state = {
    page: 0,
    size: 10,
    sort: Immutable.Map({ invoice_id: -1 }),
    filter: {},
  };

  componentWillUnmount() {
    this.props.dispatch(clearList('invoices'));
  }

  buildQuery = () => {
    const { collection } = this.props;
    const { page, size, filter, sort } = this.state;
    return {
      api: collection,
      params: [
        { action: 'query_bills_invoices' },
        { size },
        { page },
        { sort: JSON.stringify(sort) },
        { query: JSON.stringify(filter) },
      ],
    };
  }

  onFilter = (filter) => {
    this.setState({ filter, page: 0 }, this.fetchItems);
  }

  handlePageClick = (page) => {
    this.setState({ page }, this.fetchItems);
  }

  onSort = (newSort) => {
    const sort = Immutable.Map(newSort);
    this.setState({ sort }, this.fetchItems);
  }

  fetchItems = () => {
    this.props.dispatch(getList('invoices', this.buildQuery()));
  }

  downloadURL = (aid, billrunKey, invoiceId) =>
    `${globalSetting.serverUrl}/api/accountinvoices?action=download&aid=${aid}&billrun_key=${billrunKey}&iid=${invoiceId}`

  renderMainPanelTitle = () => (
    <div>
      <span>
        List of all invoices
      </span>
    </div>
  );

  parserPaidBy = (ent) => {
    if (ent.get('paid_by')) {
      return (<span style={{ color: '#3c763d' }}>Paid</span>);
    }
    if (moment(ent.get('due_date')).isAfter(moment())) {
      return (<span style={{ color: '#8a6d3b' }}>Due</span>);
    }
    return (<span style={{ color: '#a94442' }}>Not Paid</span>);
  }

  parserDownload = (ent) => {
    const downloadUrl = this.downloadURL(ent.get('aid'), ent.get('billrun_key'), ent.get('invoice_id'));
    return (
      <form method="post" action={downloadUrl} target="_blank">
        <input type="hidden" name="a" value="a" />
        <button className="btn btn-link" type="submit">
          <i className="fa fa-download" /> Download
        </button>
      </form>
    );
  };

  getTableFields = () => ([
    { id: 'invoice_id', title: 'Invoice Id', sort: true },
    { id: 'invoice_date', title: 'Date', cssClass: 'short-date', sort: true, type: 'date' },
    { id: 'due_date', title: 'Due', cssClass: 'short-date', sort: true, type: 'date' },
    { id: 'amount', title: 'Amount', sort: true },
    { id: 'paid_by', title: 'Status', parser: this.parserPaidBy },
    { id: 'billrun_key', title: 'Cycle', sort: true },
    { id: 'aid', title: 'Customer ID', sort: true },
    { id: 'payer_name', title: 'Name', sort: true },
    { title: 'Download', parser: this.parserDownload },
  ]);

  getFilterFields = () => {
    const { baseFilter } = this.props;
    return ([
      { id: 'aid', placeholder: 'Customer ID', type: 'number', showFilter: !Object.prototype.hasOwnProperty.call(baseFilter, 'aid') },
      { id: 'payer_name', placeholder: 'Name', showFilter: !Object.prototype.hasOwnProperty.call(baseFilter, 'payer_name') },
      { id: 'invoice_id', placeholder: 'Invoice Id', type: 'number', showFilter: !Object.prototype.hasOwnProperty.call(baseFilter, 'invoice_id') },
    ]);
  }

  render() {
    const { items, baseFilter } = this.props;
    const { sort } = this.state;
    const tableFieds = this.getTableFields();
    const filterFields = this.getFilterFields();
    return (
      <div className="InvoicesList">
        <Row>
          <Col lg={12}>
            <Panel header={this.renderMainPanelTitle()}>
              <Filter fields={filterFields} onFilter={this.onFilter} base={baseFilter} />
              <List items={items} fields={tableFieds} onSort={this.onSort} sort={sort} className="invoices-list" />
            </Panel>
          </Col>
        </Row>
        <Pager onClick={this.handlePageClick} size={this.state.size} count={items.size} />
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  baseFilter: props.location.query.base ? JSON.parse(props.location.query.base) : {},
  items: state.list.get('invoices'),
});

export default connect(mapStateToProps)(InvoicesList);
