import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  LineWidget,
  LineAreaWidget,
  LineAreaStackedWidget,
  BarWidget,
  BarStackedWidget,
  BarHorizontalWidget,
  BarHorizontalStrackedWidget,
  PieWidget,
  DoughnutWidget,
  PolarAreaWidget,
  BubbleWidget } from '../Charts';


class Dashboard extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { stuff } = this.props;
    let stuffVar = stuff.get('first_report');

    var width = 525, height = 400, width3 = 350;

    let dataBarWidget = {
      title: 'Revenue VS Subscribers',
      x: [
        { label : 'Revenue', values : [65, -39, 120, 81, 56, 55] },
        { label : 'Subsctibers', values : [75, 29, 10, 101, 86, 105] },
        // { label : 'Plans', values : [10, 59, 100, 101, 86, 10] },
        // { label : 'B4', values : [75, 79, 70, 71, 70, 55] },
        // { label : 'B5', values : [55, 24, 10, 101, 86, 55] },
        // { label : 'B6', values : [65, 28, 10, 101, 86, 55] },
        // { label : 'B7', values : [25, 109, 10, 101, 86, 55] },
      ],
      y: ["January", "February", "March", "April", "May", "June"],
    };

    let dataLineWidget = dataBarWidget;
    let dataAreaWidget = dataBarWidget;

    let dataPieWidget = {
      title: 'Subscribers per Plan',
      labels: ["Plan A", "Plan B", "Plan C", "Plan D", "Plan E", "Plan F"],
      values: [65, 59, 80, 81, 56, 5]
    };

    let dataBubbleWidget = {
      title: 'Revenue VS Subscribers',
      labels: ["Plan A", "Plan B", "Plan C", "Plan D", "Plan E", "Plan F"],
      x: [1, 2, 3, 4, 5, 6],
      y: [65, -39, 120, 81, 56, 55],
      z: [7, 2, 20, 10, 8, 5]
    }


    return (
      <div className="Dashboard container" >
        <div style={{display:'inline-block', margin:'5px'}}>
          <LineWidget width={width} height={height} data={dataLineWidget} options={{legend:{display:false}}}/>
        </div>
        <div style={{display:'inline-block', margin:'5px'}}>
          <LineAreaWidget width={width} height={height} data={dataAreaWidget} options={{legend:{display:false}}}/>
        </div>


        <div style={{display:'inline-block', margin:'5px'}}>
          <LineWidget width={width3} height={height} data={dataLineWidget} options={{legend:{display:false}}}/>
        </div>
        <div style={{display:'inline-block', margin:'5px'}}>
          <LineWidget width={width3} height={height} data={dataLineWidget} options={{legend:{display:false}}}/>
        </div>
        <div style={{display:'inline-block', margin:'5px'}}>
          <LineWidget width={width3} height={height} data={dataLineWidget} options={{legend:{display:false}}}/>
        </div>


        <div style={{display:'inline-block', margin:'5px'}}>
          <PieWidget width={width} height={height} data={dataPieWidget} options={{legend:{display:false}}}/>
        </div>
        <div style={{display:'inline-block', margin:'5px'}}>
          <DoughnutWidget width={width} height={height} data={dataPieWidget} options={{legend:{display:false}}}/>
        </div>

        <div style={{display:'inline-block', margin:'5px'}}>
          <PolarAreaWidget width={width} height={height} data={dataPieWidget} options={{legend:{display:false}}}/>
        </div>


        <div style={{display:'inline-block', margin:'5px'}}>
          <BarWidget width={width} height={height} data={dataBarWidget} options={{legend:{display:false}}}/>
        </div>
        <div style={{display:'inline-block', margin:'5px'}}>
          <BarStackedWidget width={width} height={height} data={dataBarWidget} options={{legend:{display:false}}}/>
        </div>


        <div style={{display:'inline-block', margin:'5px'}}>
          <BubbleWidget width={width} height={height} data={dataBubbleWidget} options={{legend:{display:false}}}/>
        </div>


        <div style={{display:'inline-block', margin:'5px'}}>
          <LineAreaStackedWidget width={width} height={height} data={dataAreaWidget} options={{legend:{display:false}}}/>
        </div>
        <div style={{display:'inline-block', margin:'5px'}}>
          <BarHorizontalWidget width={width} height={height} data={dataBarWidget} options={{legend:{display:false}}}/>
        </div>
        <div style={{display:'inline-block', margin:'5px'}}>
          <BarHorizontalStrackedWidget width={width} height={height} data={dataBarWidget} options={{legend:{display:false}}}/>
        </div>

      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return {stuff: state};
}

export default connect(mapStateToProps)(Dashboard);
