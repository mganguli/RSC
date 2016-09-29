import React from "react";
import ResourceList from "./ResourceList";

var config = require('../../config.js');
var util = require('../../util.js');

const SystemList = React.createClass({

  componentWillMount() {
    this.getSystems();
    setInterval(this.getSystems, 2000);
  },

  getSystems() {
    util.getSystems(this.setSystems);
  },

  setSystems(systems) {
    this.props.onUpdateSystems(systems);
  },

  render() {
    return (
      <ResourceList
        onShowDetail={this.props.onShowDetail}
        items={this.props.systemList}
        header="SYSTEMS"
      />
    );
  }
});

export default SystemList
