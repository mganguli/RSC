import React from "react";
import ResourceList from "./ResourceList";

var config = require('../../config.js');
var util = require('../../util.js');

const PodList = React.createClass({

  componentWillMount() {
    this.getPods();
    setInterval(this.getPods, 2000);
  },

  getPods() {
    var pods = util.getPods(this.setPods);
  },

  setPods(pods) {
    this.props.onUpdatePods(pods);
  },

  render() {
    return (
      <ResourceList
        onShowDetail={this.props.onShowDetail}
        items={this.props.podList}
        header="PODS"
      />
    );
  }
});

export default PodList
