import React from "react";
import ResourceList from "./ResourceList";

var config = require('../../config.js');
var util = require('../../util.js');

const SystemList = React.createClass({

  getInitialState() {
    return {systems: []};
  },

  componentWillMount() {
    this.getSystems();
    setInterval(this.getSystems, 2000);
  },

  getSystems() {
    util.getSystems(this.setData);
  },

  setData(systems) {
    this.setState({systems: systems});
  },

  render() {
    return (
      <ResourceList onShowDetail={this.props.onShowDetail} items={this.state.systems} header="SYSTEMS" />
    );
  }
});

export default SystemList
