import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import classNames from 'classnames';
import StateIcon from './StateIcon';
import { getItemDateValue, isItemClosed, getItemId } from '../../common/Util';


const RevisionTimeline = ({ revisions, size, item, start }) => {
  const more = revisions.size > size && (start + size !== revisions.size);
  const lastItem = revisions
      .slice(start, start + 1)
      .reverse()
      .get(0, Immutable.Map());
  const end = isItemClosed(lastItem) ? ((start + size) - 1) : start + size;
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
    const from = getItemDateValue(revision, 'from');
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
            { from.format('MMM DD')}
            <br />
            { from.format('YYYY')}
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
        .slice(start, end)
        .reverse()
        .map(renderRevision)
      }
      { isItemClosed(lastItem)
        ? renderClosedRevision()
        : (start > 0) && renderMore('after')
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
