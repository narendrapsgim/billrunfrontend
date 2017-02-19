import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Immutable from 'immutable';
import changeCase from 'change-case';
import { Col, Row, Panel, Button } from 'react-bootstrap';
import List from '../List';
import LoadingItemPlaceholder from '../Elements/LoadingItemPlaceholder';
import Pager from './Pager';
import Filter from './Filter';
import { getList, clearList, setListSort, setListFilter, setListPage, setListSize, clearItem } from '../../actions/entityListActions';

class EntityList extends Component {

  static propTypes = {
    itemType: PropTypes.string.isRequired,
    itemsType: PropTypes.string.isRequired,
    collection: PropTypes.string.isRequired,
    api: PropTypes.string,
    items: PropTypes.oneOfType([
      PropTypes.instanceOf(Immutable.List),
      null,
    ]),
    tableFields: PropTypes.array,
    filterFields: PropTypes.array,
    baseFilter: PropTypes.object,
    projectFields: PropTypes.object,
    page: PropTypes.number,
    nextPage: PropTypes.bool,
    editable: PropTypes.bool,
    size: PropTypes.number,
    inProgress: PropTypes.bool,
    forceRefetchItems: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.number,
    ]),
    filter: PropTypes.instanceOf(Immutable.Map),
    sort: PropTypes.instanceOf(Immutable.Map),
    router: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    dispatch: PropTypes.func.isRequired,
  }

  static defaultProps = {
    items: null,
    api: 'uniqueget',
    page: 0,
    size: 5,
    nextPage: false,
    editable: true,
    inProgress: false,
    forceRefetchItems: false,
    baseFilter: {},
    tableFields: [],
    filterFields: [],
    projectFields: {},
    sort: Immutable.Map(),
    filter: Immutable.Map(),
  }

  componentWillMount() {
    const { forceRefetchItems, items } = this.props;
    if (forceRefetchItems || items == null || items.isEmpty()) {
      this.fetchItems(this.props);
    }
  }

  // shouldComponentUpdate(nextProps, nextState) { // eslint-disable-line no-unused-vars
  //   return !nextProps.inProgress;
  //   // return (
  //   //   this.props.page !== nextProps.page
  //   //   || this.props.nextPage !== nextProps.nextPage
  //   //   || this.props.size !== nextProps.size
  //   //   || !Immutable.is(this.props.filter, nextProps.filter)
  //   //   || !Immutable.is(this.props.sort, nextProps.sort)
  //   //   || !Immutable.is(this.props.items, nextProps.items)
  //   // );
  // }

  componentWillUpdate(nextProps, nextState) { // eslint-disable-line no-unused-vars
    const pageChanged = this.props.page !== nextProps.page;
    const sizeChanged = this.props.size !== nextProps.size;
    const filterChanged = !Immutable.is(this.props.filter, nextProps.filter);
    const sortChanged = !Immutable.is(this.props.sort, nextProps.sort);
    if (pageChanged || sizeChanged || filterChanged || sortChanged) {
      this.fetchItems(nextProps);
    }
  }

  componentWillUnmount() {
    // const { itemsType } = this.props;
    // TODO: decide what to do after leaving list page
    // clear all list props - Items, sort, filter, page
    // this.props.dispatch(clearList(itemsType));
    // OR clear only items, and refetch them on back to list with same props
    // this.props.dispatch(clearItem(itemsType));
  }

  onClickNew = () => {
    const { itemsType, itemType } = this.props;
    this.props.router.push(`${itemsType}/${itemType}`);
  }

  onSort = (sort) => {
    const { itemsType } = this.props;
    this.props.dispatch(setListPage(itemsType, 0));
    this.props.dispatch(setListSort(itemsType, sort));
  }

  onFilter = (filter) => {
    const { itemsType } = this.props;
    this.props.dispatch(setListPage(itemsType, 0));
    this.props.dispatch(setListFilter(itemsType, filter));
  }

  onPageChange = (page) => {
    const { itemsType } = this.props;
    this.props.dispatch(setListPage(itemsType, page));
  }

  onSizeChange = (size) => {
    const { itemsType } = this.props;
    this.props.dispatch(setListPage(itemsType, 0));
    this.props.dispatch(setListSize(itemsType, size));
  }

  onClickItem = (item) => {
    const { itemsType, itemType } = this.props;
    const itemId = item.getIn(['_id', '$id']);
    this.props.router.push(`${itemsType}/${itemType}/${itemId}`);
  }

  buildQuery = ({ collection, page, size, sort, filter, baseFilter, projectFields, api }) => ({
    action: api,
    entity: collection,
    params: [
      { sort: JSON.stringify(sort) },
      { query: JSON.stringify({ ...filter.toObject(), ...baseFilter }) },
      { project: JSON.stringify(projectFields) },
      { page },
      { size },
    ],
  });

  fetchItems = (props) => {
    const { itemsType } = props;
    this.props.dispatch(getList(itemsType, this.buildQuery(props)));
  }

  renderPanelHeader = () => {
    const { itemsType } = this.props;
    return (
      <div>
        List of all available {changeCase.noCase(itemsType)}
        <div className="pull-right">
          <Button bsSize="xsmall" className="btn-primary" onClick={this.onClickNew}>
            <i className="fa fa-plus" />&nbsp;Add New
          </Button>
        </div>
      </div>
    );
  }

  renderFilter = () => {
    const { filter, filterFields } = this.props;
    return (
      <Filter
        filter={filter}
        fields={filterFields}
        onFilter={this.onFilter}
      />
    );
  }

  renderPager = () => {
    const { items, size, page, nextPage } = this.props;
    return (
      <Pager
        page={page}
        size={size}
        count={items.size}
        nextPage={nextPage}
        onChangePage={this.onPageChange}
        onChangeSize={this.onSizeChange}
      />
    );
  }

  renderList = () => {
    const { items, sort, tableFields, editable } = this.props;
    return (
      <List
        sort={sort}
        items={items}
        fields={tableFields}
        edit={editable}
        onSort={this.onSort}
        onClickEdit={this.onClickItem}
      />
    );
  }

  render() {
    const { items, inProgress } = this.props;
    if (items === null || inProgress) {
      return (<LoadingItemPlaceholder />);
    }
    return (
      <Row>
        <Col lg={12}>
          <Panel header={this.renderPanelHeader()}>
            { this.renderFilter() }
            { this.renderList() }
          </Panel>
          { this.renderPager() }
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = (state, props) => ({
  collection: props.collection || props.itemsType,
  items: state.entityList.items.get(props.itemsType),
  page: state.entityList.page.get(props.itemsType),
  nextPage: state.entityList.nextPage.get(props.itemsType),
  sort: state.entityList.sort.get(props.itemsType),
  filter: state.entityList.filter.get(props.itemsType),
  size: state.entityList.size.get(props.itemsType),
  inProgress: state.progressIndicator > 0,
});
export default withRouter(connect(mapStateToProps)(EntityList));