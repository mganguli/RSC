import React from "react";
import ResourceList from "./ResourceList";

var config = require('../../config.js');
var util = require('../../util.js');

const PodList = React.createClass({

  getInitialState() {
    return {pods: []};
  },

  componentWillMount() {
    this.getPods();
    setInterval(this.getPods, 2000);
  },

  getPods() {
    var pods = util.getPods(this.setData);
  },

  setData(pods) {
    this.setState({pods: pods});
  },

  render() {
    return (
      <ResourceList onShowDetail={this.props.onShowDetail} items={this.state.pods} header="PODS" />
    );
  }
});

export default PodList
