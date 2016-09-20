import React from "react";

const ComposedNodeDetail = React.createClass({

  render() {
    var node = this.props.node;
    return (
      <div>
        Node Name: {node.Name}<br/>
        Description: {node.Description}<br/>
        System Type: {node.SystemType}<br/>
        Model: {node.Model}<br/>
        Serial Number: {node.SerialNumber}<br/>
        UUID: {node.UUID}<br/>
        BIOS Version: {node.BiosVersion}<br/>
        State: {node.Status.State}<br/>
        Health: {node.Status.Health}<br/>
        Processor Count: {node.Processors.Count}<br/>
        Processor Model: {node.Processors.Model}<br/>
        Total Memory: {node.Memory.TotalSystemMemoryGiB} GiB<br/>
        Composed Node State: {node.ComposedNodeState}<br/>
        Boot Source Override Enabled: {node.Boot.BootSourceOverrideEnabled}<br/>
        Boot Source Override Target: {node.Boot.BootSourceOverrideTarget}
      </div>
    );
  }
});

export default ComposedNodeDetail
