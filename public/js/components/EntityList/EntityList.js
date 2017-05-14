import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Immutable from 'immutable';
import changeCase from 'change-case';
import { Col, Row, Panel, Button } from 'react-bootstrap';
import List from '../List';
import { LoadingItemPlaceholder } from '../Elements';
import Pager from './Pager';
import State from './State';
import Filter from './Filter';
import StateDetails from './StateDetails';
import Actions from '../Elements/Actions';
import {
  getList,
  clearList,
  setListSort,
  setListFilter,
  setListPage,
  setListSize,
  setListState,
  clearItem,
} from '../../actions/entityListActions';
import { getConfig } from '../../common/Util';


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
    showRevisionBy: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.string,
    ]),
    size: PropTypes.number,
    inProgress: PropTypes.bool,
    forceRefetchItems: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.number,
    ]),
    filter: PropTypes.instanceOf(Immutable.Map),
    sort: PropTypes.instanceOf(Immutable.Map),
    state: PropTypes.instanceOf(Immutable.List),
    router: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    dispatch: PropTypes.func.isRequired,
    listActions: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.arrayOf(PropTypes.object),
    ]),
    refreshString: PropTypes.string,
    actions: PropTypes.arrayOf(PropTypes.object),
  }

  static defaultProps = {
    items: null,
    api: 'uniqueget',
    page: 0,
    size: getConfig(['list', 'defaultItems'], 10),
    nextPage: false,
    editable: true,
    showRevisionBy: false,
    inProgress: false,
    forceRefetchItems: false,
    baseFilter: {},
    tableFields: [],
    filterFields: [],
    projectFields: {},
    sort: Immutable.Map(),
    filter: Immutable.Map(),
    state: Immutable.List([0, 1, 2]),
    refreshString: '',
    actions: [],
  }

  componentWillMount() {
    const { forceRefetchItems, items } = this.props;
    if (forceRefetchItems || items == null || items.isEmpty()) {
      this.fetchItems(this.props);
    }
  }

  // shouldComponentUpdate(nextProps, nextState) { // eslint-disable-line no-unused-vars
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
    const stateChanged = !Immutable.is(this.props.state, nextProps.state);
    const baseFilterMap = (Immutable.fromJS(this.props.baseFilter));
    const baseFilterNextMap = (Immutable.fromJS(nextProps.baseFilter));
    const baseFilterChanged = !Immutable.is(baseFilterMap, baseFilterNextMap);
    const refreshStringChanged = this.props.refreshString !== nextProps.refreshString;
    if (pageChanged || sizeChanged || filterChanged ||
      sortChanged || stateChanged || baseFilterChanged || refreshStringChanged) {
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

  onStateChange = (states) => {
    const { itemsType } = this.props;
    this.props.dispatch(setListPage(itemsType, 0));
    this.props.dispatch(setListState(itemsType, states));
  }

  onClickEditItem = (item) => {
    const { itemsType, itemType } = this.props;
    const itemId = item.getIn(['_id', '$id']);
    this.props.router.push(`${itemsType}/${itemType}/${itemId}`);
  }

  onClickViewItem = (item) => {
    const { itemsType, itemType } = this.props;
    const itemId = item.getIn(['_id', '$id']);
    this.props.router.push(`${itemsType}/${itemType}/${itemId}?action=view`);
  }

  buildQuery = (props) => {
    const {
      collection,
      page,
      size,
      sort,
      filter,
      state,
      baseFilter,
      projectFields,
      api,
      showRevisionBy,
    } = props;
    const project = showRevisionBy ? { ...projectFields, ...{ to: 1, from: 1, revision_info: 1 } } : projectFields;
    const query = { ...filter.toObject(), ...baseFilter };
    const request = {
      action: api,
      entity: collection,
      params: [
        { sort: JSON.stringify(sort) },
        { query: JSON.stringify(query) },
        { project: JSON.stringify(project) },
        { page },
        { size },
      ],
    };
    if (showRevisionBy) {
      request.params.push(
          { states: JSON.stringify(state) },
      );
    }
    return request;
  }

  fetchItems = (props) => {
    const { itemsType } = props;
    this.props.dispatch(getList(itemsType, this.buildQuery(props)));
  }

  parserState = (item) => {
    const { itemType } = this.props;
    return (
      <StateDetails item={item} itemName={itemType} />
    );
  };

  addStateColumn = fields => ([
    { id: 'state', parser: this.parserState, cssClass: 'state' },
    ...fields,
  ])

  getListActions = () => {
    const { listActions } = this.props;
    if (typeof listActions === 'undefined') {
      return [{
        type: 'add',
        label: 'Add New',
        actionStyle: 'default',
        showIcon: true,
        onClick: this.onClickNew,
        actionSize: 'xsmall',
        actionClass: 'btn-primary',
      }];
    }
    if (listActions === false) {
      return [];
    }
    return listActions;
  }

  renderPanelHeader = () => {
    const { itemsType } = this.props;
    return (
      <div>
        List of all available {changeCase.noCase(itemsType)}
        <div className="pull-right">
          <Actions actions={this.getListActions()} />
        </div>
      </div>
    );
  }

  renderFilter = () => {
    const { filter, filterFields } = this.props;
    return (
      <Filter filter={filter} fields={filterFields} onFilter={this.onFilter}>
        { this.renderStateFilter() }
      </Filter>
    );
  }

  renderStateFilter = () => {
    const { state, showRevisionBy } = this.props;
    if (!showRevisionBy) {
      return null;
    }
    return (
      <div className="pull-right">
        <State states={state} onChangeState={this.onStateChange} />
      </div>
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

  getActions = () => {
    const { actions, showRevisionBy } = this.props;
    const editColumn = showRevisionBy ? 1 : 0;
    const editAction = { type: 'edit', showIcon: true, helpText: 'Edit', onClick: this.onClickEditItem, show: true, onClickColumn: editColumn };
    const viewAction = { type: 'view', showIcon: true, helpText: 'View', onClick: this.onClickViewItem, show: true, onClickColumn: editColumn };

    return actions.map((action) => {
      switch (action.type) {
        case 'edit': return Object.assign(editAction, action);
        case 'view': return Object.assign(viewAction, action);
        default: return action;
      }
    });
  }

  renderList = () => {
    const { items, sort, tableFields, showRevisionBy } = this.props;
    const actions = this.getActions();
    const fields = (!showRevisionBy) ? tableFields : this.addStateColumn(tableFields);
    return (
      <List
        sort={sort}
        items={items}
        fields={fields}
        onSort={this.onSort}
        actions={actions}
      />
    );
  }

  render() {
    const { items } = this.props;
    if (items === null) {
      return (<LoadingItemPlaceholder />);
    }
    return (
      <Row>
        <Col lg={12} >
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
  state: state.entityList.state.get(props.itemsType),
  nextPage: state.entityList.nextPage.get(props.itemsType),
  sort: state.entityList.sort.get(props.itemsType),
  filter: state.entityList.filter.get(props.itemsType),
  size: state.entityList.size.get(props.itemsType),
  inProgress: state.progressIndicator > 0,
});
export default withRouter(connect(mapStateToProps)(EntityList));
