import React from "react";

const PodDetail = React.createClass({

  render() {
    var pod = this.props.pod;
    return (
      <div>
        {JSON.stringify(pod)}
      </div>
    );
  }
});

export default PodDetail
