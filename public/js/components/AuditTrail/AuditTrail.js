import React, { Component } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import List from '../List';
import Pager from '../Pager';
/* ACTIONS */
import { getList, clearList } from '../../actions/listActions';

class AuditTrail extends Component {

  static defaultProps = {
    items: Immutable.List(),
  }

  static propTypes = {
    items: React.PropTypes.instanceOf(Immutable.List),
    getList: React.PropTypes.func.isRequired,
    clearList: React.PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.itemsType = 'log';
    this.baseFilter = { source: 'audit' };
    this.state = {
      tableFields: [
        { id: 'urt', title: 'Date', type: 'datetime', cssClass: 'long-date', sort: true },
        { title: 'User', parser: this.userParser, sort: true, id: 'user.name' },
        { id: 'collection', title: 'Entity Type', sort: true },
        { id: 'key', title: 'Entity Key', sort: true },
        { title: 'Details', parser: this.detailsParser },
      ],
      fields: { user: 1, collection: 1, key: 1, new_oid: 1, old_oid: 1, urt: 1 },
      page: 0,
      size: 10,
      sort: '',
      filter: {},
    };
  }

  componentDidMount() {
    this.fetchItems();
  }

  componentWillUnmount() {
    this.props.clearList(this.itemsType);
  }

  onSort = (sort) => {
    this.setState({ sort }, this.fetchItems);
  }

  fetchItems = () => {
    this.props.getList(this.itemsType, this.buildQuery());
  }

  handlePageClick = (page) => {
    this.setState({ page }, this.fetchItems);
  }

  buildQuery = () => {
    const query = Object.assign({}, this.state.filter, this.baseFilter);
    return {
      api: 'find',
      params: [
        { collection: this.itemsType },
        { project: JSON.stringify(this.state.fields) },
        { size: this.state.size },
        { page: this.state.page },
        { sort: this.state.sort },
        { query: JSON.stringify(query) },
      ],
    };
  }

  userParser = item => item.getIn(['user', 'name'], '');

  detailsParser = (item) => {
    const details = item.get('details', '');
    const newid = item.getIn(['new_oid', '$id'], '');
    const oldid = item.getIn(['old_oid', '$id'], '');
    const message = `${details} from: ${oldid} to: ${newid}`;
    return (<p>{message}</p>);
  }

  render() {
    const { items } = this.props;
    const { tableFields } = this.state;

    return (
      <div className="AuditTrail">
        <div className="row">
          <div className="col-lg-12">
            <div className="panel panel-default">
              <div className="panel-heading">
                List of all actions
              </div>
              <div className="panel-body">
                <List items={items} fields={tableFields} edit={false} onSort={this.onSort} />
              </div>
            </div>
          </div>
        </div>
        <Pager onClick={this.handlePageClick} size={this.state.size} count={items.size} />
      </div>
    );
  }
}

const mapDispatchToProps = {
  clearList,
  getList,
};

const mapStateToProps = state => ({
  items: state.list.get('log'),
});

export default connect(mapStateToProps, mapDispatchToProps)(AuditTrail);
