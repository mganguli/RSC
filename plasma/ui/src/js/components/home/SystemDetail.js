import React from "react";

const SystemDetail = React.createClass({

  render() {
    var system = this.props.system;
    return (
      <div>
        System Name: {system.Name}<br/>
        Description: {system.Description}<br/>
        System Type: {system.SystemType}<br/>
        UUID: {system.UUID}<br/>
        Host Name: {system.HostName}<br/>
        State: {system.Status.State}<br/>
        Health: {system.Status.Health}<br/>
        Power State: {system.PowerState}<br/>
        BIOS Version: {system.BiosVersion}<br/>
        Processor Count: {system.ProcessorSummary.Count}<br/>
        System Memory: {system.MemorySummary.TotalSystemMemoryGiB} GiB
      </div>
    );
  }
});

export default SystemDetail
