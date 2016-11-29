import React from 'react';
import { connect } from 'react-redux';

const RealtimeMapping = (props) => {
  const { onChange } = props;

  return (
    <div className="RealtimeMapping">
      rtm
    </div>
  );
}

export default connect()(RealtimeMapping);
