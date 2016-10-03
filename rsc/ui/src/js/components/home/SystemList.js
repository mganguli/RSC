import React from "react";
import ResourceList from "./ResourceList";

const SystemList = React.createClass({

  render: function() {
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
