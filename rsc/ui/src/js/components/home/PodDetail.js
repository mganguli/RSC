import React from "react";

const PodDetail = React.createClass({

  render() {
    var pod = this.props.pod;
    return (
      <div>
        Pod Name: {pod.Name}<br/>
        Description: {pod.Description}<br/>
        State: {pod.Status.State}<br/>
        Health: {pod.Status.Health}
      </div>
    );
  }
});

export default PodDetail
