import React from "react";
import ResourceList from "./ResourceList";

var config = require('../../config.js');
var util = require('../../util.js');

const RackList = React.createClass({

  getInitialState() {
    return {racks: []};
  },

  componentWillMount() {
    this.getRacks();
    setInterval(this.getRacks, 2000);
  },

  getRacks() {
    util.getRacks(this.setData);
  },

  setData(racks) {
    this.setState({racks: racks});
  },

  render() {
    return (
      <ResourceList onShowDetail={this.props.onShowDetail} items={this.state.racks} header="RACKS" />
    );
  }
});

export default RackList
