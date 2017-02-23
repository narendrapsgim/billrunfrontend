import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import classNames from 'classnames';
import StateIcon from './StateIcon';
import { getItemDateValue } from '../../common/Util';


const RevisionTimeline = ({ revisions, size, item, start }) => {
  const more = revisions.size > size && (start + size !== revisions.size);
  const renderMore = type => (
    <li key={`${item.getIn(['_id', '$id'], '')}-more-${type}`} className={`more ${type}`}>
      <div style={{ lineHeight: '12px' }}>&nbsp;</div>
      <div>
        <div>&nbsp;</div>
        <div>&nbsp;</div>
      </div>
    </li>
  );
  const renderRevision = (revision, key, list) => {
    const from = getItemDateValue(revision, 'from');
    const to = getItemDateValue(revision, 'to');
    const isActive = revision.getIn(['_id', '$id'], '') === item.getIn(['_id', '$id'], '');
    const activeClass = classNames('revision', {
      active: isActive,
      first: key === 0,
      last: key === (list.size - 1),
    });
    return (
      <li key={`${revision.getIn(['_id', '$id'], '')}`} className={activeClass}>
        <div>
          <div>
            <StateIcon from={from.toISOString()} to={to.toISOString()} />
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

  return (
    <ul className="revision-history-list">
      { more && renderMore('before') }
      { revisions
        .slice(start, start + size)
        .reverse()
        .map(renderRevision)
      }
      { (start > 0) && renderMore('after') }
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
