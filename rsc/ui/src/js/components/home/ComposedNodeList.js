import React from "react";
import NodeList from "./NodeList";

const ComposedNodeList = React.createClass({

  render: function() {
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
