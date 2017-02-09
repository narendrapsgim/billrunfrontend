import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import moment from 'moment';
import changeCase from 'change-case';
import { Col, Row, Panel } from 'react-bootstrap';
import List from '../List';
import Pager from '../Pager';
import { AdvancedFilter } from '../Filter';
import DetailsParser from './DetailsParser';
import { userNamesQuery, auditTrailEntityTypesQuery } from '../../common/ApiQueries';
/* ACTIONS */
import { getList, clearList } from '../../actions/listActions';

class AuditTrail extends Component {

  static propTypes = {
    items: PropTypes.instanceOf(Immutable.List),
    userNames: PropTypes.instanceOf(Immutable.List),
    auditTrailEntityTypes: PropTypes.instanceOf(Immutable.List),
    collection: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
  }

  static defaultProps = {
    items: Immutable.List(),
    userNames: Immutable.List(),
    auditTrailEntityTypes: Immutable.List(),
    collection: 'log',
  }

  state = {
    fields: {},
    page: 0,
    size: 10,
    sort: Immutable.Map({ urt: -1 }),
    filter: {},
  };


  componentDidMount() {
    this.fetchItems();
    this.fetchUser();
    this.fetchEnityTypes();
  }

  componentWillUnmount() {
    const { collection } = this.props;
    this.props.dispatch(clearList(collection));
    this.props.dispatch(clearList('autocompleteUser'));
    this.props.dispatch(clearList('autocompleteAuditTrailEntityTypes'));
  }

  onSort = (newSort) => {
    const sort = Immutable.Map(newSort);
    this.setState({ sort }, this.fetchItems);
  }

  onFilter = (filter) => {
    this.setState({ filter, page: 0 }, this.fetchItems);
  }

  fetchItems = () => {
    const { collection } = this.props;
    this.props.dispatch(getList(collection, this.buildQuery()));
  }

  fetchUser = () => {
    const query = userNamesQuery();
    this.props.dispatch(getList('autocompleteUser', query));
  }

  fetchEnityTypes = () => {
    const query = auditTrailEntityTypesQuery();
    this.props.dispatch(getList('autocompleteAuditTrailEntityTypes', query));
  }

  handlePageClick = (page) => {
    this.setState({ page }, this.fetchItems);
  }

  buildQuery = () => {
    const { collection } = this.props;
    const { fields, size, page, sort, filter } = this.state;
    const query = Object.assign({}, filter);
    query.source = 'audit';
    if (query.urt) {
      query.urt = this.urtQueryBuilder(query.urt);
    }
    return {
      api: 'find',
      params: [
        { collection },
        { size },
        { page },
        { project: JSON.stringify(fields) },
        { sort: JSON.stringify(sort) },
        { query: JSON.stringify(query) },
      ],
    };
  }

  userParser = item => item.getIn(['user', 'name'], '');

  collectionParser = item => changeCase.sentenceCase(item.get('collection', ''));

  detailsParser = item => <DetailsParser item={item} />

  urtQueryBuilder = (date) => {
    const fromDate = moment(date).startOf('day');
    const toDate = moment(date).add(1, 'days');
    return ({ $gte: fromDate, $lt: toDate });
  };

  getFilterFields = () => {
    const { userNames, auditTrailEntityTypes } = this.props;
    return ([
      { id: 'urt', title: 'Date', type: 'date' },
      { id: 'user.name', title: 'User', type: 'select', options: userNames },
      { id: 'collection', title: 'Entity Type', type: 'select', options: auditTrailEntityTypes },
      { id: 'key', title: 'Entity Key' },
    ]);
  }

  getTableFields = () => ([
    { id: 'urt', title: 'Date', type: 'datetime', cssClass: 'long-date', sort: true },
    { id: 'user.name', title: 'User', parser: this.userParser, sort: true },
    { id: 'collection', title: 'Module Type', parser: this.collectionParser, sort: true },
    { id: 'key', title: 'Module Key', sort: true },
    { title: 'Details', parser: this.detailsParser },
  ]);

  render() {
    const { items } = this.props;
    const { sort } = this.state;
    const filterFields = this.getFilterFields();
    const tableFields = this.getTableFields();
    return (
      <div className="Audit-Trail">
        <Row>
          <Col lg={12}>
            <Panel header={<AdvancedFilter fields={filterFields} onFilter={this.onFilter} />}>
              <List
                items={items}
                fields={tableFields}
                edit={false}
                sort={sort}
                onSort={this.onSort}
              />
            </Panel>
          </Col>
        </Row>
        <Pager onClick={this.handlePageClick} size={this.state.size} count={items.size} />
      </div>
    );
  }
}

// TODO: use reselect
const mapStateToProps = (state) => {
  const items = state.list.get('log');
  const userNames = state.list.get('autocompleteUser', Immutable.List())
    .map(user => user.get('username'));
  const auditTrailEntityTypes = state.list
    .get('autocompleteAuditTrailEntityTypes', Immutable.List())
    .map(type => ({
      key: type.get('name', ''),
      val: changeCase.sentenceCase(type.get('name', '')),
    }));

  return { items, userNames, auditTrailEntityTypes };
};

export default connect(mapStateToProps)(AuditTrail);
