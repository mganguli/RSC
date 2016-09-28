import React from "react";
import ResourceList from "./ResourceList";

var config = require('../../config.js');
var util = require('../../util.js');

const RackList = React.createClass({

  componentWillMount() {
    this.getRacks();
    setInterval(this.getRacks, 2000);
  },

  getRacks() {
    util.getRacks(this.setRacks);
  },

  setRacks(racks) {
    this.props.onUpdateRacks(racks);
  },

  render() {
    return (
      <ResourceList
        onShowDetail={this.props.onShowDetail}
        items={this.props.rackList}
        header="RACKS"
      />
    );
  }
});

export default RackList
