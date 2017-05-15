import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import classNames from 'classnames';
import StateIcon from './StateIcon';
import { getItemDateValue, isItemClosed, getItemId } from '../../common/Util';


const RevisionTimeline = ({ revisions, size, item, start }) => {
  const index = revisions.findIndex(revision => getItemId(revision) === getItemId(item));
  const from = revisions.size <= size ? 0 : start;
  const lastItem = revisions
      .slice(from, from + 1)
      .reverse()
      .get(0, Immutable.Map());
  const addClosedIcon = isItemClosed(lastItem) && ((index !== revisions.size - 1 && size <= revisions.size) || size > revisions.size);
  const more = (revisions.size > size && (from + size < revisions.size)) || (addClosedIcon && revisions.size >= size);
  const end = addClosedIcon ? ((from + size) - 1) : from + size;
  const renderMore = type => (
    <li key={`${getItemId(item, '')}-more-${type}`} className={`more ${type}`}>
      <div style={{ lineHeight: '12px' }}>&nbsp;</div>
      <div>
        <div>&nbsp;</div>
        <div>&nbsp;</div>
      </div>
    </li>
  );
  const renderRevision = (revision, key, list) => {
    const fromDate = getItemDateValue(revision, 'from');
    const isActive = getItemId(revision, '') === getItemId(item, '');
    const activeClass = classNames('revision', {
      active: isActive,
      first: key === 0,
      last: key === (list.size - 1),
    });
    return (
      <li key={`${getItemId(revision, '')}`} className={activeClass}>
        <div>
          <div>
            <StateIcon status={revision.getIn(['revision_info', 'status'], '')} />
          </div>
          <small className="date">
            { fromDate.format('MMM DD')}
            <br />
            { fromDate.format('YYYY')}
          </small>
        </div>
      </li>
    );
  };

  const renderClosedRevision = () => {
    const to = getItemDateValue(lastItem, 'to');
    return (
      <li key={`${getItemId(lastItem, '')}-closed`} className="closed">
        <div>
          <div><i style={{ fontSize: 19 }} className="fa fa-times-circle" /></div>
          <small className="date">
            { to.format('MMM DD')}
            <br />
            { to.format('YYYY')}
          </small>
        </div>
      </li>
    );
  };

  return (
    <ul className="revision-history-list">
      { more && renderMore('before') }
      { revisions
        .slice(from, end)
        .reverse()
        .map(renderRevision)
      }
      { addClosedIcon
        ? renderClosedRevision()
        : (from > 0 || (!addClosedIcon && isItemClosed(lastItem))) && renderMore('after')
      }
    </ul>
  );
};


RevisionTimeline.defaultProps = {
  revisions: Immutable.List(),
  item: Immutable.Map(),
  size: 5,
  start: 0,
};

RevisionTimeline.propTypes = {
  revisions: PropTypes.instanceOf(Immutable.List),
  item: PropTypes.instanceOf(Immutable.Map),
  size: PropTypes.number,
  start: PropTypes.number,
};

export default RevisionTimeline;
