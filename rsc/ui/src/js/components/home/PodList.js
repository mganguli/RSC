import React from "react";
import ResourceList from "./ResourceList";

const PodList = React.createClass({

  render: function() {
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
