import React from "react";
import NodeList from "./NodeList";

var util = require('../../util.js');

const ComposedNodeList = React.createClass({

  componentWillMount() {
    this.getNodes();
    setInterval(this.getNodes, 2000);
  },

  getNodes() {
    util.getNodes(this.setNodes);
  },

  setNodes(nodes) {
    this.props.onUpdateNodes(nodes);
  },

  render() {
    return (
      <NodeList
        updateList={this.getNodes}
        onShowDetail={this.props.onShowDetail}
        items={this.props.nodeList}
        header="COMPOSED NODES"
      />
    );
  }
});

export default ComposedNodeList
