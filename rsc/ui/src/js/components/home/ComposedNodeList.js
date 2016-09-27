import React from "react";
import NodeList from "./NodeList";

var util = require('../../util.js');

const ComposedNodeList = React.createClass({

  getInitialState() {
    return {composedNodes: []};
  },

  componentWillMount() {
    this.getComposedNodes();
    setInterval(this.getComposedNodes, 2000);
  },

  getComposedNodes() {
    util.getNodes(this.setData);
  },

  setData(composedNodes) {
    this.setState({composedNodes: composedNodes});
  },

  render() {
    return (
      <NodeList updateList={this.getComposedNodes} onShowDetail={this.props.onShowDetail} items={this.state.composedNodes} header="COMPOSED NODES" />
    );
  }
});

export default ComposedNodeList
