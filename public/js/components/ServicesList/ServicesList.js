import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';
import Immutable from 'immutable';
import moment from 'moment';
import { Button } from 'react-bootstrap';
import List from '../List';
import Pager from '../Pager';
import Filter from '../Filter';
/* ACTIONS */
import { getList, clearList } from '../../actions/listActions';


class ServicesList extends Component {

  static defaultProps = {
    items: Immutable.List(),
  }

  static propTypes = {
    items: React.PropTypes.instanceOf(Immutable.List),
    router: React.PropTypes.shape({
      push: React.PropTypes.func.isRequired,
    }).isRequired,
    getList: React.PropTypes.func.isRequired,
    clearList: React.PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.itemsType = 'services';
    this.itemType = 'service';
    this.state = {
      fields: { name: 1, price: 1, description: 1, from: 1, to: 1 },
      page: 0,
      size: 10,
      sort: '',
      filter: {},
    };
  }

  componentWillUnmount() {
    this.props.clearList(this.itemsType);
  }

  buildQuery = () => ({
    api: 'find',
    params: [
      { collection: this.itemsType },
      { project: JSON.stringify(this.state.fields) },
      { size: this.state.size },
      { page: this.state.page },
      { sort: this.state.sort },
      { query: this.state.filter },
    ],
  });

  onClickItem = (item) => {
    const itemId = item.getIn(['_id', '$id']);
    this.props.router.push(`/${this.itemType}/${itemId}`);
  }

  handlePageClick = (page) => {
    this.setState(
      { page },
      this.fetchItems
    );
  }

  onClickNew = () => {
    this.props.router.push(`/${this.itemType}`);
  }

  onFilter = (filter) => {
    this.setState(
      { filter, page: 0 },
      this.fetchItems
    );
  }

  onSort = (sort) => {
    this.setState(
      { sort },
      this.fetchItems
    );
  }

  fetchItems = () => {
    this.props.getList(this.itemsType, this.buildQuery());
  }

  render() {
    const { items } = this.props;
    const baseFilter = { to: { $gt: moment().toISOString() } };
    const fields = [
      { id: 'name', placeholder: 'Name' },
      { id: 'to', showFilter: false, type: 'datetime' }
    ];
    const tableFields = [
      { id: 'name', title: 'Name', sort: true },
      { id: 'price', title: 'Price', sort: true },
      { id: 'description', title: 'Description', sort: true },
      { id: 'from', title: 'From', type: 'datetime', cssClass: 'long-date', sort: true },
      { id: 'to', title: 'To', type: 'datetime', cssClass: 'long-date', sort: true },
    ];

    return (
      <div>
        <div className="row">
          <div className="col-lg-12">
            <div className="panel panel-default">
              <div className="panel-heading">
                List of all available services
                <div className="pull-right">
                  <Button bsSize="xsmall" className="btn-primary" onClick={this.onClickNew}><i className="fa fa-plus" />&nbsp;Add New</Button>
                </div>
              </div>
              <div className="panel-body">
                <Filter fields={fields} onFilter={this.onFilter} base={baseFilter} />
                <List items={items} fields={tableFields} editField="name" edit={true} onClickEdit={this.onClickItem} onSort={this.onSort} />
              </div>
            </div>
          </div>
        </div>

        <Pager onClick={this.handlePageClick} size={this.state.size} count={items.size || 0} />
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({
  clearList,
  getList,
}, dispatch);

const mapStateToProps = state => ({
  items: state.list.get('services'),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ServicesList));
