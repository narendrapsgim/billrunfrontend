import React, { Component } from 'react';

import {Tabs, Tab} from 'material-ui/Tabs';

import Collections from './Collections';

const styles = {
  inkBar: {
    backgroundColor: "#0091FA",
    color: "black"
  },
  tabItem: {
    backgroundColor: "white",
    color: "black"
  },
  tab: {
    color: "#0091FA"
  }
};

export default class Settings extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    
    this.state = {
      current: "Collections"
    };
  }

  handleChange(value) {
    this.setState({current: value});
  }
  
  render() {
    return (
      <Tabs value={this.state.current}
            onChange={this.handleChange}
            inkBarStyle={styles.inkBar}
            tabItemContainerStyle={styles.tabItem}>
        <Tab label="Collections" value="Collections" style={styles.tab}>
          <Collections />
        </Tab>
      </Tabs>
    );
  }
}
