import React from "react";

const RackDetail = React.createClass({

  render() {
    var rack = this.props.rack;
    return (
      <div>
        Rack Name: {rack.Name}<br/>
        Description: {rack.Description}<br/>
        Manufacturer: {rack.Manufacturer}<br/>
        Serial Number: {rack.SerialNumber}<br/>
      </div>
    );
  }
});

export default RackDetail
