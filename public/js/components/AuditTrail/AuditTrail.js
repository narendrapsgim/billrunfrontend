import React, { Component } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import moment from 'moment';
import changeCase from 'change-case';
import { Col, Row, Panel } from 'react-bootstrap';
import List from '../List';
import Pager from '../Pager';
import { AdvancedFilter } from '../Filter';
import DiffModal from '../Elements/DiffModal';
import DetailsParser from './DetailsParser';
import { userNamesQuery, auditTrailEntityTypesQuery } from '../../common/ApiQueries';
/* ACTIONS */
import { getList, clearList } from '../../actions/listActions';

class AuditTrail extends Component {

  static defaultProps = {
    items: Immutable.List(),
    diffItems: Immutable.List(),
    userNames: Immutable.List(),
    auditTrailEntityTypes: Immutable.List(),
    showDiff: false,
  }

  static propTypes = {
    items: React.PropTypes.instanceOf(Immutable.List),
    diffItems: React.PropTypes.instanceOf(Immutable.List),
    userNames: React.PropTypes.instanceOf(Immutable.List),
    auditTrailEntityTypes: React.PropTypes.instanceOf(Immutable.List),
    getList: React.PropTypes.func.isRequired,
    clearList: React.PropTypes.func.isRequired,
    showDiff: React.PropTypes.bool,
  }

  constructor(props) {
    super(props);
    this.itemsType = 'log';
    this.state = {
      tableFields: [
        { id: 'urt', title: 'Date', type: 'datetime', cssClass: 'long-date', sort: true },
        { id: 'user.name', title: 'User', parser: this.userParser, sort: true },
        { id: 'collection', title: 'Module Type', parser: this.collectionParser, sort: true },
        { id: 'key', title: 'Module Key', sort: true },
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
    this.fetchUser();
    this.fetchEnityTypes();
  }

  componentWillUnmount() {
    this.props.clearList(this.itemsType);
    this.props.clearList('diff');
    this.props.clearList('autocompleteUser');
    this.props.clearList('autocompleteAuditTrailEntityTypes');
  }

  onSort = (sort) => {
    this.setState({ sort }, this.fetchItems);
  }

  onFilter = (filter) => {
    this.setState({ filter, page: 0 }, this.fetchItems);
  }

  fetchItems = () => {
    this.props.getList(this.itemsType, this.buildQuery());
  }

  fetchUser = () => {
    const query = userNamesQuery();
    this.props.getList('autocompleteUser', query);
  }

  fetchEnityTypes = () => {
    const query = auditTrailEntityTypesQuery();
    this.props.getList('autocompleteAuditTrailEntityTypes', query);
  }

  handlePageClick = (page) => {
    this.setState({ page }, this.fetchItems);
  }

  buildQuery = () => {
    const query = Object.assign({}, this.state.filter);
    query.source = 'audit';
    if (query.urt) {
      query.urt = this.urtQueryBuilder(query.urt);
    }
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

  collectionParser = item => changeCase.sentenceCase(item.get('collection', ''));

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
    return (<DiffModal onClose={this.closeDiff} inputA={inputA} inputB={inputB} />);
  }

  urtQueryBuilder = (date) => {
    const fromDate = moment(date).startOf('day');
    const toDate = moment(date).add(1, 'days');
    return ({ $gte: fromDate, $lt: toDate });
  };

  render() {
    const { items, showDiff, userNames, auditTrailEntityTypes } = this.props;
    const { tableFields } = this.state;

    const filterFields = [
        { id: 'urt', title: 'Date', type: 'date' },
        { id: 'user.name', title: 'User', type: 'select', options: userNames },
        { id: 'collection', title: 'Entity Type', type: 'select', options: auditTrailEntityTypes },
        { id: 'key', title: 'Entity Key' },
    ];

    return (
      <div className="AuditTrail">
        <Row>
          <Col lg={12}>
            <Panel header={<AdvancedFilter fields={filterFields} onFilter={this.onFilter} />}>
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
  const userNames = state.list.get('autocompleteUser', Immutable.List())
    .map(user => user.get('username'));
  const auditTrailEntityTypes = state.list
    .get('autocompleteAuditTrailEntityTypes', Immutable.List())
    .map(type => ({
      key: type.get('name', ''),
      val: changeCase.sentenceCase(type.get('name', ''))
    }));

  return { items, diffItems, showDiff, userNames, auditTrailEntityTypes };
};

export default connect(mapStateToProps, mapDispatchToProps)(AuditTrail);
