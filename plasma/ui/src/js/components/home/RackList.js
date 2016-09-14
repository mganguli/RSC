import React from "react";
import ItemList from "./ItemList";

var config = require('../../../config.js');
var util = require('./util.js');

const RackList = React.createClass({

  getInitialState() {
    return {racks: []};
  },

  componentWillMount() {
    this.getRacks();
  },

  getRacks() {
    var url = config.url + '/redfish/v1/Chassis';
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
      <ItemList onShowDetail={this.props.onShowDetail} items={this.state.racks} header="RACKS" />
    );
  }
});

export default RackList
