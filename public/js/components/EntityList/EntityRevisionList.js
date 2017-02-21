import React, { PropTypes } from 'react';
import { withRouter } from 'react-router';
import Immutable from 'immutable';
import moment from 'moment';
import { StateIcon } from '../Elements';
import List from '../../components/List';


const EntityRevisionList = (props) => {
  const { items } = props;
  const parserState = (item) => {
    const from = item.getIn(['from', 'sec'], '');
    const to = item.getIn(['to', 'sec'], '');
    return (<StateIcon from={from} to={to} />);
  };
  const parseDate = (item) => {
    const from = moment.unix(item.getIn(['from', 'sec'], 0));
    return from.format(globalSetting.dateFormat);
  };
  const fields = [
    { id: 'state', parser: parserState, cssClass: 'state' },
    { id: 'from', title: 'Start date', parser: parseDate },
  ];

  const onClickEdit = (item) => {
    const { itemsType, itemType } = props;
    const itemId = item.getIn(['_id', '$id']);
    props.router.push(`${itemsType}/${itemType}/${itemId}`);
  };

  return (<List items={items} fields={fields} edit={true} onClickEdit={onClickEdit} />);
};

EntityRevisionList.defaultProps = {
  items: Immutable.List(),
};

EntityRevisionList.propTypes = {
  items: PropTypes.instanceOf(Immutable.List),
  router: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default withRouter(EntityRevisionList);
