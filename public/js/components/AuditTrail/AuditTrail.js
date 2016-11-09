import React, { Component } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { Col, Row, Panel, Button } from 'react-bootstrap';
import List from '../List';
import Pager from '../Pager';
import DiffModal from '../Elements/DiffModal';
import DetailsParser from './DetailsParser';
/* ACTIONS */
import { getList, clearList } from '../../actions/listActions';

class AuditTrail extends Component {

  static defaultProps = {
    items: Immutable.List(),
    diffItems: Immutable.List(),
    showDiff: false,
  }

  static propTypes = {
    items: React.PropTypes.instanceOf(Immutable.List),
    diffItems: React.PropTypes.instanceOf(Immutable.List),
    getList: React.PropTypes.func.isRequired,
    clearList: React.PropTypes.func.isRequired,
    showDiff: React.PropTypes.bool,
  }

  constructor(props) {
    super(props);
    this.itemsType = 'log';
    this.state = {
      baseFilter: { source: 'audit' },
      filterFields: [
          { id: 'urt', title: 'Date', type: 'datetime' },
          { id: 'user.name', title: 'User' },
          { id: 'collection', title: 'Entity Type' },
          { id: 'key', title: 'Entity Key' },
      ],
      tableFields: [
        { id: 'urt', title: 'Date', type: 'datetime', cssClass: 'long-date', sort: true },
        { title: 'User', parser: this.userParser, sort: true, id: 'user.name' },
        { id: 'collection', title: 'Entity Type', sort: true },
        { id: 'key', title: 'Entity Key', sort: true },
        { title: 'Details', parser: this.detailsParser },
      ],
      fields: { user: 1, collection: 1, key: 1, new_oid: 1, old_oid: 1, urt: 1, details: 1 },
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
    this.props.clearList('diff');
  }

  onSort = (sort) => {
    this.setState({ sort }, this.fetchItems);
  }

  onFilter = (filter) => {
    // this.setState({ filter, page: 0 }, this.fetchItems);
  }

  fetchItems = () => {
    this.props.getList(this.itemsType, this.buildQuery());
  }

  handlePageClick = (page) => {
    this.setState({ page }, this.fetchItems);
  }

  buildQuery = () => {
    const query = Object.assign({}, this.state.filter, this.state.baseFilter);
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

  detailsParser = item => <DetailsParser item={item} openDiff={this.openDiff} />

  openDiff = ({ collection, oldid, newid }) => {
    const query = JSON.stringify({ $or: [{ _id: oldid }, { _id: newid }] });
    const queries = {
      api: 'find',
      params: [{ collection }, { query }],
    };
    this.props.getList('diff', queries);
  }

  closeDiff = () => {
    this.props.clearList('diff');
  }

  renderDiff = () => {
    const { diffItems } = this.props;
    const inputA = diffItems.get(0, Immutable.Map()).toJS();
    const inputB = diffItems.get(1, Immutable.Map()).toJS();
    return (<DiffModal onClose={this.closeDiff} inputA={inputA} inputB={inputB} show={true} />);
  }

  render() {
    const { items, showDiff } = this.props;
    const { tableFields, filterFields, baseFilter } = this.state;

    return (
      <div className="AuditTrail">
        <Row>
          <Col lg={12}>
            <Panel >
              <List items={items} fields={tableFields} edit={false} onSort={this.onSort} />
            </Panel>
          </Col>
        </Row>
        <Pager onClick={this.handlePageClick} size={this.state.size} count={items.size} />
        { showDiff && this.renderDiff() }
      </div>
    );
  }
}

const mapDispatchToProps = {
  clearList,
  getList,
};

const mapStateToProps = (state) => {
  const items = state.list.get('log');
  const diffItems = state.list.get('diff');
  const showDiff = (typeof diffItems !== 'undefined') ? diffItems.size === 2 : false;
  return { items, diffItems, showDiff };
};

export default connect(mapStateToProps, mapDispatchToProps)(AuditTrail);
