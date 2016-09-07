import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import Immutable from 'immutable';

/* COMPONENTS */
import Pager from '../Pager';
import Filter from '../Filter';

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
  
  printEntityField(entity = Immutable.Map(), field) {
    if (!Immutable.Iterable.isIterable(entity))
      return this.printEntityField(Immutable.fromJS(entity), field);
    if (field.parser)
      return field.parser(entity);
    return entity.get(field.id);
  }
  
  buildRow(entity, fields) {
    return fields.map((field, key) => (
      <td key={key}>
        { this.printEntityField(entity, field) }
      </td>
    ));
  }
  
  render() {
    const { invoices } = this.props;
    const paid_by_parser = (ent) => {
      if (ent.get('paid_by'))
        return (<span style={{color: "green"}}>Paid</span>);
      else if (moment(ent.get('due_date')).isAfter(moment()))
        return (<span style={{color: "#8a6d3b"}}>Due</span>);
      return (<span style={{color: "red"}}>Not Paid</span>);      
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
      { id: "invoice_id", placeholder: "Invoice ID", type: 'number' },
      { id: "aid", placeholder: "Customer ID", type: 'number' }
    ];

    const table_header = fields.map((field, key) => (
      <th key={key}>{ field.title }</th>
    ));

    const table_body = invoices.size < 1 ?
                       (<tr><td colSpan={fields.length} style={{textAlign: "center"}}>No invoices</td></tr>) :
                       invoices.map((invoice, index) => (
                         <tr key={index}>
                           { this.buildRow(invoice, fields) }
                         </tr>
                       ));
    
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
                <div className="row">
                  <div className="col-lg-9">
                    <Filter fields={filter_fields} onFilter={this.onFilter} base={{}} />                    
                  </div>
                </div>
                <div className="table-responsive">
                  <table className="table table-hover table-striped">
                    <thead>
                      <tr>{ table_header }</tr>
                    </thead>
                    <tbody>
                      { table_body }
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-6">
            <div className="dataTables_info" role="status" aria-live="polite">Showing 1 to 10</div>
          </div>
          <div className="col-lg-6 dataTables_pagination">
            <Pager onClick={this.handlePageClick}
                   size={this.state.size}
                   count={invoices.size || 0} />  
          </div>
        </div>

      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return { invoices: state.list.get('invoices') || [] };
}

export default connect(mapStateToProps)(InvoicesList);
