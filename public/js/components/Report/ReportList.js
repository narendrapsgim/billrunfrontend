import React, { PropTypes, Component } from 'react';
import Immutable from 'immutable';
import List from '../List';
import Pager from '../EntityList/Pager';
import { getConfig } from '../../common/Util';


class ReportList extends Component {

  static propTypes = {
    items: PropTypes.instanceOf(Immutable.List),
    fields: PropTypes.instanceOf(Immutable.List),
    size: PropTypes.number,
    page: PropTypes.number,
    nextPage: PropTypes.bool,
    onChangePage: PropTypes.func,
    onChangeSize: PropTypes.func,
  }

  static defaultProps = {
    items: Immutable.List(),
    fields: Immutable.List(),
    size: getConfig(['list', 'defaultItems'], 10),
    page: 0,
    nextPage: false,
    onChangePage: () => {},
    onChangeSize: () => {},
  }

  shouldComponentUpdate(nextProps) {
    const { items, fields, page, nextPage, size } = this.props;
    return (
      !Immutable.is(items, nextProps.items)
      || !Immutable.is(fields, nextProps.fields)
      || size !== nextProps.size
      || page !== nextProps.page
      || nextPage !== nextProps.nextPage
    );
  }

  render() {
    const { items, size, page, nextPage, fields } = this.props;
    return (
      <div className="report-list">
        <List
          items={items}
          fields={fields.toJS()}
        />
        <Pager
          page={page}
          size={size}
          count={items.size}
          nextPage={nextPage}
          onChangePage={this.props.onChangePage}
          onChangeSize={this.props.onChangeSize}
        />
      </div>
    );
  }

}

export default ReportList;
