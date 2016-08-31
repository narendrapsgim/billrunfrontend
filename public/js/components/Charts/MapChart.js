import React from 'react';
import Datamap from 'react-datamaps';


export default class MapChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Datamap {...this.props} />
    );
  }
}
