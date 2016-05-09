import React, { Component } from 'react';
import ChevronRight from 'material-ui/svg-icons/navigation/chevron-right';
import KeyboardArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down';

const arrowStyle = {
  marginLeft: '-10px',
  paddingTop: '10px'
}

export default class Collapsible extends Component {
  constructor(props) {
    super(props);
    let { collapsed } = props;
    this.state = {collapsed};
    this.innerDivStyle = this.innerDivStyle.bind(this);
    this.toggleCollapse = this.toggleCollapse.bind(this);
    this.printChevron = this.printChevron.bind(this);
  }

  innerDivStyle() {
    if (this.state.collapsed) {
      return {
        display: "none"
      };
    }

    return {
      display: "block"
    };
  }

  toggleCollapse() {
    let collapsed = !this.state.collapsed;
    this.setState({collapsed});
  }

  printChevron() {
    if (this.state.collapsed) return ( <ChevronRight style={arrowStyle} /> );
    return ( <KeyboardArrowDown style={arrowStyle} /> );
  }

  render() {
    let { label, content } = this.props;
    let style = this.innerDivStyle();
    let chevron = this.printChevron();
    return (
      <div className="col-md-10" style={{marginBottom: "10px"}}>
        <h4 onClick={this.toggleCollapse} style={{cursor: "pointer"}}>
          {chevron}
          <span style={{verticalAlign: 'bottom'}}>{label}</span>
        </h4>
        <div style={style}>
          {content}
        </div>
      </div>
    );
  }
}
