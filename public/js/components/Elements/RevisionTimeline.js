import React, { PropTypes } from 'react';
import moment from 'moment';
import Immutable from 'immutable';
import classNames from 'classnames';
import StateIcon from './StateIcon';


const RevisionTimeline = ({ revisions, size, item, start }) => {
  const more = revisions.size > size && (start + size !== revisions.size);
  const renderMore = type => (
    <li key={`${item.getIn(['_id', '$id'], '')}-more-${type}`} className={`more ${type}`}>
      <div style={{ lineHeight: '12px' }}>
        &nbsp;
      </div>
      <div>
        <div>&nbsp;</div>
        <div>&nbsp;</div>
      </div>
    </li>
  );
  const renderRevision = (revision, key) => {
    const from = revision.getIn(['from', 'sec'], '');
    const to = revision.getIn(['to', 'sec'], '');
    const isActive = revision.getIn(['_id', '$id'], '') === item.getIn(['_id', '$id'], '');
    const activeClass = classNames('revision', {
      active: isActive,
      first: key === 0,
      last: key === (size - 1),
    });
    return (
      <li key={`${revision.getIn(['_id', '$id'], '')}`} className={activeClass}>
        <div>
          <div>
            <StateIcon from={from} to={to} />
          </div>
          <small className="date">
            { moment.unix(revision.getIn(['from', 'sec'], '')).format('MMM DD')}
            <br />
            { moment.unix(revision.getIn(['from', 'sec'], '')).format('YYYY')}
          </small>
        </div>
      </li>
    );
  };
  // console.log('slice: ', start, '-', size);
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
