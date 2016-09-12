import React from "react";
import ItemList from "./ItemList";

var util = require('./util.js')

const Racks = React.createClass({

  getInitialState() {
    return {racks: []};
  },

  componentWillMount() {
    this.getRacks();
  },

  getRacks() {
    var url = 'http://127.0.0.1:6000/redfish/v1/Chassis';
    $.ajax({
      url: url,
      type: 'GET',
      dataType: 'json',
      cache: false,
      success: function(resp) {
        var chassis = util.listMembers(resp)
        var racks = util.filterChassis(chassis, 'Rack');
        this.setData(racks);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(url, status, err.toString());
      }.bind(this)
    });
  },

  setData(racks) {
    this.setState({racks: racks});
  },

  render() {
    return (
      <ItemList items={this.state.racks} header="RACKS" />
    );
  }
});

export default Racks
