import React from "react";
import ResourceList from "./ResourceList";

const RackList = React.createClass({

  render: function() {
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
