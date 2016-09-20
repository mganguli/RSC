import React from "react";

const SystemDetail = React.createClass({

  render() {
    var system = this.props.system;
    return (
      <div>
        {JSON.stringify(system)}
      </div>
    );
  }
});

export default SystemDetail
