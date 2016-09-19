import React from "react";

const ComposedNodeDetail = React.createClass({

  render() {
    var node = this.props.node;
    return (
      <div>
        {JSON.stringify(node)}
      </div>
    );
  }
});

export default ComposedNodeDetail
