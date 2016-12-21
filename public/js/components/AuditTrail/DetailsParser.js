import React from 'react';
import Immutable from 'immutable';
import { Button } from 'react-bootstrap';

const DetailsParser = ({ item, openDiff }) => {
  const details = item.get('details', '');
  const collection = item.get('collection', '');
  const newid = item.getIn(['new_oid', '$id'], '');
  const oldid = item.getIn(['old_oid', '$id'], '');
  const diffData = { collection, oldid, newid };
  const onOpenDiff = () => { openDiff(diffData); };
  let message = '';
  if (newid) {
    if (!oldid) {
      message = <span>Created</span>;
    } else {
      message = (
        <Button bsStyle="link" onClick={onOpenDiff} style={{ width: '100%' }}>
          <i className="fa fa-compress" />&nbsp;Compare
        </Button>
      );
    }
  } else if (!newid && oldid) {
    message = <span>Deleted</span>;
  }
  if (details.length) {
    message = (
      <div>
        <p>{details}</p>
        {message}
      </div>
    );
  }
  return message;
};

DetailsParser.defaultProps = {
  item: Immutable.Map(),
};

DetailsParser.propTypes = {
  item: React.PropTypes.instanceOf(Immutable.Map),
  openDiff: React.PropTypes.func.isRequired,
};

export default DetailsParser;
