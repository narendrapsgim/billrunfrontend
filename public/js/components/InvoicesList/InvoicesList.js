import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

/* COMPONENTS */
import Pager from '../Pager';
import Filter from '../Filter';
import List from '../List';

/* ACTIONS */
import { getList, clearList } from '../../actions/listActions';

class InvoicesList extends Component {
  constructor(props) {
    super(props);

    this.handlePageClick = this.handlePageClick.bind(this);
    this.onFilter = this.onFilter.bind(this);
    this.buildQuery = this.buildQuery.bind(this);

    this.state = {
      page: 0,
      size: 10,
      filter: ""
    };
  }

  componentWillUnmount() {
    this.props.dispatch(clearList('invoices'));
  }
  
  buildQuery() {
    const { page, size, filter } = this.state;
    return {
      api: "bill",
      params: [
        { action: "query_bills_invoices" },
        { size },
        { page },
        { query: filter }
      ]
    };
  }

  onFilter(filter) {
    this.setState({filter}, () => {
      this.props.dispatch(getList('invoices', this.buildQuery()))
    });
  }
  
  handlePageClick(page) {
    this.setState({page}, () => {
      this.props.dispatch(getList('invoices', this.buildQuery()))
    });
  }

  downloadURL(aid, billrun_key, invoice_id) {
    return `${globalSetting.serverUrl}/api/accountinvoices?action=download&aid=${aid}&billrun_key=${billrun_key}&iid=${invoice_id}`;
  }
  
  render() {
    const { invoices } = this.props;
    const paid_by_parser = (ent) => {
      if (ent.get('paid_by'))
        return (<span style={{color: "#3c763d"}}>Paid</span>);
      else if (moment(ent.get('due_date')).isAfter(moment()))
        return (<span style={{color: "#8a6d3b"}}>Due</span>);
      return (<span style={{color: "#a94442"}}>Not Paid</span>);      
    };
    const download_parser = (ent) => {
      const download_url = this.downloadURL(ent.get('aid'), ent.get('billrun_key'), ent.get('invoice_id'));
      return (
        <form method="post" action={download_url}>
          <input type="hidden" name="a" value="a"></input>
          <button className="btn btn-outline btn-default" type="submit">
            <i className="fa fa-download"></i>
          </button>
        </form>
      );
    };
    const fields = [
      { id: "invoice_id", title: "Invoice ID" },
      { id: "invoice_date", title: "Date" },
      { id: "due_date", title: "Due" },
      { id: "amount", title: "Amount" },
      { id: "paid_by", title: "Status", parser: paid_by_parser },
      { id: "aid", title: "Customer ID" },
      { title: "Download", parser: download_parser }
    ];
    const filter_fields = [
      { id: "aid", placeholder: "Customer ID", type: 'number' }
    ];

    const base = this.props.location.query.base ? JSON.parse(this.props.location.query.base) : {};

    return (
      <div>

        <div className="row">
          <div className="col-lg-12">
            <div className="panel panel-default">
              <div className="panel-heading">
                <span>
                  List of all invoices
                </span>
              </div>
              <div className="panel-body">
                <Filter fields={filter_fields} onFilter={this.onFilter} base={base} />
                <List items={invoices} fields={fields} />
              </div>
            </div>
          </div>
        </div>

        <Pager onClick={this.handlePageClick}
               size={this.state.size}
               count={invoices.size || 0} />  

      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return { invoices: state.list.get('invoices') || [] };
}

export default connect(mapStateToProps)(InvoicesList);
