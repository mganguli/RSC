import React from "react";

const RackDetail = React.createClass({

  render() {
    var rack = this.props.rack;
    return (
      <div>
        {JSON.stringify(rack)}
      </div>
    );
  }
});

export default RackDetail
